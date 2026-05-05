"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, FileText, MessageSquareText, Box, FolderKanban, Users,
  Truck, Landmark, BarChart3, UserCheck, ShoppingCart,
  MonitorSmartphone, Layers, Settings, Mail, ClipboardList,
  Database, ChevronLeft, ChevronRight, MapPin, Zap, AppWindow, LayoutGrid, LucideActivity
} from "lucide-react";

// 1. ERWEITERTES INTERFACE
interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  separator?: boolean;
  isFree?: boolean;
  isPaid?: boolean;
  isInclude?: boolean;
  isAdminOnly?: boolean; // NEU: Nur für Admins sichtbar
}

// 2. KORREKTES PROPS-INTERFACE FÜR DIE KOMPONENTE
interface SidebarProps {
  userSettings?: any;
  isClient?: boolean; // Hier lag der Fehler - jetzt ist es definiert!
}

export default function Sidebar({ userSettings, isClient = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // 3. MODUL-KONFIGURATION
  const sidebarItems: SidebarItem[] = [
    // Client & Admin Basis
    { id: 'dashboard', label: 'Dashboard', href: isClient ? '/client' : '/admin', icon: Home, isInclude: true },

    // Admin-Only Sektion
    { id: 'blog', label: 'Blog Edit', href: '/admin/blog', icon: FileText, isInclude: true, isAdminOnly: true },
    { id: 'categories', label: 'Kategorien', href: '/admin/categories', icon: FolderKanban, isInclude: true, isAdminOnly: true},
    { id: 'comments', label: 'Kommentare', href: '/admin/comments', icon: MessageSquareText, isInclude: true, isAdminOnly: true},
    { id: 'DPS', label: 'DPS Dynamic Pages', href: '/admin/pages', icon: AppWindow, isPaid: true, isAdminOnly: true },
    

    // Kunden-relevante Punkte (Beispiel)
    { id: 'inventory', label: 'Mein Lager', href: '/admin/inventory', icon: Box, separator: true, isPaid: true },
    { id: 'tickets', label: 'Support Tickets', href: '/admin/tickets', icon: LucideActivity, isInclude: true },

    // Wieder Admin-Only
    { id: 'accounting', label: 'Accounting', href: '/admin/accounting', icon: Landmark, isPaid: true, isAdminOnly: true, separator: true },
    { id: 'users', label: 'Mitarbeiter', href: '/admin/users', icon: UserCheck, isInclude: true, isAdminOnly: true},
    { id: 'customers', label: 'Mandanten', href: '/admin/customers', icon: Users, isInclude: true, isAdminOnly: true},
    { id: 'orders', label: 'Bestellungen', href: '/admin/orders', icon: ShoppingCart, isInclude: true, isAdminOnly: true},
    { id: 'mail', label: 'E-Mails', href: '/admin/mail', icon: Mail, isInclude: true, isAdminOnly: true },
    { id: 'db', label: 'Database', href: '/admin/db', icon: Database, isPaid: true, isAdminOnly: true },
  ];

  // 4. FILTER-LOGIK: Verstecke Admin-Module vor Clients
  const filteredItems = sidebarItems.filter(item => {
    if (isClient && item.isAdminOnly) return false;
    return true;
  });

  return (
      <aside className={`h-screen bg-black border-r border-white/5 transition-all duration-300 flex flex-col z-50 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10 min-h-[64px]">
          {!isCollapsed && (
              <span className="text-xl tracking-tighter uppercase text-orange-600 center">
            AETHER <span className="text-blue-900">OS</span>
          </span>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 hover:bg-[rgba(var(--accent-rgb),0.2)] rounded-md transition-colors mx-auto text-white/50">
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
                <React.Fragment key={`${item.id}-${index}`}>
                  {item.separator && (
                      <div className="my-4 border-t border-white/5 mx-4 opacity-20" />
                  )}

                  <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 gap-4 cursor-pointer transition-all duration-200 relative group ${
                          isActive
                              ? "bg-[rgba(var(--accent-rgb),0.1)] text-[rgba(var(--accent-rgb),1)] border-r-2 border-[rgba(var(--accent-rgb),1)]"
                              : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <div className={`transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" : "group-hover:scale-110"}`}>
                      <item.icon size={18} />
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-1 items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">
                      {item.label}
                    </span>

                          <div className="flex gap-1">
                            {item.isFree && <span className="text-[7px] font-bold bg-green-600 text-white px-1.5 py-0.5 rounded-sm animate-pulse">FREE</span>}
                            {item.isPaid && <span className="text-[7px] font-bold bg-red-800 text-white px-1.5 py-0.5 rounded-sm animate-pulse">PAID</span>}
                            {item.isInclude && <span className="text-[7px] font-bold bg-yellow-400 text-slate-600 px-1.5 py-0.5 rounded-sm animate-pulse">INCL</span>}
                          </div>
                        </div>
                    )}
                  </Link>
                </React.Fragment>
            );
          })}
        </nav>

        {/* Profil-Sektion unten */}
        {!isCollapsed && (
            <div className="p-4 border-t border-white/5 bg-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgba(var(--accent-rgb),1)] flex items-center justify-center text-black font-black italic text-[10px]">
                {isClient ? 'C' : 'A'}
              </div>
              <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-white tracking-widest leading-none">
              {isClient ? 'Client Terminal' : 'Master Admin'}
            </span>
                <span className="text-[7px] text-[rgba(var(--accent-rgb),1)] font-bold uppercase tracking-widest mt-1">
              Uplink Stable
            </span>
              </div>
            </div>
        )}
      </aside>
  );
}