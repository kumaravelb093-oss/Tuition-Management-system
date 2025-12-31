"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            console.error(err);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
                            <GraduationCap size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">DIAMOND</h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Tuition Center</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Empowering Education,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                One Student at a Time
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-md">
                            The complete management platform for modern tuition centers. Track students, manage fees, and analyze performance effortlessly.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-8">
                    <div>
                        <p className="text-3xl font-bold text-white">500+</p>
                        <p className="text-slate-400 text-sm">Students Managed</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">₹10L+</p>
                        <p className="text-slate-400 text-sm">Fees Collected</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">98%</p>
                        <p className="text-slate-400 text-sm">Pass Rate</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
                            <GraduationCap size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-wide">DIAMOND</h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Tuition Center</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                            <p className="text-slate-500 mt-2">Sign in to your admin dashboard</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400"
                                        placeholder="admin@diamond.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3 px-6 rounded-xl font-medium hover:from-slate-800 hover:to-slate-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-500">
                        Secure Enterprise Access • Diamond Tuition Center © 2024
                    </p>
                </div>
            </div>
        </div>
    );
}
