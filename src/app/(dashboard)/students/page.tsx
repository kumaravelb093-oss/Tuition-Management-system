"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, User } from "lucide-react";
import { studentService, Student } from "@/services/studentService";
import { MoreVertical, Eye, Edit, CreditCard, FileText, Receipt, TrendingUp, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await studentService.getStudents();
            setStudents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-normal text-[#202124]">Students</h1>
                    <p className="text-sm text-[#5F6368] mt-1">Manage admissions and student records</p>
                </div>
                <Link href="/students/add" className="btn-primary flex items-center gap-2 shadow-sm">
                    <Plus size={18} />
                    <span>Add Student</span>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA0A6]" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name / ID / Phone..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DADCE0] rounded-lg text-[#202124] placeholder-[#9AA0A6] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] shadow-sm transition-shadow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* <button className="btn-secondary flex items-center gap-2 text-[#5F6368] border-[#DADCE0] bg-white hover:bg-[#F8F9FA]">
          <Filter size={18} />
          <span>Filter</span>
        </button> */}
            </div>

            {/* Data Table Container */}
            <div className="card-base bg-white p-0 overflow-hidden shadow-sm border border-[#E8EAED] rounded-lg">
                {loading ? (
                    <div className="p-12 text-center text-[#5F6368]">
                        Loading student records...
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto w-12 h-12 bg-[#F1F3F4] rounded-full flex items-center justify-center mb-3">
                            <User size={24} className="text-[#9AA0A6]" />
                        </div>
                        <h3 className="text-[#202124] font-medium">No students found</h3>
                        <p className="text-[#5F6368] text-sm mt-1">Try adjusting your search or add a new student.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F8F9FA] border-b border-[#E8EAED]">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-right text-[12px] font-medium text-[#5F6368] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8EAED] bg-white">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-[#F8F9FA] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#1A73E8] text-white flex items-center justify-center text-xs font-medium">
                                                    {student.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-[#202124]">{student.fullName}</p>
                                                    <p className="text-[12px] text-[#5F6368]">ID: {student.studentCode || "DT-Pending"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[14px] text-[#202124]">
                                            {student.grade}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[14px] text-[#202124]">{student.phone}</p>
                                            <p className="text-[12px] text-[#5F6368]">{student.parentName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active'
                                                ? 'bg-[#E6F4EA] text-[#1E8E3E]'
                                                : 'bg-[#FCE8E6] text-[#D93025]'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <StudentActionMenu student={student} onUpdate={() => loadStudents()} />
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

function StudentActionMenu({ student, onUpdate }: { student: Student; onUpdate: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && !(event.target as Element).closest(`#menu-${student.id}`)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, student.id]);

    const handleToggleStatus = async () => {
        try {
            const newStatus = student.status === "Active" ? "Inactive" : "Active";
            if (confirm(`Are you sure you want to set ${student.fullName} to ${newStatus}?`)) {
                await studentService.updateStudent(student.id!, { status: newStatus });
                onUpdate();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        } finally {
            setIsOpen(false);
        }
    };

    const menuItems = [
        { label: "View Profile", icon: Eye, onClick: () => router.push(`/students/${student.id}`) },
        { label: "Edit Student", icon: Edit, onClick: () => router.push(`/students/edit/${student.id}`) },
        { label: "Add Fee Payment", icon: CreditCard, onClick: () => router.push(`/fees/new?studentId=${student.id}`) },
        { label: "View Fee History", icon: Receipt, onClick: () => router.push(`/fees?search=${student.fullName}`) },
        { label: "Enter Marks", icon: FileText, onClick: () => router.push(`/marks`) },
        { divider: true },
        { label: student.status === "Active" ? "Set Inactive" : "Set Active", icon: student.status === "Active" ? XCircle : CheckCircle, onClick: handleToggleStatus },
        { label: "Archive Student", icon: Trash2, onClick: handleToggleStatus },
    ];

    return (
        <div className="relative" id={`menu-${student.id}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-[#E8F0FE] text-[#1A73E8]' : 'hover:bg-[#F1F3F4] text-[#5F6368]'}`}
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-[#E8EAED] py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-[#E8EAED] mb-1">
                        <p className="text-xs font-medium text-[#5F6368] uppercase tracking-wider">Actions</p>
                    </div>

                    {menuItems.map((item, index) => (
                        item.divider ? (
                            <div key={index} className="my-1 border-t border-[#E8EAED]"></div>
                        ) : (
                            <button
                                key={index}
                                onClick={() => { item.onClick && item.onClick(); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8F9FA] flex items-center gap-3 ${item.label?.includes("Set Active") || item.label?.includes("Set Inactive") ? (student.status === 'Active' ? 'text-[#D93025]' : 'text-[#1E8E3E]') : 'text-[#202124]'}`}
                            >
                                {item.icon && <item.icon size={16} className={item.label?.includes("Set") ? "" : "text-[#5F6368]"} />}
                                {item.label}
                            </button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}
