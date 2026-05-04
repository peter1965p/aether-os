import { db } from '@/lib/db'; 
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
    // Hintergrund auf der untersten Ebene fixieren
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden">
      
      {/* Dein Inaktivitäts-Schutz */}
      <SessionTimeout />

      {/* 2. Sidebar mit User-Settings */}
      <Sidebar userSettings={user?.settings} />

      {/* 3. Der Content-Wrapper: WICHTIG - Hintergrund hier nochmal erzwingen */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
        
        {/* Topbar: Jetzt sicher eingebettet */}
        <Topbar />
        
        {/* Main Content Area */}
        <main className="p-8 flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {children}
        </main>

        {/* Optional: Ein subtiler Glow-Effekt im Hintergrund des gesamten Dashboards */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-20" />
      </div>
    </div>
  );
}