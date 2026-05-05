/**
 * AETHER OS // FRONTEND LAYOUT
 * Pfad: src/app/(frontend)/layout.tsx
 */
import db from "@/lib/db";
import Navbar from "@/components/navigation/NavBar"; 
import Footer from "@/components/layout/frontend/footer/Footer";
import Tracker from "@/components/VisitorTracker";

export default async function FrontendLayout({
                                                 children,
                                             }: {
    children: React.ReactNode;
}) {
    // 1. Session abrufen
    const { data: { session } } = await db.auth.getSession();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Tracking Layer */}
            <Tracker />

            {/* 
                NAVBAR WRAPPER 
                Wir erzwingen die Sichtbarkeit durch festen Header und hohen Z-Index 
            */}
            <header className="fixed top-0 left-0 right-0 z-[100]">
                <Navbar session={!!session} />
            </header>

            {/* 
                MAIN CONTENT 
                pt-[80px] sorgt dafür, dass der Content unter der Navbar startet
            */}
            <main className="flex-grow pt-[80px] relative z-10">
                {children}
            </main>

            <Footer />
        </div>
    );
}