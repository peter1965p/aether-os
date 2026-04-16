import type { Metadata } from "next";
import db from "@/lib/db";
import Navbar from "@/components/layout/frontend/bar/Navbar";
import Footer from "@/components/layout/frontend/footer/Footer";
import Tracker from "@/components/VisitorTracker";
import {
  Inter,
  Bebas_Neue,
  JetBrains_Mono,
  Montserrat,
  Oswald,
} from "next/font/google";

// FONTS INITIALISIEREN
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.paeffgen-it.de'),
  title: {
    default: "AETHER OS // Paeffgen IT Services",
    template: "%s | AETHER OS"
  },
  description: "Next-Gen Operating System für KFZ-Betriebe & Individual-Lösungen.",
  openGraph: {
    title: "AETHER OS",
    description: "Modernste IT-Infrastruktur für Ihr Unternehmen.",
    url: "https://www.paeffgen-it.de",
    siteName: "Paeffgen IT",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AETHER OS",
    images: ["/og-image.png"],
  },
};

interface SiteSetting {
  key: string;
  value: string;
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. STYLE KERNEL ABFRAGE
  const { data: settingsData } = await db
    .from("site_settings")
    .select("key, value")
    .in("key", ["accent_rgb", "bg_rgb", "card_rgb"]);

  // 2. AUTH SESSION CHECK
  const { data: { session } } = await db.auth.getSession();
  const hasSession = !!session;

  // 3. COLOR MAPPING MIT TYPESCRIPT FIX (Parameter "s" typisiert)
  const settings = (settingsData as SiteSetting[]) || [];
  
  const colors = {
    accent: settings.find((s: SiteSetting) => s.key === "accent_rgb")?.value || "34 197 94",
    bg: settings.find((s: SiteSetting) => s.key === "bg_rgb")?.value || "0 0 0",
    card: settings.find((s: SiteSetting) => s.key === "card_rgb")?.value || "10 10 10",
  };

  return (
    <div 
      id="aether-frontend-root"
      className={`${inter.variable} ${bebas.variable} ${mono.variable} ${montserrat.variable} ${oswald.variable} min-h-screen font-sans antialiased selection:bg-blue-500/30`}
      style={{
        // @ts-ignore
        "--accent-rgb": colors.accent,
        "--bg-rgb": colors.bg,
        "--card-rgb": colors.card,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --accent: ${colors.accent};
          --background: ${colors.bg};
          --card: ${colors.card};
        }
        
        /* Da dieses Layout im globalen Body sitzt, stylen wir den Body hier um */
        body { 
          background-color: rgb(${colors.bg}) !important; 
          color: white; 
        }

        .bg-card { background-color: rgb(${colors.card}); }
        .text-accent { color: rgb(${colors.accent}); }
        .border-accent { border-color: rgba(${colors.accent}, 0.2); }

        .font-bebas { font-family: var(--font-bebas); }
        .font-mono { font-family: var(--font-mono); }
        .font-montserrat { font-family: var(--font-montserrat); }
        .font-oswald { font-family: var(--font-oswald); }
        
        ::selection { background: rgba(${colors.accent}, 0.3); color: white; }
      `}} />

      {/* TRACKING LAYER */}
      <Tracker />

      {/* NAVIGATION LAYER */}
      <Navbar session={hasSession} />
      
      {/* CONTENT LAYER */}
      <main className="relative z-10 min-h-screen">
        {children}
      </main>
      
      {/* FOOTER LAYER */}
      <Footer />
    </div>
  );
}