"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  MessageSquareText,
  Box,
  FolderKanban,
  Users,
  Truck,
  Landmark,
  BarChart3,
  UserCheck,
  ShoppingCart,
  MonitorSmartphone,
  Layers,
  Settings,
  Mail,
  ClipboardList,
  Database,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Zap,
  AppWindow 
} from "lucide-react";

export default function Sidebar({ userSettings }: { userSettings?: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: Home },
    { id: 'blog', label: 'Blog Edit', href: '/admin/blog', icon: FileText },
    { id: 'DPS', label: 'DPS Seitenverwaltung', href: '/admin/pages', icon: AppWindow },
    { id: 'comments', label: 'Kommentare', href: '/admin/comments', icon: MessageSquareText },
    { id: 'categories', label: 'Kategorien', href: '/admin/categories', icon: Layers },
    
    { id: 'inventory', label: 'Inventory', href: '/admin/inventory', icon: Box, separator: true },
    { id: 'projects', label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { id: 'staff', label: 'Mitarbeiter', href: '/admin/users', icon: UserCheck },
    { id: 'customers', label: 'Kunden', href: '/admin/customers', icon: Users },
    { id: 'suppliers', label: 'Lieferanten', href: '/admin/suppliers', icon: Truck },
    
    { id: 'shop', label: 'Shop System', href: '/admin/shop', icon: ShoppingCart, separator: true },
    { id: 'pos', label: 'POS System', href: '/admin/pos', icon: MonitorSmartphone },
    { id: 'accounting', label: 'Accounting', href: '/admin/accounting', icon: Landmark },
    
    { id: 'seo', label: 'SEO & GEO Intel', href: '/admin/seo', icon: MapPin, isFree: true, separator: true },
    { id: 'analytics', label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },

    // --- SYSTEM CONTROL (Hier lag der Fehler) ---
    { id: 'message', label: 'Message Center', href: '/admin/message', icon: Mail, separator: true },
    { id: 'news', label: 'News Center', href: '/admin/news', icon: Zap }, // News Center ist hier!
    { id: 'forms', label: 'Formular Center', href: '/admin/forms', icon: ClipboardList, isFree: true },
    { id: 'modules', label: 'Module Ecosystem', href: '/admin/modules', icon: Settings },
    { id: 'db', label: 'Database', href: '/admin/db', icon: Database },
  ];

  return (
    <aside className={`h-screen bg-black border-r border-white/5 transition-all duration-300 flex flex-col z-50 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="p-4 flex items-center justify-between border-b border-white/10 min-h-[64px]">
        {!isCollapsed && (
          <span className="text-xl tracking-tighter text-orange-600 uppercase">
            AETHER <span className="text-blue-600">OS</span>
          </span>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 hover:bg-blue-600 rounded-md transition-colors mx-auto text-white/50 text-white">
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href;
          const isSeoRelated = item.id === 'seo' || item.isFree;

          return (
            <React.Fragment key={`${item.id}-${index}`}>
              {/* Separator Logik korrigiert */}
              {item.separator && (
                <div className={`my-4 border-t mx-4 opacity-20 ${item.id === 'seo' ? 'border-[#b33927]' : 'border-blue-500'}`} />
              )}
              
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 gap-4 cursor-pointer transition-all duration-200 relative group ${
                  isActive 
                    ? (item.id === 'seo' ? "bg-[#b33927]/10 text-[#b33927] border-r-2 border-[#b33927]" : "bg-blue-500/10 text-blue-400 border-r-2 border-orange-600") 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`transition-transform duration-300 ${
                  isActive 
                    ? (item.id === 'seo' ? "scale-110 drop-shadow-[0_0_8px_rgba(179,57,39,0.5)]" : "scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]") 
                    : "group-hover:scale-110"
                }`}>
                  <item.icon size={18} className={item.id === 'seo' && !isActive ? "text-[#b33927]/60" : ""} />
                </div>
                
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">
                      {item.label}
                    </span>
                    {item.isFree && (
                      <span className="text-[7px] font-bold bg-green-600 text-white px-1.5 py-0.5 rounded-sm animate-pulse shadow-[0_0_10px_rgba(179,57,39,0.4)]">
                        FREE
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-white/5 bg-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-black font-black italic text-[10px]">N</div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-white tracking-widest leading-none">Master Admin</span>
            <span className="text-[7px] text-blue-500 font-bold uppercase tracking-widest mt-1">Uplink Stable</span>
          </div>
        </div>
      )}
    </aside>
  );
}