/**
 * AETHER OS // ROOT LAYOUT
 * Standort: src/app/layout.tsx
 * Zweck: Globales Framework ohne UI-Elemente wie Navbars.
 */
import Navbar from "@/components/navigation/NavBar";
import { ThemeProvider } from "@/context/ThemeContext";
import SessionGuard from "@/modules/auth/SessionTimeout";
import Tracker from "@/components/VisitorTracker";

import "./globals.css";
import Footer from "@/components/layout/frontend/footer/Footer";

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de" className="bg-[#050505]">
        <body className="bg-[#050505] text-white antialiased min-h-screen">
        <ThemeProvider>
            {/* Globale Dienste bleiben aktiv */}
            <Tracker />
            <Navbar />


            <SessionGuard />

            {/* Kinder rendern (entweder Frontend oder Dashboard) */}
            {children}
            
            
        </ThemeProvider>
        <Footer/>
        </body>
        </html>
    );
}