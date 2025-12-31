"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { feeService, Payment } from "@/services/feeService";
import { pdfService } from "@/services/pdfService";
import { Plus, Download, Printer } from "lucide-react";

export default function FeesPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const data = await feeService.getRecentPayments();
            setPayments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fees & Billing</h1>
                    <p className="text-muted-foreground mt-1">Track payments and generate receipts.</p>
                </div>
                <Link href="/fees/new" className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Record New Payment
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-base bg-slate-900 text-white border-slate-900">
                    <p className="text-slate-400 text-sm font-medium">Total Collection (Recent)</p>
                    <h3 className="text-3xl font-bold mt-2">₹{totalCollected.toLocaleString()}</h3>
                </div>
                <div className="card-base">
                    <p className="text-muted-foreground text-sm font-medium">Transactions</p>
                    <h3 className="text-3xl font-bold mt-2 text-slate-900">{payments.length}</h3>
                </div>
            </div>

            <div className="card-base p-0 overflow-hidden bg-white">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Receipt No</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Fee Month</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading fees data...</td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No payments recorded yet.</td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-600">{payment.receiptNumber}</td>
                                        <td className="px-6 py-4 text-slate-900">{payment.paymentDate}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {payment.studentName}
                                            <span className="block text-xs text-slate-500">{payment.grade}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{payment.feeMonth} {payment.feeYear}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-slate-900">₹{payment.amount}</td>
                                        <td className="px-6 py-4 text-center flex justify-center gap-2">
                                            <button
                                                onClick={() => pdfService.generateReceipt(payment)}
                                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                title="Download Receipt"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
