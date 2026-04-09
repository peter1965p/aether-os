export default function EnterpriseHero() {
  return (
    <section className="bg-[#232222] min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Badge oben - mit Hex-Werten für die feine Linie */}
      <div className="flex items-center gap-4 mb-12 text-xs font-bold tracking-[0.3em] uppercase text-[#666666]">
        <span className="w-10 h-[1px] bg-[#222222]"></span>
        Be the first to know
        <span className="w-10 h-[1px] bg-[#222222]"></span>
      </div>

      {/* Die große Headline - Hartes Weiß und dein Enterprise-Orange */}
      <h1 className="text-6xl md:text-8xl font-black text-[#ffffff] tracking-tighter mb-8 leading-[0.9] uppercase">
        NEXT.JS <span className="text-[#ff4d00]">ENTERPRISE</span>
      </h1>

      {/* Subtitle in einem sauberen Grau-Hex */}
      <p className="max-w-2xl text-lg md:text-xl text-[#999999] mb-12 leading-relaxed">
        Ein modulares Betriebssystem für moderne Teams. 
        Dynamisch gespeist aus deiner SQLite-Datenbank.
      </p>

      {/* Die Buttons */}
      <div className="flex flex-wrap justify-center gap-6">
        <button className="bg-[#ff4d00] text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-[#ff4d00]/20">
          Join the waiting list
        </button>
        <button className="bg-[#111111] border border-[#222222] text-[#cccccc] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#1a1a1a] hover:text-white transition-all">
          View Docs
        </button>
      </div>

      {/* Input Feld im Hex-Dark-Style */}
      <div className="mt-16 w-full max-w-md">
        <div className="relative group">
          <input 
            type="email" 
            placeholder="Deine Email Adresse"
            className="w-full bg-[#0a0a0a] border border-[#222222] rounded-2xl px-6 py-5 outline-none focus:border-[#ff4d00] transition-all text-[#ffffff] placeholder:text-[#444444]"
          />
        </div>
      </div>
    </section>
  );
}