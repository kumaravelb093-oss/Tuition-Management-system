"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BookOpen,
    BarChart3,
    Settings,
    LogOut
} from "lucide-react";
import { auth } from "@/lib/firebase";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Students", href: "/students", icon: Users },
    { name: "Fees & Billing", href: "/fees", icon: CreditCard },
    { name: "Marks & Exams", href: "/marks", icon: BookOpen },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-wider">ACADEMIA</h1>
                <p className="text-xs text-slate-400 mt-1">Enterprise Edition</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-slate-800 text-white border-l-4 border-blue-500"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => auth.signOut()}
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
