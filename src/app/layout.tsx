// src/app/layout.tsx
import { cookies } from "next/headers";
import Navbar from "@/components/layout/frontend/bar/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import SessionGuard from "@/modules/auth/SessionTimeout";
import "./globals.css";

// GEO-Import: Wir holen die Daten direkt aus dem Hub
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
    <html lang="de">
      <head>
        {/* GEO-Injektion: Das hier lesen KIs statt klassischem SEO */}
        {geoSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(geoSchema) }}
          />
        )}
      </head>
      <body className="bg-[#f9f9f9] text-[#24292e] antialiased">
        <ThemeProvider>
          {/* Status-Check für die Navbar */}
          <Navbar session={hasSession} />

          {/* Der 5-Minuten Wächter (gemäß deiner Vorgabe) */}
          <SessionGuard />

          <main className="pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}