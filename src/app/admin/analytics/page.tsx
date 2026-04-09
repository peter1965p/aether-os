import Navbar from '@/components/Navbar';

export default function AnalyticsPage() {
  // Beispiel-Daten (später aus DB)
  const stats = [
    { label: 'Total Views', value: '42.8K', trend: '+12.5%', color: 'text-blue-500' },
    { label: 'Avg. Read Time', value: '4m 12s', trend: '+2.1%', color: 'text-purple-500' },
    { label: 'Active Sessions', value: '1.240', trend: 'Live', color: 'text-green-500' },
  ];

  return (
    <main className="p-10 space-y-16">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Aether // Data Intelligence</span>
        </div>
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
          System <span className="text-[#1a1a1a]">Metrics</span>
        </h1>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl group hover:border-blue-500/20 transition-all">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">{stat.label}</p>
            <div className="flex items-baseline gap-4">
              <span className={`text-5xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] font-bold text-gray-500 italic uppercase">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Haupt-Chart Bereich (Visualisierung) */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-12">
           <div className="space-y-1">
              <h3 className="text-xl font-black italic uppercase tracking-tight">Traffic Pulse</h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">Last 24 Hours // Real-time Stream</p>
           </div>
           <div className="flex gap-2">
              <div className="px-4 py-2 bg-[#111] rounded-xl text-[10px] font-black uppercase border border-white/5 tracking-widest text-blue-500">Live</div>
           </div>
        </div>

        {/* Platzhalter für Chart-Visualisierung */}
        <div className="h-64 w-full flex items-end gap-2 px-2 border-b border-white/5 pb-2">
          {[40, 70, 45, 90, 65, 80, 50, 60, 85, 100, 75, 95].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-blue-500"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        
        {/* Chart-Footer */}
        <div className="flex justify-between mt-6 text-[8px] font-black uppercase tracking-widest text-gray-700 italic">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
    </main>
  );
}