"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Calendar, Check, X, Clock } from "lucide-react";
import { staffService, Staff, StaffAttendance } from "@/services/staffService";

type AttendanceStatus = "Present" | "Absent" | "Half Day" | "Leave";

export default function StaffAttendancePage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [existingAttendance, setExistingAttendance] = useState<StaffAttendance[]>([]);

    useEffect(() => {
        loadStaff();
    }, []);

    useEffect(() => {
        loadAttendanceForDate();
    }, [selectedDate, staff]);

    const loadStaff = async () => {
        try {
            const data = await staffService.getStaff();
            setStaff(data.filter(s => s.status === "Active"));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadAttendanceForDate = async () => {
        if (staff.length === 0) return;
        try {
            const data = await staffService.getAttendanceForDate(selectedDate);
            setExistingAttendance(data);

            // Pre-fill attendance state
            const attendanceMap: Record<string, AttendanceStatus> = {};
            data.forEach(a => {
                attendanceMap[a.staffId] = a.status;
            });
            // Default unmarked staff to "Present"
            staff.forEach(s => {
                if (!attendanceMap[s.id!]) {
                    attendanceMap[s.id!] = "Present";
                }
            });
            setAttendance(attendanceMap);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = (staffId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [staffId]: status }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const entries = staff.map(s => ({
                staffId: s.id!,
                staffName: s.fullName,
                date: selectedDate,
                status: attendance[s.id!] || "Present"
            }));
            await staffService.markAttendance(entries);
            alert("Attendance saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save attendance.");
        } finally {
            setSaving(false);
        }
    };

    const statusButtons: { status: AttendanceStatus, icon: any, color: string, bg: string }[] = [
        { status: "Present", icon: Check, color: "text-[#1E8E3E]", bg: "bg-[#E6F4EA]" },
        { status: "Absent", icon: X, color: "text-[#D93025]", bg: "bg-[#FCE8E6]" },
        { status: "Half Day", icon: Clock, color: "text-[#F9AB00]", bg: "bg-[#FEF7E0]" },
        { status: "Leave", icon: Calendar, color: "text-[#5F6368]", bg: "bg-[#F1F3F4]" }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/staff" className="p-2 hover:bg-[#E8EAED] rounded-full text-[#5F6368] transition-colors">
                        <ArrowLeft size={22} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-normal text-[#202124]">Staff Attendance</h1>
                        <p className="text-sm text-[#5F6368] mt-1">Mark daily attendance for all staff members</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || staff.length === 0}
                    className="btn-primary flex items-center gap-2 shadow-sm"
                >
                    {saving ? (
                        <><Loader2 size={18} className="animate-spin" /><span>Saving...</span></>
                    ) : (
                        <><Save size={18} /><span>Save Attendance</span></>
                    )}
                </button>
            </div>

            {/* Date Selector */}
            <div className="card-base bg-white border border-[#E8EAED] p-4 rounded-lg shadow-sm flex items-center gap-4">
                <div className="flex items-center gap-2 text-[#5F6368]">
                    <Calendar size={18} />
                    <span className="text-sm font-medium">Select Date:</span>
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-[#DADCE0] rounded-md text-[#202124] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                />
            </div>

            {/* Attendance Grid */}
            <div className="card-base bg-white p-0 overflow-hidden shadow-sm border border-[#E8EAED] rounded-lg">
                {loading ? (
                    <div className="p-12 text-center text-[#5F6368]">Loading staff...</div>
                ) : staff.length === 0 ? (
                    <div className="p-12 text-center text-[#5F6368]">No active staff members found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F8F9FA] border-b border-[#E8EAED]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Staff Member</th>
                                    <th className="px-6 py-4 text-left text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-center text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8EAED] bg-white">
                                {staff.map((member) => (
                                    <tr key={member.id} className="hover:bg-[#F8F9FA] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center text-sm font-medium">
                                                    {member.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-[#202124]">{member.fullName}</p>
                                                    <p className="text-[11px] text-[#9AA0A6]">{member.staffCode}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[14px] text-[#5F6368]">{member.role}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {statusButtons.map(btn => {
                                                    const Icon = btn.icon;
                                                    const isActive = attendance[member.id!] === btn.status;
                                                    return (
                                                        <button
                                                            key={btn.status}
                                                            onClick={() => handleStatusChange(member.id!, btn.status)}
                                                            className={`p-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all border ${isActive
                                                                ? `${btn.bg} ${btn.color} border-current`
                                                                : 'bg-white text-[#9AA0A6] border-[#E8EAED] hover:border-[#DADCE0]'
                                                                }`}
                                                            title={btn.status}
                                                        >
                                                            <Icon size={14} />
                                                            <span className="hidden sm:inline">{btn.status}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
