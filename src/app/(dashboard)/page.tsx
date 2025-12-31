"use client";
import { useEffect, useState } from "react";
import { Users, CreditCard, BookOpen, BarChart3, TrendingUp, Plus, ArrowUpRight, Sparkles } from "lucide-react";
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
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-amber-500" />
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to Diamond</h1>
          <p className="text-slate-500 mt-1">Here's what's happening at your tuition center today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/students/add" className="btn-primary">
            <Plus size={18} />
            Add Student
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Users size={24} className="text-white" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight size={12} />
              Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Total Students</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalStudents}</h3>
            <p className="text-xs text-emerald-600 mt-1">{activeStudents} currently active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <CreditCard size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Total Collection</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">₹{totalCollected.toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-1">{payments.length} transactions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">{currentMonth} Collection</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">₹{currentMonthCollection.toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-1">{currentMonthPayments.length} payments this month</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <BookOpen size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Exams Conducted</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalExams}</h3>
            <p className="text-xs text-slate-500 mt-1">Across all grades</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Payments Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-900">Recent Payments</h3>
              <p className="text-sm text-slate-500 mt-0.5">Latest fee transactions</p>
            </div>
            <Link href="/fees" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                    <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
                    No payments recorded yet
                  </td>
                </tr>
              ) : (
                recentPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{p.studentName}</p>
                      <p className="text-xs text-slate-500">{p.grade}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.feeMonth} {p.feeYear}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-emerald-600">₹{p.amount}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Quick Actions</h3>
          <p className="text-sm text-slate-500 mb-6">Common tasks at your fingertips</p>

          <div className="space-y-3">
            <Link href="/students/add" className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-100 transition-colors group border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Add New Student</p>
                <p className="text-xs text-slate-500">Register a new admission</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </Link>

            <Link href="/fees/new" className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl hover:from-emerald-100 hover:to-emerald-100 transition-colors group border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <CreditCard size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Record Fee Payment</p>
                <p className="text-xs text-slate-500">Collect monthly fees</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </Link>

            <Link href="/marks/new-exam" className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl hover:from-purple-100 hover:to-purple-100 transition-colors group border border-purple-100">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Create New Exam</p>
                <p className="text-xs text-slate-500">Setup exam and subjects</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
            </Link>

            <Link href="/analytics" className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl hover:from-amber-100 hover:to-amber-100 transition-colors group border border-amber-100">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">View Analytics</p>
                <p className="text-xs text-slate-500">Performance insights</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
