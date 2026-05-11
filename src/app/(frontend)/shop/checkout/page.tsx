'use client'

import { UserIcon, UserPlusIcon, FingerprintIcon } from "lucide-react";
import Link from "next/link";

export default function CheckoutHubPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">
                    Identity <span className="text-blue-500">Verification</span>
                </h1>
                <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-12">
                    Initialisierung der Transaktions-ID // Secure Node Access
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* WEG 1: GAST (E-Mail only) */}
                    <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
                        <UserIcon className="size-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-bold text-white mb-2 uppercase italic">Guest_Sync</h2>
                        <p className="text-[10px] text-zinc-500 mb-8 leading-relaxed">
                            Express-Abwicklung ohne persistenten Account.
                        </p>
                        <Link href="/shop/checkout/guest" className="block w-full py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase text-center hover:bg-white hover:text-black transition-all">
                            Continue as Guest
                        </Link>
                    </div>

                    {/* WEG 2: LOGIN (Bestehender User) */}
                    <div className="bg-[#050505] border border-blue-500/20 p-8 rounded-2xl hover:border-blue-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.1)] group">
                        <FingerprintIcon className="size-10 text-blue-500 mb-6 group-hover:animate-pulse" />
                        <h2 className="text-xl font-bold text-white mb-2 uppercase italic">Kernel_Login</h2>
                        <p className="text-[10px] text-zinc-500 mb-8 leading-relaxed">
                            Bestehende Identität verifizieren.
                        </p>
                        <Link href="/login?redirect=/shop/checkout" className="block w-full py-3 bg-blue-600 text-[10px] font-black uppercase text-center hover:bg-blue-500 transition-all text-white">
                            Authorize Login
                        </Link>
                    </div>

                    {/* WEG 3: REGISTER (Neuer User - Full Sync) */}
                    <div className="bg-[#050505] border border-white/5 p-8 rounded-2xl hover:border-orange-500/50 transition-all group">
                        <UserPlusIcon className="size-10 text-orange-600 mb-6 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-bold text-white mb-2 uppercase italic">New_Identity</h2>
                        <p className="text-[10px] text-zinc-500 mb-8 leading-relaxed">
                            Erstelle Profil für dauerhaften Asset-Zugriff.
                        </p>
                        <Link href="/shop/checkout/register" className="block w-full py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase text-center hover:bg-orange-600 hover:text-white transition-all text-orange-600">
                            Initialize Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}