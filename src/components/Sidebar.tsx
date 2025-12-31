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
  LogOut,
  GraduationCap
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
    <div className="h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex flex-col fixed left-0 top-0 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">DIAMOND</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Tuition Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-xs text-slate-400 truncate">admin@diamond.edu</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full hover:bg-red-500/10 rounded-xl transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
