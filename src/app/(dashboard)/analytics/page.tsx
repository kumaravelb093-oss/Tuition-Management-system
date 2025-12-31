"use client";
import { useEffect, useState } from "react";
import { studentService, Student } from "@/services/studentService";
import { feeService, Payment } from "@/services/feeService";
import { marksService, Exam, MarksEntry } from "@/services/marksService";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [allMarks, setAllMarks] = useState<MarksEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalyticsData();
    }, []);

    const loadAnalyticsData = async () => {
        try {
            const [studentsData, paymentsData, examsData] = await Promise.all([
                studentService.getStudents(),
                feeService.getRecentPayments(100),
                marksService.getExams(),
            ]);
            setStudents(studentsData);
            setPayments(paymentsData);
            setExams(examsData);

            // Load marks for all exams
            if (examsData.length > 0) {
                const marksPromises = examsData.map(exam => marksService.getMarksByExam(exam.id!));
                const marksArrays = await Promise.all(marksPromises);
                setAllMarks(marksArrays.flat());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Data for Charts
    // 1. Students by Grade
    const gradeDistribution = students.reduce((acc, student) => {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const gradeChartData = Object.entries(gradeDistribution).map(([name, value]) => ({
        name,
        students: value,
    }));

    // 2. Monthly Fee Collection (last 6 months)
    const getMonthName = (date: Date) => date.toLocaleString('default', { month: 'short' });
    const monthlyCollection: Record<string, number> = {};

    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        monthlyCollection[`${getMonthName(d)} ${d.getFullYear()}`] = 0;
    }

    payments.forEach(p => {
        const key = `${p.feeMonth.slice(0, 3)} ${p.feeYear}`;
        if (monthlyCollection[key] !== undefined) {
            monthlyCollection[key] += Number(p.amount);
        }
    });

    const feeChartData = Object.entries(monthlyCollection).map(([name, amount]) => ({
        name,
        amount,
    }));

    // 3. Active vs Inactive Students
    const activeCount = students.filter(s => s.status === "Active").length;
    const inactiveCount = students.filter(s => s.status === "Inactive").length;
    const statusData = [
        { name: 'Active', value: activeCount },
        { name: 'Inactive', value: inactiveCount },
    ];

    // 4. Subject-wise average (if marks exist)
    const subjectAverages: Record<string, { total: number; count: number }> = {};
    allMarks.forEach(m => {
        if (!subjectAverages[m.subject]) {
            subjectAverages[m.subject] = { total: 0, count: 0 };
        }
        subjectAverages[m.subject].total += (m.marksObtained / m.maxMarks) * 100;
        subjectAverages[m.subject].count += 1;
    });

    const subjectChartData = Object.entries(subjectAverages).map(([subject, data]) => ({
        name: subject,
        average: Math.round(data.total / data.count),
    })).slice(0, 8);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-slate-500">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Insights</h1>
                <p className="text-muted-foreground mt-1">Performance metrics and trends.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Monthly Fee Collection */}
                <div className="card-base bg-white">
                    <h3 className="font-semibold text-slate-900 mb-4">Monthly Fee Collection</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={feeChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                                <Bar dataKey="amount" fill="#0f172a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Students by Grade */}
                <div className="card-base bg-white">
                    <h3 className="font-semibold text-slate-900 mb-4">Students by Grade</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradeChartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                                <Tooltip />
                                <Bar dataKey="students" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Student Status Pie */}
                <div className="card-base bg-white">
                    <h3 className="font-semibold text-slate-900 mb-4">Student Status</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject-wise Performance */}
                <div className="card-base bg-white">
                    <h3 className="font-semibold text-slate-900 mb-4">Subject-wise Average Performance</h3>
                    {subjectChartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                            No marks data available yet.
                        </div>
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip formatter={(value) => [`${value}%`, 'Average']} />
                                    <Bar dataKey="average" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
