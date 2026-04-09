import db from "@/lib/db";
import Navbar from "@/components/layout/frontend/bar/Navbar";
import Footer from "@/components/layout/frontend/footer/Footer";
import {
  Inter,
  Bebas_Neue,
  JetBrains_Mono,
  Montserrat,
  Oswald,
} from "next/font/google";

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

// Interface für die Typ-Sicherheit
interface SiteSetting {
  key: string;
  value: string;
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Supabase Abfrage
  const { data: settingsData, error } = await db
    .from("site_settings")
    .select("key, value")
    .in("key", ["accent_rgb", "bg_rgb", "card_rgb"]);

  if (error) {
    console.error("AETHER OS - Style Kernel Error:", error.message);
  }

  // 2. Auth-Check für die Navbar (Fix für den 'session' Error)
  const { data: { session } } = await db.auth.getSession();
  const hasSession = !!session;

  // 3. Daten verarbeiten mit explizitem Typ-Casting (Fix für 's' is any)
  const settings = (settingsData as SiteSetting[]) || [];

  const colors = {
    accent: settings.find((s) => s.key === "accent_rgb")?.value || "255 77 0",
    bg: settings.find((s) => s.key === "bg_rgb")?.value || "0 0 0",
    card: settings.find((s) => s.key === "card_rgb")?.value || "7 7 7",
  };

  return (
    <div
      style={{
        // @ts-ignore
        "--accent-rgb": colors.accent,
        "--bg-rgb": colors.bg,
        "--card-rgb": colors.card,
      }}
      className={`${inter.variable} ${bebas.variable} ${mono.variable} ${montserrat.variable} ${oswald.variable} min-h-screen transition-colors duration-500 font-sans`}
      id="aether-root"
    >
      <style>{`
        #aether-root { background-color: rgb(${colors.bg}); color: white; }
        .bg-card { background-color: rgb(${colors.card}); }

        /* AETHER OS Fonts */
        .font-bebas { font-family: var(--font-bebas); }
        .font-mono { font-family: var(--font-mono); }
        .font-montserrat { font-family: var(--font-montserrat); }
        .font-oswald { font-family: var(--font-oswald); }
      `}</style>

      {/* Wir geben die echte Session an die Navbar weiter */}
      <Navbar session={hasSession} />
      
      <main>{children}</main>
      
      <Footer />
    </div>
  );
}