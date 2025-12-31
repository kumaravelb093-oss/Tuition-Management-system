"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { studentService, Student } from "@/services/studentService";
import { feeService } from "@/services/feeService";
import { ArrowLeft, Check, Search } from "lucide-react";
import Link from "next/link";

export default function NewPaymentPage() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Selection States
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Payment Form States
    const [feeMonth, setFeeMonth] = useState("");
    const [feeYear, setFeeYear] = useState(new Date().getFullYear());
    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);

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

    const filteredStudents = students.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm)
    );

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setSearchTerm(""); // Clear search to show selection clearly
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !amount || !feeMonth) {
            alert("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            await feeService.addPayment({
                studentId: selectedStudent.id!, // Assuming id exists if fetched
                studentName: selectedStudent.fullName,
                grade: selectedStudent.grade,
                amount: Number(amount),
                feeMonth,
                feeYear: Number(feeYear),
                paymentDate,
                remarks
            });
            // In a real app, we would show a success modal and option to print Receipt here
            router.push("/fees");
        } catch (error) {
            console.error(error);
            alert("Failed to record payment.");
        } finally {
            setSubmitting(false);
        }
    };

    const getMonthName = (index: number) => {
        return new Date(0, index).toLocaleString('default', { month: 'long' });
    };

    const currentMonthIndex = new Date().getMonth();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/fees" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Payment Entry</h1>
                    <p className="text-muted-foreground">Record tuition fee payment.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Student Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="card-base bg-white h-full flex flex-col">
                        <h3 className="font-semibold text-slate-900 mb-4">1. Select Student</h3>

                        {!selectedStudent ? (
                            <>
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search student..."
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto max-h-[400px] space-y-2">
                                    {loading ? <p className="text-sm text-slate-500">Loading...</p> :
                                        filteredStudents.map(student => (
                                            <button
                                                key={student.id}
                                                onClick={() => handleSelectStudent(student)}
                                                className="w-full text-left p-3 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-all group"
                                            >
                                                <p className="font-medium text-slate-900 text-sm group-hover:text-blue-600">{student.fullName}</p>
                                                <p className="text-xs text-slate-500">{student.grade}</p>
                                            </button>
                                        ))
                                    }
                                </div>
                            </>
                        ) : (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Selected Student</p>
                                <p className="text-lg font-bold text-slate-900">{selectedStudent.fullName}</p>
                                <p className="text-sm text-slate-600">{selectedStudent.grade}</p>
                                <p className="text-sm text-slate-600 mb-4">{selectedStudent.phone}</p>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                    Change Student
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Collection Details */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="card-base bg-white h-full flex flex-col">
                        <h3 className="font-semibold text-slate-900 mb-6">2. Payment Details</h3>

                        <div className="space-y-6 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fee Month *</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        value={feeMonth} onChange={(e) => setFeeMonth(e.target.value)}
                                    >
                                        <option value="">Select Month</option>
                                        <option value="Admission">Admission Fee</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i} value={getMonthName(i)}>{getMonthName(i)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fee Year *</label>
                                    <input
                                        type="number" required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        value={feeYear} onChange={(e) => setFeeYear(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount Paid (₹) *</label>
                                <input
                                    type="number" required placeholder="0.00"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={amount} onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date *</label>
                                <input
                                    type="date" required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                                <textarea
                                    rows={2} placeholder="Optional notes..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={remarks} onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Link href="/fees" className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting || !selectedStudent}
                                className="px-6 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Processing..." : <><Check size={18} /> Record Payment</>}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
