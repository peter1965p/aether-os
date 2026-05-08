/**
 * AETHER OS // FRONTEND LAYOUT
 * Pfad: src/app/(frontend)/layout.tsx
 * Status: Korrigiert für Unified Nav-Kernel V4.2.2
 */
import db from "@/lib/db";
import Navbar from "@/components/navigation/frontend/NavBar";
import Footer from "@/components/layout/frontend/footer/Footer";
import Tracker from "@/components/VisitorTracker";

export default async function FrontendLayout({
                                                 children,
                                             }: {
    children: React.ReactNode;
}) {
    // 1. Session & User abrufen (Sicherheits-Check via getUser)
    const { data: { user } } = await db.auth.getUser();

    // 2. Daten für den Nav-Kernel aufbereiten
    const sessionActive = !!user;

    // Namens-Logik: Priorität auf Metadaten, Fallback auf E-Mail-Präfix
    const userName = user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        "Guest";

    const userEmail = user?.email || "";

    return (
        <div className="flex flex-col min-h-screen">
            {/* Tracking Layer */}
            <Tracker />

            {/* 
                NAVBAR WRAPPER 
                Wir übergeben nun alle Props, die das Interface NavbarProps verlangt.
            */}
            <header className="fixed top-0 left-0 right-0 z-[100]">
                <Navbar />
            </header>

            {/* 
                MAIN CONTENT 
                pt-[96px] (h-24 der Navbar) sorgt dafür, dass der Content unter der Navbar startet
            */}
            <main className="flex-grow pt-24 relative z-10">
                {children}
            </main>

            <Footer />
        </div>
    );
}