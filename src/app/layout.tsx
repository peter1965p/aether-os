/**
 * AETHER OS // ROOT LAYOUT
 * Standort: src/app/layout.tsx
 * Zweck: Zentrales Layout, Branding-Initialisierung und Session-Management.
 */

import type { Metadata } from "next";
import db from "@/lib/db"; // Standard-Import deines Supabase-Clients
import { Inter, Bebas_Neue, JetBrains_Mono, Montserrat, Oswald } from "next/font/google";
import "./globals.css";

// KOMPONENTEN
import Navbar from "@/components/navigation/frontend/NavBar";
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
    /**
     * 1. BRANDING KERNEL
     * Lädt die visuellen Identitätsmerkmale (Farben) aus der site_settings Tabelle.
     */
    const { data: settingsData } = await db
        .from("site_settings")
        .select("key, value")
        .in("key", ["accent_rgb", "bg_rgb"]);

    const settings = settingsData || [];
    const colors = {
        accent: settings.find((s: any) => s.key === "accent_rgb")?.value || "37 99 235",
        bg: settings.find((s: any) => s.key === "bg_rgb")?.value || "5 5 5",
    };

    /**
     * 2. SESSION & USER-DATEN
     * Wir validieren die Session über getUser() für maximale Sicherheit.
     */
    const { data: { user } } = await db.auth.getUser();

    // Status für die NavBar festlegen
    const sessionActive = !!user;

    // Namens-Logik: Priorität auf Metadaten, Fallback auf E-Mail-Präfix
    const userName = user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        "Admin Node_01";

    const userEmail = user?.email || "news24regional@gmail.com";

    return (
        <html lang="de" className="dark">
        <body className={`
                ${inter.variable} 
                ${bebas.variable} 
                ${mono.variable} 
                ${montserrat.variable} 
                ${oswald.variable} 
                min-h-screen font-sans antialiased bg-[#050505] text-white
            `}>

        {/* Dynamische Injektion der Branding-Farben */}
        <style dangerouslySetInnerHTML={{ __html: `
                    :root {
                        --accent: ${colors.accent};
                        --background: ${colors.bg};
                    }
                `}} />

        <ThemeProvider>
            <Tracker />
            <SessionGuard />
            <Navbar />

            {/* TEST ZEILE */}
            <div className="fixed top-0 left-0 w-full h-1 bg-red-500 z-[9999]"></div>
            

            <main>{children}</main>
            <Footer />
        </ThemeProvider>
        </body>
        </html>
    );
}