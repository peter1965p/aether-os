"use client";

/**
 * AETHER OS // SYSTEM_SIDEBAR
 * Pfad: src/components/admin/sidebar.tsx
 *
 * High-End Terminal Look basierend auf AETHER OS Designvorgaben.
 * Beinhaltet hybride Rollenlogik für Admins und Clients.
 */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, FileText, MessageSquareText, Box, FolderKanban, Users,
  ShoppingCart, Landmark, UserCheck, Mail, Database,
  ChevronLeft, ChevronRight, Zap, AppWindow, LucideActivity, Wrench, Globe,
  HardDrive,
  Package
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  separator?: boolean;
  isFree?: boolean;
  isPaid?: boolean;
  isInclude?: boolean;
  isAdminOnly?: boolean;
}

interface SidebarProps {
  userSettings?: any;
  isClient?: boolean;
}

export default function Sidebar({ userSettings, isClient = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: isClient ? '/client' : '/admin', icon: Home, isInclude: true },
    { id: 'blog', label: 'Blog Edit', href: '/admin/blog', icon: FileText, isInclude: true, isAdminOnly: true },
    { id: 'categories', label: 'Kategorien', href: '/admin/categories', icon: FolderKanban, isInclude: true, isAdminOnly: true},
    { id: 'comments', label: 'Kommentare', href: '/admin/comments', icon: MessageSquareText, isInclude: true, isAdminOnly: true},
    { id: 'DPS', label: 'DPS Dynamic Pages', href: '/admin/pages', icon: AppWindow, isPaid: true, isAdminOnly: true },
    { id: 'inventory', label: 'Mein Lager', href: '/admin/inventory', icon: Box, separator: true, isPaid: true },
    { id: 'tickets', label: 'Support Tickets', href: '/admin/tickets', icon: LucideActivity, isInclude: true },
    { id: 'accounting', label: 'Accounting', href: '/admin/accounting', icon: Landmark, isPaid: true, isAdminOnly: true, separator: true },
    { id: 'users', label: 'Mitarbeiter', href: '/admin/users', icon: UserCheck, isInclude: true, isAdminOnly: true},
    { id: 'customers', label: 'Mandanten', href: '/admin/customers', icon: Users, isInclude: true, isAdminOnly: true},
    { id: 'suppliers', label: 'Lieferanten', href: '/admin/suppliers', icon: Package, isInclude: true, isAdminOnly: true},
    { id: 'orders', label: 'Bestellungen', href: '/admin/orders', icon: ShoppingCart, isInclude: true, isAdminOnly: true},
    { id: 'mail', label: 'E-Mails', href: '/admin/message', icon: Mail, isInclude: true, isAdminOnly: true },
    { id: 'settings', label: 'Einstellungen', href: '/admin/settings', icon: Wrench, isInclude: true, isAdminOnly: true },
    { id: 'aws', label: 'AWS Bucket', href: '/admin/aws', icon: HardDrive, isInclude: true, isAdminOnly: true },
    { id: 'forms', label: 'Formulare', href: '/admin/forms', icon: Globe, isInclude: true, isAdminOnly: true },
    { id: 'db', label: 'Database', href: '/admin/db', icon: Database, isPaid: true, isAdminOnly: true },
  ];

  const filteredItems = sidebarItems.filter(item => {
    if (isClient && item.isAdminOnly) return false;
    return true;
  });

  return (
      <aside
          className={`h-screen bg-[#020406] border-r border-white/5 transition-all duration-500 flex flex-col z-50 relative overflow-hidden ${
              isCollapsed ? "w-20" : "w-72"
          }`}
      >
        {/* Background Decor (Subtle Glow) */}
        <div className="absolute top-0 left-0 w-full h-64 bg-orange-600/5 blur-[100px] pointer-events-none" />

        {/* Header / Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 min-h-[80px] relative z-10">
          {!isCollapsed && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-xl font-black tracking-tighter uppercase italic">
              <span className="bg-gradient-to-b from-orange-200 via-orange-500 to-orange-800 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(234,88,12,0.3)]">
                AETHER
              </span>
              <span className="text-blue-700 ml-1">OS</span>
            </span>
              </div>
          )}
          <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 text-zinc-500 hover:text-blue-500 ${isCollapsed ? "mx-auto" : ""}`}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 px-3 space-y-1">
          {filteredItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
                <React.Fragment key={`${item.id}-${index}`}>
                  {item.separator && (
                      <div className="my-6 px-4">
                        <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                      </div>
                  )}

                  <Link
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                          isActive
                              ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                              : "text-zinc-500 hover:text-white hover:bg-white/[0.03] border border-transparent"
                      }`}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                        <div className="absolute left-0 top-1/4 h-1/2 w-[3px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                    )}

                    <div className={`transition-all duration-500 ${isActive ? "scale-110 text-blue-500" : "group-hover:scale-110 group-hover:text-white"}`}>
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-1 items-center justify-between animate-in fade-in duration-700">
                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] truncate ${isActive ? "text-blue-400" : ""}`}>
                      {item.label}
                    </span>

                          <div className="flex gap-1.5">
                            {item.isFree && <span className="text-[7px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.1)]">FREE</span>}
                            {item.isPaid && <span className="text-[7px] font-black bg-rose-600/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(225,29,72,0.1)] animate-pulse">PAID</span>}
                            {item.isInclude && <span className="text-[7px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(59,130,246,0.1)]">INCL</span>}
                          </div>
                        </div>
                    )}

                    {/* Hover Glow Effect */}
                    {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/[0.02] to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    )}
                  </Link>
                </React.Fragment>
            );
          })}
        </nav>

        {/* Profil-Sektion (Terminal Access Bar) */}
        <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
          <div className={`flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-3 transition-all ${isCollapsed ? "justify-center" : ""}`}>
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-xs shadow-lg ${
                isClient
                    ? 'bg-blue-600/20 text-blue-500 border border-blue-500/30'
                    : 'bg-orange-600/20 text-orange-500 border border-orange-500/30'
            }`}>
              {isClient ? 'C' : 'A'}
            </div>

            {!isCollapsed && (
                <div className="flex flex-col truncate animate-in fade-in slide-in-from-bottom-2 duration-700">
              <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">
                {isClient ? 'Client Terminal' : 'Master Admin'}
              </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_rgba(59,130,246,1)]" />
                    <span className="text-[7px] text-blue-500/80 font-black uppercase tracking-[0.2em]">
                  Uplink Stable
                </span>
                  </div>
                </div>
            )}
          </div>
        </div>
      </aside>
  );
}