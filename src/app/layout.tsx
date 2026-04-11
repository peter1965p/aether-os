// src/app/layout.tsx
import { cookies } from "next/headers";
import Navbar from "@/components/layout/frontend/bar/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import SessionGuard from "@/modules/auth/SessionTimeout";
import "./globals.css";

// GEO-Import
import { getGeoContextForFrontend } from "@/modules/inventory/actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("aether_session_start");

  // GEO-Daten abrufen
  const geoSchema = await getGeoContextForFrontend();

  return (
    <html lang="de" className="bg-[#050505]">
      <head>
        {geoSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(geoSchema) }}
          />
        )}
      </head>
      {/* FIX: Hintergrund auf Schwarz ändern und Text auf Weiß für Stealth-Look */}
      <body className="bg-[#050505] text-white antialiased min-h-screen">
        <ThemeProvider>
          {/* Navbar steuert selbst, ob sie sich rendert */}
          <Navbar session={hasSession} />

          {/* Der 5-Minuten Wächter */}
          <SessionGuard />

          {/* WICHTIG: Das pt-20 darf im Admin/Login nicht stören. 
              Da die Navbar dort 'null' liefert, ist der Platz oben frei.
              Der Body-Background (#050505) füllt das jetzt pechschwarz aus.
          */}
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}