"use client";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            <Sidebar />
            <div className="flex-1 ml-72 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
}
