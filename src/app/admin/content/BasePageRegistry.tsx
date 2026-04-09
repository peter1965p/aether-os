"use client";

import { Check, ShieldCheck, Globe, Lock } from "lucide-react";

export default function BasePageRegistry({ pages, onToggleNav }: any) {
  const systemPages = pages.filter((p: any) => p.is_base_page === 1);

  return (
    <div className="bg-[#070707] border border-[#00FF00]/20 rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
      <div className="bg-[#00FF00]/10 p-5 border-b border-[#00FF00]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-[#00FF00]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00FF00]">
            System Core Registry // Basis-Module
          </span>
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="p-4 text-[9px] font-black uppercase text-white/30">
              Module Type
            </th>
            <th className="p-4 text-[9px] font-black uppercase text-white/30">
              System Path
            </th>
            <th className="p-4 text-[9px] font-black uppercase text-white/30 text-center text-orange-500">
              Aktiv in Navbar?
            </th>
          </tr>
        </thead>
        <tbody>
          {systemPages.map((page: any) => (
            <tr
              key={page.id}
              className="border-b border-white/5 hover:bg-[#00FF00]/5 transition-colors group"
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Lock size={10} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                    Core Modul
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-col text-white">
                  <span className="font-black uppercase italic text-sm">
                    {page.title}
                  </span>
                  <span className="text-[10px] font-mono opacity-20">
                    /{page.slug}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => onToggleNav(page.id, page.show_in_nav)}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${
                        page.show_in_nav
                          ? "bg-[#00FF00] text-black shadow-[0_0_20px_rgba(0,255,0,0.3)] rotate-[360deg]"
                          : "bg-black border border-white/10 text-white/10 hover:border-[#00FF00]"
                      }
                    `}
                  >
                    {page.show_in_nav ? (
                      <Check size={20} strokeWidth={3} />
                    ) : (
                      <Globe size={16} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
