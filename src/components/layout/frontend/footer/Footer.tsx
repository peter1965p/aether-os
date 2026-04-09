"use client";

import React, { useState, useRef } from 'react';
import { Heart, Shield, Globe, Cpu, Loader2, CheckCircle2 } from 'lucide-react';
import { subscribeToNewsletter } from "@/modules/news/newsletter.actions"; // Wir erstellen diese Action gleich

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    const result = await subscribeToNewsletter(formData);

    if (result.success) {
      setStatus("success");
      formRef.current?.reset();
      // Nach 5 Sekunden zurück auf Standard
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
      setMessage(result.error || "Systemfehler");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-12 px-6 lg:px-24 text-white relative z-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: System Status & Logo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">
                AETHER <span className="text-blue-500">OS</span>
              </h3>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
                Next-Gen Enterprise Infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 rounded-full border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Kernel Online</span>
            </div>
            <div className="text-white/10">|</div>
            <div className="flex items-center gap-2 text-white/40">
              <Globe size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest font-mono text-blue-400">v4.0.6-stable</span>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/5">
          <div>
            <h4 className="font-black mb-6 text-[10px] uppercase tracking-[0.4em] text-white/20">Resources</h4>
            <ul className="space-y-4 text-xs font-bold uppercase italic tracking-wider text-white/60">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Community Modules</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-[10px] uppercase tracking-[0.4em] text-white/20">Company</h4>
            <ul className="space-y-4 text-xs font-bold uppercase italic tracking-wider text-white/60">
              <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* NEWSLETTER SYSTEM */}
          <div className="md:col-span-2">
            <h4 className="font-black mb-6 text-[10px] uppercase tracking-[0.4em] text-white/20">System Newsletter</h4>
            <form ref={formRef} action={handleSubmit} className="relative">
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 focus-within:border-blue-500/50 transition-all backdrop-blur-sm">
                <input
                  type="email"
                  name="email"
                  required
                  disabled={status === "loading" || status === "success"}
                  placeholder={status === "success" ? "TRANSMISSION COMPLETE" : "E-Mail Address..."}
                  className="bg-transparent flex-1 px-4 py-3 text-sm outline-none font-bold text-white placeholder:text-white/20 disabled:text-green-500"
                />
                <button 
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                    status === "success" 
                    ? "bg-green-500 text-white" 
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                  }`}
                >
                  {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : null}
                  {status === "success" ? <CheckCircle2 size={16} /> : null}
                  {status === "idle" ? "Subscribe" : null}
                  {status === "error" ? "Retry" : null}
                </button>
              </div>
              {status === "error" && (
                <p className="mt-2 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2">
              Made with <Heart size={10} className="text-red-500 fill-red-500 shadow-[0_0_10px_red]" /> in Germany
            </span>
            <span>© 1995 - {currentYear} Paeffgen IT</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Legal Notice</span>
            <Shield size={14} className="text-white/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}