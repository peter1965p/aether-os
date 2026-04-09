import { Package, User, MapPin, LogOut } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
      {/* Client Nav */}
      <nav className="border-b border-white/5 bg-[#121212] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-black italic tracking-tighter">
            AETHER <span className="text-orange-600">CLIENT HUB</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <Link
              href="/dashboard"
              className="hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <Package className="w-4 h-4" /> Orders
            </Link>
            <Link
              href="/dashboard/profile"
              className="hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" /> My Identity
            </Link>
            <button className="text-red-500/50 hover:text-red-500 flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Terminate
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6">{children}</main>
    </div>
  );
}
