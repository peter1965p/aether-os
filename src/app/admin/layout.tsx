import { db } from '@/lib/db'; // Dein Datenbank-Import
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/layout/backend/bar/Topbar";
import SessionTimeout from "@/modules/auth/SessionTimeout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Daten direkt vom Server holen (Sicher & Schnell)
  const { data: user } = await db
    .from('users')
    .select('settings')
    .eq('email', 'news24regional@gmail.com')
    .single();

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Dein Inaktivitäts-Schutz */}
      <SessionTimeout />

      {/* 2. HIER die Settings an die Sidebar übergeben! */}
      <Sidebar userSettings={user?.settings} />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}