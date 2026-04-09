import React from 'react';
import Link from 'next/link'; // Wichtig für clientseitiges Routing

export default function Navbar() {
  // Wir definieren die Menüpunkte als Objekte, damit Link und Label getrennt sind
  const menuItems = [
    { label: 'HOME', path: '/' },
    { label: 'BLOG', path: '/blog' },
    { label: 'LOGIN', path: '/login' },
    { label: 'REGISTER', path: '/register' }
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
        
        {/* Logo Bereich */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-white shadow-lg transition-transform group-hover:scale-110">
            A
          </div>
          <span className="font-black uppercase tracking-tighter text-xl text-white">
            AETHER<span className="text-blue-500 italic">.OS</span>
          </span>
        </Link>

        {/* Navigation Links - Hier war der Fehler */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.path} 
              className="text-[11px] font-black tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link 
          href="/register" 
          className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl"
        >
          Request Access
        </Link>

      </div>
    </nav>
  );
}