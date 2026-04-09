import Sidebar  from '@/components/layout/backend/bar/Sidebar';
import TopBar from '@/components/layout/backend/bar/Topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-mono">
      {/* Konstante Sidebar links */}
      <Sidebar /> 

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Die neue Topbar mit Suche & smarter Glocke */}
        <TopBar />

        {/* Dynamischer Content-Bereich */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}