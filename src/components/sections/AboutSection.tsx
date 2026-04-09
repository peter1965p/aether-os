import React from 'react';

export default function AboutSection({ data }: { data: any }) {
  return (
    <section className="py-24 px-6 bg-white flex flex-col md:flex-row items-center justify-center gap-16 max-w-7xl mx-auto">
      {/* Linke Seite: Bild mit Play-Button-Effekt */}
      <div className="relative w-full md:w-1/2 group">
        <img 
          src={data.image_url} 
          alt="Company Story" 
          className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 bg-white text-orange-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <span className="ml-1 text-2xl">▶</span>
          </button>
        </div>
      </div>

      {/* Rechte Seite: Content */}
      <div className="w-full md:w-1/2 space-y-6">
        <h4 className="text-orange-600 font-bold uppercase tracking-widest text-sm">
          {data.subtitle}
        </h4>
        <h2 className="text-4xl font-bold text-slate-900 leading-tight">
          {data.title}
        </h2>
        <p className="text-slate-500 leading-relaxed text-lg">
          {data.content}
        </p>
        <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-colors">
          {data.button_text}
        </button>
      </div>
    </section>
  );
}