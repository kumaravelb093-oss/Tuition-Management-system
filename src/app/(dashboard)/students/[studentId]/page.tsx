"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { studentService, Student } from "@/services/studentService";
import { ArrowLeft, User, Calendar, Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = use(params);
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const docRef = doc(db, "students", studentId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStudent({ id: docSnap.id, ...docSnap.data() } as Student);
                } else {
                    router.push("/students");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId, router]);

    if (loading) {
        return <div className="p-12 text-center text-[#5F6368]">Loading profile...</div>;
    }

    if (!student) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/students" className="p-2 hover:bg-[#E8EAED] rounded-full text-[#5F6368] transition-colors">
                    <ArrowLeft size={22} />
                </Link>
                <div>
                    <h1 className="text-2xl font-normal text-[#202124]">{student.fullName}</h1>
                    <p className="text-sm text-[#5F6368]">Student Profile & Performance</p>
                </div>
                <div className="ml-auto">
                    <Link
                        href={`/students/edit/${studentId}`}
                        className="px-4 py-2 border border-[#DADCE0] rounded-md text-[#202124] text-sm font-medium hover:bg-[#F8F9FA] transition-colors"
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="card-base bg-white border border-[#E8EAED] rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#E8EAED] bg-[#F8F9FA] flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] text-2xl font-medium">
                        {student.fullName.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-[#202124]">{student.fullName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-[#5F6368]">{student.grade}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${student.status === 'Active' ? 'bg-[#E6F4EA] text-[#1E8E3E]' : 'bg-[#FCE8E6] text-[#D93025]'}`}>
                                {student.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-[#5F6368] uppercase tracking-wide">Contact Details</h3>

                        <div className="flex items-start gap-3">
                            <Phone size={18} className="text-[#9AA0A6] mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-[#202124]">{student.phone}</p>
                                <p className="text-xs text-[#5F6368]">Parent: {student.parentName}</p>
                            </div>
                        </div>

                        {student.email && (
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-[#9AA0A6]" />
                                <p className="text-sm text-[#202124]">{student.email}</p>
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-[#9AA0A6] mt-0.5" />
                            <p className="text-sm text-[#202124] whitespace-pre-line">{student.address}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-[#5F6368] uppercase tracking-wide">Academic Info</h3>

                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-[#9AA0A6]" />
                            <div>
                                <p className="text-sm font-medium text-[#202124]">Joined {new Date(student.joiningDate).toLocaleDateString()}</p>
                                <p className="text-xs text-[#5F6368]">Admission Date</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <User size={18} className="text-[#9AA0A6]" />
                            <div>
                                <p className="text-sm font-medium text-[#202124]">{student.gender}</p>
                                <p className="text-xs text-[#5F6368]">Gender</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contextual Actions (Quick Links) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href={`/fees?search=${student.fullName}`} className="p-4 bg-white border border-[#E8EAED] rounded-lg hover:shadow-md transition-shadow text-center">
                    <p className="text-[#4285F4] font-medium text-sm">Fee History</p>
                </Link>
                <Link href={`/fees/new?studentId=${studentId}`} className="p-4 bg-white border border-[#E8EAED] rounded-lg hover:shadow-md transition-shadow text-center">
                    <p className="text-[#4285F4] font-medium text-sm">Record Payment</p>
                </Link>
            </div>
        </div>
    );
}
