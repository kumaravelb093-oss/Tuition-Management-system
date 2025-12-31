"use client";
import { useEffect, useState } from "react";
import { Users, CreditCard, BookOpen, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { studentService, Student } from "@/services/studentService";
import { feeService, Payment } from "@/services/feeService";
import { marksService, Exam } from "@/services/marksService";
import Link from "next/link";

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [studentsData, paymentsData, examsData] = await Promise.all([
        studentService.getStudents(),
        feeService.getRecentPayments(50),
        marksService.getExams(),
      ]);
      setStudents(studentsData);
      setPayments(paymentsData);
      setExams(examsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // KPIs
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "Active").length;
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalExams = exams.length;

  // Current month fees
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const currentMonthPayments = payments.filter(
    p => p.feeMonth === currentMonth && p.feeYear === currentYear
  );
  const currentMonthCollection = currentMonthPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const recentPayments = payments.slice(0, 5);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here is your institution overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-base bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalStudents}</h3>
              <p className="text-xs text-green-600">{activeStudents} Active</p>
            </div>
          </div>
        </div>

        <div className="card-base bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Collection</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{totalCollected.toLocaleString()}</h3>
              <p className="text-xs text-slate-500">{payments.length} transactions</p>
            </div>
          </div>
        </div>

        <div className="card-base bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{currentMonth} Collection</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{currentMonthCollection.toLocaleString()}</h3>
              <p className="text-xs text-slate-500">{currentMonthPayments.length} payments</p>
            </div>
          </div>
        </div>

        <div className="card-base bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Exams Conducted</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalExams}</h3>
              <p className="text-xs text-slate-500">All grades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Payments Table */}
        <div className="lg:col-span-2 card-base p-0 overflow-hidden bg-white">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Payments</h3>
            <Link href="/fees" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Month</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400">No recent payments</td>
                </tr>
              ) : (
                recentPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{p.feeMonth} {p.feeYear}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">₹{p.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="card-base bg-white">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/students/add" className="w-full btn-primary justify-center flex items-center gap-2">
              <Users size={18} />
              Add New Student
            </Link>
            <Link href="/fees/new" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-md font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <CreditCard size={18} />
              Record Fee Payment
            </Link>
            <Link href="/marks/new-exam" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-md font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <BookOpen size={18} />
              Create New Exam
            </Link>
            <Link href="/analytics" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-md font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <BarChart3 size={18} />
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
