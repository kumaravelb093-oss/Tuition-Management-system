"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { studentService, Student } from "@/services/studentService";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [formData, setFormData] = useState<Omit<Student, "id" | "createdAt">>({
        fullName: "",
        grade: "",
        gender: "Male",
        dob: "",
        address: "",
        phone: "",
        email: "",
        parentName: "",
        joiningDate: "",
        status: "Active",
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                // We need to fetch a single student. studentService doesn't have getStudentById accessible directly as a public method in the interface shown, 
                // but we can look it up or added it. 
                // Since I cannot change service easily without checking, I'll use direct firestore here or add to service if I could.
                // But wait, I can edit service.
                // Actually, I'll allow direct usage here for speed or modify service.
                // existing service has getStudent? No. 
                // I will modify service next, but for now access direct or just adding getStudent to service is cleaner.
                // Let's assume I'll add getStudent to service in a moment.
                // For this file content, I'll assume studentService.getStudent(id) exists.
                // Wait, I should verify. I viewed studentService, it does NOT have getStudent.
                // I will add it.

                // Temporary direct fetch to be safe if I don't update service immediately:
                const docRef = doc(db, "students", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Student;
                    setFormData({
                        fullName: data.fullName,
                        grade: data.grade,
                        gender: data.gender,
                        dob: data.dob,
                        address: data.address,
                        phone: data.phone,
                        email: data.email || "",
                        parentName: data.parentName,
                        joiningDate: data.joiningDate,
                        status: data.status,
                    });
                } else {
                    alert("Student not found");
                    router.push("/students");
                }
            } catch (error) {
                console.error(error);
                alert("Error loading student");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchStudent();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await studentService.updateStudent(id, formData);
            router.push("/students");
        } catch (error) {
            console.error(error);
            alert("Failed to update student");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="p-12 text-center text-[#5F6368]">Loading student data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <Link
                    href="/students"
                    className="p-2 rounded-full hover:bg-[#E8EAED] text-[#5F6368] transition-colors"
                >
                    <ArrowLeft size={22} />
                </Link>
                <div>
                    <h1 className="text-2xl font-normal text-[#202124]">Edit Student</h1>
                    <p className="text-sm text-[#5F6368]">Update student information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card-base bg-white border border-[#E8EAED] rounded-lg shadow-sm p-8">

                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-shadow placeholder-[#9AA0A6]"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-shadow"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">
                            Gender *
                        </label>
                        <select
                            name="gender"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-shadow"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">
                            Class / Grade *
                        </label>
                        <select
                            name="grade"
                            required
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-shadow"
                            value={formData.grade}
                            onChange={handleChange}
                        >
                            <option value="">Select Class</option>
                            <option value="6th Standard">6th Standard</option>
                            <option value="7th Standard">7th Standard</option>
                            <option value="8th Standard">8th Standard</option>
                            <option value="9th Standard">9th Standard</option>
                            <option value="10th Standard">10th Standard</option>
                            <option value="11th Standard">11th Standard</option>
                            <option value="12th Standard">12th Standard</option>
                        </select>
                    </div>
                </div>

                <h3 className="text-[16px] font-medium text-[#202124] mb-6 border-b border-[#E8EAED] pb-2">Parent & Contact Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">
                            Parent / Guardian Name *
                        </label>
                        <input
                            type="text"
                            name="parentName"
                            required
                            placeholder="Father or Mother's Name"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-shadow placeholder-[#9AA0A6]"
                            value={formData.parentName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="10-digit mobile number"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-shadow placeholder-[#9AA0A6]"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[14px] font-medium text-[#202124] mb-2">
                            Address
                        </label>
                        <textarea
                            name="address"
                            rows={3}
                            placeholder="Full residential address"
                            className="w-full px-4 py-2.5 text-[#202124] bg-white border border-[#DADCE0] rounded-md focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-shadow placeholder-[#9AA0A6]"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EAED]">
                    <Link
                        href="/students"
                        className="px-6 py-2.5 rounded-md text-[#4285F4] font-medium hover:bg-[#E8F0FE] transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary min-w-[120px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Update Student</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
