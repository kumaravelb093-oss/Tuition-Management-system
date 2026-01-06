"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { staffService, Staff } from "@/services/staffService";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [formData, setFormData] = useState<Omit<Staff, "id" | "staffCode" | "createdAt">>({
        fullName: "",
        gender: "Male",
        phone: "",
        email: "",
        address: "",
        role: "",
        qualification: "",
        joiningDate: "",
        salaryType: "Monthly",
        basicSalary: 0,
        status: "Active"
    });

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await staffService.getStaffById(id);
                if (data) {
                    setFormData({
                        fullName: data.fullName,
                        gender: data.gender,
                        phone: data.phone,
                        email: data.email || "",
                        address: data.address,
                        role: data.role,
                        qualification: data.qualification || "",
                        joiningDate: data.joiningDate,
                        salaryType: data.salaryType,
                        basicSalary: data.basicSalary,
                        status: data.status
                    });
                } else {
                    alert("Staff member not found.");
                    router.push("/staff");
                }
            } catch (error) {
                console.error(error);
                alert("Error loading staff data.");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchStaff();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "basicSalary" ? Number(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await staffService.updateStaff(id, formData);
            router.push("/staff");
        } catch (error) {
            console.error(error);
            alert("Failed to update staff member.");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="p-12 text-center text-[#5F6368]">Loading staff data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/staff" className="p-2 rounded-full hover:bg-[#E8EAED] text-[#5F6368] transition-colors">
                    <ArrowLeft size={22} />
                </Link>
                <div>
                    <h1 className="text-2xl font-normal text-[#202124]">Edit Staff</h1>
                    <p className="text-sm text-[#5F6368]">Update staff member information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card-base bg-white border border-[#E8EAED] rounded-lg shadow-sm p-8">
                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Full Name *</label>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Gender *</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Phone Number *</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Address</label>
                        <textarea name="address" rows={2} value={formData.address} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                </div>

                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Role / Subject *</label>
                        <input type="text" name="role" required value={formData.role} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Qualification</label>
                        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Date of Joining *</label>
                        <input type="date" name="joiningDate" required value={formData.joiningDate} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Salary Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Salary Type *</label>
                        <select name="salaryType" value={formData.salaryType} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]">
                            <option value="Monthly">Monthly</option>
                            <option value="Daily">Daily</option>
                            <option value="Hourly">Hourly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Basic Salary (₹) *</label>
                        <input type="number" name="basicSalary" required value={formData.basicSalary} onChange={handleChange}
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]" />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EAED]">
                    <Link href="/staff" className="px-6 py-2.5 rounded-md text-[#4285F4] font-medium hover:bg-[#E8F0FE] transition-colors">
                        Cancel
                    </Link>
                    <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin" /><span>Updating...</span></>
                        ) : (
                            <><Save size={18} /><span>Update Staff</span></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
