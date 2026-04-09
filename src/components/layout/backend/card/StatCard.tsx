interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  color?: 'blue' | 'red' | 'orange'; // Orange für Inventory-Warnungen
  icon?: React.ReactNode; // Neu: Für die Dashboard-Icons
}

export function StatCard({ title, value, sub, color = 'blue', icon }: StatCardProps) {
  // Mapping für die Glow-Farben und Rahmen-Effekte
  const themes = {
    blue: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] border-blue-500/0 hover:border-blue-500/40 text-blue-500',
    red: 'hover:shadow-[0_0_40px_rgba(239,68,68,0.1)] border-red-500/0 hover:border-red-500/40 text-red-500',
    orange: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] border-orange-500/0 hover:border-orange-500/40 text-orange-500'
  };

  return (
    <div className={`bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] transition-all duration-700 group relative overflow-hidden ${themes[color].split(' ').slice(0, 2).join(' ')}`}>
      {/* Dekoratives Hintergrund-Leuchten bei Hover */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`} />

      <div className="flex justify-between items-start mb-6">
        <p className="text-[#444] text-[9px] font-black uppercase tracking-[0.4em] group-hover:text-white/40 transition-colors">
          {title}
        </p>
        {icon && (
          <div className={`opacity-20 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 ${themes[color].split(' ').pop()}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h2 className="text-5xl font-black text-white tracking-tighter italic leading-none">
          {value}
        </h2>
      </div>

      <p className="text-[#222] text-[10px] font-bold mt-4 uppercase tracking-widest group-hover:text-white/20 transition-colors">
        {sub}
      </p>
    </div>
  );
}