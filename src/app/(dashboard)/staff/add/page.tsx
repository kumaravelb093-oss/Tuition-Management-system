"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { staffService } from "@/services/staffService";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddStaffPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        gender: "Male" as "Male" | "Female" | "Other",
        phone: "",
        email: "",
        address: "",
        role: "",
        qualification: "",
        joiningDate: new Date().toISOString().split("T")[0],
        salaryType: "Monthly" as "Monthly" | "Daily" | "Hourly",
        basicSalary: "",
        status: "Active" as "Active" | "Inactive"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await staffService.addStaff({
                ...formData,
                basicSalary: Number(formData.basicSalary)
            });
            router.push("/staff");
        } catch (error) {
            console.error(error);
            alert("Failed to add staff member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/staff" className="p-2 rounded-full hover:bg-[#E8EAED] text-[#5F6368] transition-colors">
                    <ArrowLeft size={22} />
                </Link>
                <div>
                    <h1 className="text-2xl font-normal text-[#202124]">Add New Staff</h1>
                    <p className="text-sm text-[#5F6368]">Register a new team member</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card-base bg-white border border-[#E8EAED] rounded-lg shadow-sm p-8">
                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Full Name *</label>
                        <input type="text" name="fullName" required placeholder="e.g. John Doe"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-[#9AA0A6]"
                            value={formData.fullName} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Gender *</label>
                        <select name="gender" className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                            value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Phone Number *</label>
                        <input type="tel" name="phone" required placeholder="10-digit mobile"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-[#9AA0A6]"
                            value={formData.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Email</label>
                        <input type="email" name="email" placeholder="staff@example.com"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-[#9AA0A6]"
                            value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Address</label>
                        <textarea name="address" rows={2} placeholder="Full residential address"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-[#9AA0A6]"
                            value={formData.address} onChange={handleChange} />
                    </div>
                </div>

                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Professional Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Role / Subject *</label>
                        <input type="text" name="role" required placeholder="e.g. Math Teacher, Admin"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-[#9AA0A6]"
                            value={formData.role} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Qualification</label>
                        <input type="text" name="qualification" placeholder="e.g. M.Sc, B.Ed"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-[#9AA0A6]"
                            value={formData.qualification} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Date of Joining *</label>
                        <input type="date" name="joiningDate" required
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                            value={formData.joiningDate} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Status</label>
                        <select name="status" className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                            value={formData.status} onChange={handleChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Salary Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Salary Type *</label>
                        <select name="salaryType" className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                            value={formData.salaryType} onChange={handleChange}>
                            <option value="Monthly">Monthly</option>
                            <option value="Daily">Daily</option>
                            <option value="Hourly">Hourly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">Basic Salary (₹) *</label>
                        <input type="number" name="basicSalary" required placeholder="e.g. 25000"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-[#9AA0A6]"
                            value={formData.basicSalary} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EAED]">
                    <Link href="/staff" className="px-6 py-2.5 rounded-md text-[#4285F4] font-medium hover:bg-[#E8F0FE] transition-colors">
                        Cancel
                    </Link>
                    <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin" /><span>Saving...</span></>
                        ) : (
                            <><Save size={18} /><span>Save Staff</span></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
