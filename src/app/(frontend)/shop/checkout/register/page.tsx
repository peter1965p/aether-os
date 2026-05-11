'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, MapPin, User, ArrowRight } from "lucide-react"

export default function RegisterCheckoutPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12 border-l-2 border-orange-600 pl-6">
                    <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
                        Initialize <span className="text-orange-600">Identity</span>
                    </h1>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
                        Erstellung eines neuen Client-Profils im AETHER_NETWORK
                    </p>
                </div>

                <form className="space-y-12">
                    {/* SECTION 1: CREDENTIALS */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-500 mb-4">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Security_Login</span>
                            </div>
                            <input
                                type="email"
                                placeholder="EMAIL_ADDRESS"
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-xs font-mono focus:border-blue-500 outline-none transition-all"
                            />
                            <input
                                type="password"
                                placeholder="SECURITY_PASSWORD"
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-xs font-mono focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* SECTION 2: PERSONAL */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-orange-600 mb-4">
                                <User size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Identity_Base</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="FIRST_NAME" className="bg-white/5 border border-white/10 p-4 text-white text-xs font-mono focus:border-orange-600 outline-none" />
                                <input type="text" placeholder="LAST_NAME" className="bg-white/5 border border-white/10 p-4 text-white text-xs font-mono focus:border-orange-600 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ADDRESS */}
                    <div className="pt-8 border-t border-white/5">
                        <div className="flex items-center gap-2 text-emerald-500 mb-6">
                            <MapPin size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Location_Protocol (Billing)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="STREET / HOUSE_NO" className="md:col-span-2 bg-white/5 border border-white/10 p-4 text-white text-xs font-mono focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="POST_CODE" className="bg-white/5 border border-white/10 p-4 text-white text-xs font-mono focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="CITY" className="md:col-span-3 bg-white/5 border border-white/10 p-4 text-white text-xs font-mono focus:border-emerald-500 outline-none" />
                        </div>
                    </div>

                    {/* ACTION */}
                    <button
                        type="submit"
                        className="group relative w-full bg-orange-600 p-6 overflow-hidden transition-all hover:bg-white"
                    >
                        <div className="relative z-10 flex items-center justify-between font-black uppercase italic tracking-tighter text-black">
                            <span>Initialize Membership & Proceed to Payment</span>
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </button>
                </form>

                <p className="mt-8 text-center text-[9px] text-white/20 font-mono uppercase tracking-widest">
                    By initializing, you accept the AETHER_PROTOCOLS and Terms of Service.
                </p>
            </div>
        </div>
    )
}