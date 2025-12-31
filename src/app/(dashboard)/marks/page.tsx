"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { marksService, Exam } from "@/services/marksService";
import { Plus, FileSpreadsheet, Calendar, ChevronRight } from "lucide-react";

export default function MarksPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const data = await marksService.getExams();
            setExams(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marks & Exams</h1>
                    <p className="text-muted-foreground mt-1">Manage exams and enter student marks.</p>
                </div>
                <Link href="/marks/new-exam" className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Create New Exam
                </Link>
            </div>

            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-slate-500 col-span-full text-center py-12">Loading exams...</p>
                ) : exams.length === 0 ? (
                    <div className="col-span-full card-base text-center py-12 bg-white">
                        <FileSpreadsheet size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700">No Exams Created Yet</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-6">Create an exam to start entering marks.</p>
                        <Link href="/marks/new-exam" className="btn-primary inline-flex items-center gap-2">
                            <Plus size={18} />
                            Create Exam
                        </Link>
                    </div>
                ) : (
                    exams.map((exam) => (
                        <Link
                            key={exam.id}
                            href={`/marks/entry/${exam.id}`}
                            className="card-base bg-white hover:border-blue-300 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{exam.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{exam.grade}</p>
                                </div>
                                <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {exam.date}
                                </span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                                    {exam.subjects.length} Subjects
                                </span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                                    Max: {exam.maxMarks}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
