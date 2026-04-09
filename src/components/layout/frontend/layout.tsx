import { ThemeProvider } from '@/context/ThemeContext';
// import Navbar from '@/components/frontend/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-black">
        <ThemeProvider>
          {/* Die Navbar wohnt jetzt HIER zentral */}
          <div className="fixed left-1/2 -translate-x-1/2 z-50 top-8 w-[90%]">
          </div>
          
          {/* Die jeweilige Seite (page.tsx oder [slug]/page.tsx) */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}