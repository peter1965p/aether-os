/**
 * AETHER OS // ROOT LAYOUT
 * Standort: src/app/layout.tsx
 * Update: Optimierter User-Daten-Abruf aus Supabase
 */
import type { Metadata } from "next";
import db from "@/lib/db";
import { Inter, Bebas_Neue, JetBrains_Mono, Montserrat, Oswald } from "next/font/google";
import "./globals.css";

// KOMPONENTEN
import Navbar from "@/components/navigation/NavBar";
import { ThemeProvider } from "@/context/ThemeContext";
import SessionGuard from "@/modules/auth/SessionTimeout";
import Tracker from "@/components/VisitorTracker";
import Footer from "@/components/layout/frontend/footer/Footer";

// FONTS INITIALISIEREN
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
    title: "AETHER OS // Paeffgen IT Services",
    description: "Next-Gen Operating System für KFZ-Betriebe & Individual-Lösungen.",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    // 1. BRANDING KERNEL: RGB-Werte aus der DB laden
    const { data: settingsData } = await db
        .from("site_settings")
        .select("key, value")
        .in("key", ["accent_rgb", "bg_rgb"]);

    const settings = settingsData || [];
    const colors = {
        accent: settings.find((s: any) => s.key === "accent_rgb")?.value || "37 99 235",
        bg: settings.find((s: any) => s.key === "bg_rgb")?.value || "5 5 5",
    };

    // 2. SESSION & USER-DATEN (Supabase spezifisch)
    // Wir holen die Session direkt über deinen db-Client
    const { data: { session } } = await db.auth.getSession();

    // Bei Supabase steckt der Name oft in user_metadata oder einer Profile-Tabelle
    // Fallback auf Email, falls kein Name gesetzt ist
    const userName = session?.user?.user_metadata?.full_name ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split('@')[0] ||
        "Admin Node_01";

    const userEmail = session?.user?.email || "news24regional@gmail.com";

    return (
        <html lang="de" className="dark">
        <body className={`${inter.variable} ${bebas.variable} ${mono.variable} ${montserrat.variable} ${oswald.variable} min-h-screen font-sans antialiased bg-[#050505] text-white`}>

        <style dangerouslySetInnerHTML={{ __html: `
                    :root {
                        --accent: ${colors.accent};
                        --background: ${colors.bg};
                    }
                `}} />

        <ThemeProvider>
            <Tracker />

            {/* Hier werden die echten Daten an die Navbar übergeben */}
            <Navbar
                session={!!session}
                userName={userName}
                userEmail={userEmail}
            />

            <SessionGuard />

            <main>{children}</main>

            <Footer />
        </ThemeProvider>
        </body>
        </html>
    );
}