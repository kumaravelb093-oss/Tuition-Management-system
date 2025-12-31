"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { marksService, Exam, MarksEntry } from "@/services/marksService";
import { studentService, Student } from "@/services/studentService";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

type MarksGrid = {
    [studentId: string]: {
        [subject: string]: number | "";
    };
};

export default function MarksEntryPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.examId as string;

    const [exam, setExam] = useState<Exam | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [marksGrid, setMarksGrid] = useState<MarksGrid>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (examId) {
            loadData();
        }
    }, [examId]);

    const loadData = async () => {
        try {
            // Load Exam details
            const exams = await marksService.getExams();
            const currentExam = exams.find(e => e.id === examId);
            if (!currentExam) {
                alert("Exam not found");
                router.push("/marks");
                return;
            }
            setExam(currentExam);

            // Load students for this grade
            const allStudents = await studentService.getStudents();
            const gradeStudents = allStudents.filter(s => s.grade === currentExam.grade && s.status === "Active");
            setStudents(gradeStudents);

            // Load existing marks
            const existingMarks = await marksService.getMarksByExam(examId);

            // Initialize grid
            const grid: MarksGrid = {};
            gradeStudents.forEach(student => {
                grid[student.id!] = {};
                currentExam.subjects.forEach(subject => {
                    const existing = existingMarks.find(
                        m => m.studentId === student.id && m.subject === subject
                    );
                    grid[student.id!][subject] = existing ? existing.marksObtained : "";
                });
            });
            setMarksGrid(grid);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarksChange = (studentId: string, subject: string, value: string) => {
        const numValue = value === "" ? "" : Math.min(Number(value), exam?.maxMarks || 100);
        setMarksGrid(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [subject]: numValue
            }
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        if (!exam) return;

        setSaving(true);
        try {
            const entries: Omit<MarksEntry, "id">[] = [];

            students.forEach(student => {
                exam.subjects.forEach(subject => {
                    const marks = marksGrid[student.id!]?.[subject];
                    if (marks !== "" && marks !== undefined) {
                        entries.push({
                            examId: exam.id!,
                            studentId: student.id!,
                            studentName: student.fullName,
                            subject,
                            marksObtained: Number(marks),
                            maxMarks: exam.maxMarks,
                        });
                    }
                });
            });

            await marksService.saveMarks(entries);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Failed to save marks.");
        } finally {
            setSaving(false);
        }
    };

    const calculateStudentTotal = (studentId: string) => {
        if (!exam) return { total: 0, max: 0, percentage: 0 };
        let total = 0;
        let count = 0;
        exam.subjects.forEach(subject => {
            const marks = marksGrid[studentId]?.[subject];
            if (marks !== "" && marks !== undefined) {
                total += Number(marks);
                count++;
            }
        });
        const max = count * exam.maxMarks;
        const percentage = marksService.calculatePercentage(total, max);
        return { total, max, percentage };
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-slate-500">Loading exam data...</p>
            </div>
        );
    }

    if (!exam) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/marks" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{exam.name}</h1>
                        <p className="text-muted-foreground">{exam.grade} • {exam.date} • Max Marks: {exam.maxMarks}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                >
                    {saving ? "Saving..." : saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save All Marks</>}
                </button>
            </div>

            {students.length === 0 ? (
                <div className="card-base bg-white text-center py-12">
                    <p className="text-slate-500">No active students found for grade: <strong>{exam.grade}</strong>.</p>
                    <p className="text-sm text-slate-400 mt-2">Add students with this grade to enter marks.</p>
                </div>
            ) : (
                <div className="card-base p-0 overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-slate-900 text-white sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold border-r border-slate-700 min-w-[200px]">Student Name</th>
                                    {exam.subjects.map(subject => (
                                        <th key={subject} className="px-4 py-3 text-center font-semibold border-r border-slate-700 min-w-[100px]">
                                            {subject}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-center font-semibold min-w-[80px]">Total</th>
                                    <th className="px-4 py-3 text-center font-semibold min-w-[80px]">%</th>
                                    <th className="px-4 py-3 text-center font-semibold min-w-[60px]">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {students.map((student, idx) => {
                                    const { total, max, percentage } = calculateStudentTotal(student.id!);
                                    const grade = marksService.getGrade(percentage);
                                    const status = marksService.getPassStatus(percentage);

                                    return (
                                        <tr key={student.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                            <td className="px-4 py-2 font-medium text-slate-900 border-r border-slate-100">
                                                {student.fullName}
                                            </td>
                                            {exam.subjects.map(subject => (
                                                <td key={subject} className="px-1 py-1 border-r border-slate-100">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={exam.maxMarks}
                                                        placeholder="-"
                                                        className="w-full text-center px-2 py-2 border border-transparent rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all bg-transparent hover:bg-blue-50"
                                                        value={marksGrid[student.id!]?.[subject] ?? ""}
                                                        onChange={(e) => handleMarksChange(student.id!, subject, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                            <td className="px-4 py-2 text-center font-semibold text-slate-900">
                                                {total} / {max}
                                            </td>
                                            <td className="px-4 py-2 text-center font-bold text-blue-600">
                                                {percentage}%
                                            </td>
                                            <td className={`px-4 py-2 text-center font-bold ${status === "Pass" ? "text-green-600" : "text-red-600"}`}>
                                                {grade}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                        <p className="text-sm text-slate-500">
                            {students.length} students • {exam.subjects.length} subjects • Navigate with <kbd className="px-1 py-0.5 bg-white border rounded text-xs">Tab</kbd>
                        </p>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary flex items-center gap-2"
                        >
                            {saving ? "Saving..." : <><Save size={18} /> Save Marks</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
