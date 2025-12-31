"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { marksService, Exam } from "@/services/marksService";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import Link from "next/link";

const COMMON_SUBJECTS = [
    "Mathematics", "Science", "English", "Hindi", "Social Studies",
    "Physics", "Chemistry", "Biology", "Computer Science", "History",
    "Geography", "Economics", "Accountancy", "Business Studies"
];

export default function NewExamPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        date: new Date().toISOString().split("T")[0],
        grade: "",
        maxMarks: 100,
    });

    const [subjects, setSubjects] = useState<string[]>([]);
    const [customSubject, setCustomSubject] = useState("");

    const handleAddSubject = (subject: string) => {
        if (subject && !subjects.includes(subject)) {
            setSubjects([...subjects, subject]);
        }
        setCustomSubject("");
    };

    const handleRemoveSubject = (subject: string) => {
        setSubjects(subjects.filter(s => s !== subject));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (subjects.length === 0) {
            alert("Please add at least one subject.");
            return;
        }

        setLoading(true);
        try {
            await marksService.addExam({
                ...formData,
                subjects,
            });
            router.push("/marks");
        } catch (error) {
            console.error(error);
            alert("Failed to create exam.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/marks" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Exam</h1>
                    <p className="text-muted-foreground">Configure exam details and subjects.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card-base bg-white space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name *</label>
                        <input
                            type="text" required
                            placeholder="e.g. Unit Test 1, Quarterly Exam"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Class / Grade *</label>
                        <input
                            type="text" required
                            placeholder="e.g. 10th Standard"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Exam Date *</label>
                        <input
                            type="date" required
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Marks (per subject) *</label>
                        <input
                            type="number" required min={1}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                            value={formData.maxMarks}
                            onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Subjects */}
                <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Subjects *</label>

                    {/* Selected Subjects */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {subjects.length === 0 && (
                            <p className="text-sm text-slate-400">No subjects added yet.</p>
                        )}
                        {subjects.map(subject => (
                            <span
                                key={subject}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                            >
                                {subject}
                                <button type="button" onClick={() => handleRemoveSubject(subject)} className="hover:text-red-500">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Quick Add */}
                    <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2">Quick Add:</p>
                        <div className="flex flex-wrap gap-2">
                            {COMMON_SUBJECTS.filter(s => !subjects.includes(s)).slice(0, 8).map(subject => (
                                <button
                                    key={subject}
                                    type="button"
                                    onClick={() => handleAddSubject(subject)}
                                    className="px-3 py-1 border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                >
                                    + {subject}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Subject */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add custom subject..."
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSubject(customSubject);
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => handleAddSubject(customSubject)}
                            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Link href="/marks" className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        {loading ? "Creating..." : <><Save size={18} /> Create Exam</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
