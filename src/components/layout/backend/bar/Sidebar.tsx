"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layout,
  Database,
  Box,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  ShoppingCart,
  Layers,
  UserCheck,
  Users,
  MonitorSmartphone,
  Boxes, // Das Icon für POS
  MessageSquareText,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-black border-r border-white/5 transition-all duration-300 flex flex-col z-50 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/5 min-h-[64px]">
        {!isCollapsed && (
          <span className="font-black text-xs tracking-tighter text-white uppercase italic">
            AETHER <span className="text-blue-500">OS</span>
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors mx-auto text-white/50"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <NavItem
          href="/admin"
          icon={<Home size={18} />}
          label="Dashboard"
          collapsed={isCollapsed}
        />     
        
        <NavItem
          href="/admin/blog"
          icon={<FileText size={18} />}
          label="Blog Edit"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/comments"
          icon={<MessageSquareText size={18} />}
          label="Kommentare"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/db"
          icon={<Database size={18} />}
          label="Database"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/inventory"
          icon={<Box size={18} />}
          label="Inventory"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/suppliers"
          icon={<Boxes size={18} />}
          label="Lieferanten"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/users"
          icon={<UserCheck size={18} />}
          label="Mitarbeiter"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/customers"
          icon={<Users size={18} />}
          label="Kunden"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/shop"
          icon={<ShoppingCart size={18} />}
          label="Shop"
          collapsed={isCollapsed}
        />

        {/* NEU: POS SYSTEM */}
        <NavItem
          href="/admin/pos"
          icon={<MonitorSmartphone size={18} />}
          label="POS Terminal"
          collapsed={isCollapsed}
        />

        <NavItem
          href="/admin/categories"
          icon={<Layers size={18} />}
          label="Kategorien"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/admin/analytics"
          icon={<BarChart3 size={18} />}
          label="Analytics"
          collapsed={isCollapsed}
        />

        <div className="my-4 border-t border-white/5 mx-4" />

        <NavItem
          href="/admin/modules"
          icon={<Settings size={18} />}
          label="Modul Management"
          collapsed={isCollapsed}
        />
      </nav>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  href,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 gap-4 cursor-pointer transition-all duration-200 relative group ${
        isActive
          ? "bg-blue-500/10 text-blue-400 border-r-2 border-blue-500"
          : "text-white/40 hover:text-white hover:bg-white/5"
      }`}
    >
      <div
        className={`transition-transform duration-300 ${
          isActive
            ? "scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            : "group-hover:scale-110"
        }`}
      >
        {icon}
      </div>
      {!collapsed && (
        <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">
          {label}
        </span>
      )}

      {/* Tooltip bei eingeklappter Sidebar */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100]">
          {label}
        </div>
      )}
    </Link>
  );
}
