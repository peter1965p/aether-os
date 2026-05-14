/**
 * AETHER OS // FRONTEND LAYOUT
 * Status: Edge-to-Edge Optimized for V4.3.0
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
    const { data: { user } } = await db.auth.getUser();

    return (
        /* w-full und overflow-x-hidden sind hier entscheidend */
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#020406]">
            <Tracker />

            <header className="fixed top-0 left-0 right-0 z-[100]">
                <Navbar />
            </header>

            {/* WICHTIG: pt-24 bleibt für den Abstand, aber wir stellen sicher, 
                dass keine max-w-7xl oder mx-auto den Content hier schon einsperrt!
            */}
            
            <main className="flex-grow pt-24 relative z-10 w-full">
                {children}
            </main>

            <Footer />

            
        </div>
    );
}