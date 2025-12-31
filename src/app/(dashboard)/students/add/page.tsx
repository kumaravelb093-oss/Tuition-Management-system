"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentService, Student } from "@/services/studentService";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function AddStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Student>>({
        fullName: "",
        grade: "",
        section: "",
        gender: "Male",
        dob: "",
        address: "",
        phone: "",
        parentName: "",
        joiningDate: new Date().toISOString().split("T")[0],
        status: "Active",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await studentService.addStudent(formData as Student);
            router.push("/students");
        } catch (error) {
            console.error(error);
            alert("Failed to add student. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/students" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Student</h1>
                    <p className="text-muted-foreground">Enter student details to create a new record.</p>
                </div>
            </div>

            <div className="card-base bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Personal Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text" required name="fullName"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.fullName} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                                <select
                                    name="gender" required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.gender} onChange={handleChange}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                                <input
                                    type="date" required name="dob"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.dob} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                                <input
                                    type="text" name="bloodGroup" placeholder="Optional"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Academic Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Academic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Class / Grade *</label>
                                <input
                                    type="text" required name="grade" placeholder="e.g. 10th Standard"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.grade} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                                <input
                                    type="text" name="section" placeholder="e.g. A"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.section} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Joining Date *</label>
                                <input
                                    type="date" required name="joiningDate"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.joiningDate} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Contact Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Parent / Guardian Name *</label>
                                <input
                                    type="text" required name="parentName"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.parentName} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                                <input
                                    type="tel" required name="phone"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.phone} onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                                <textarea
                                    required name="address" rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={formData.address} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link href="/students" className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                        >
                            {loading ? "Saving..." : <><Save size={18} /> Save Student Record</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
