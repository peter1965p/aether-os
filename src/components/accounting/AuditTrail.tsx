import db from '@/lib/db';
import { Monitor, Globe, ArrowUpRight, Clock } from 'lucide-react';

export default function AuditTrail() {
  // SQL Query basierend auf deinem ER-Diagramm
  const logs = db.prepare(`
    SELECT
      o.id,
      o.datum,
      o.typ,
      o.gesamtpreis,
      o.status,
      p.name as artikel_name,
      p.ust_satz
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN produkte p ON oi.produkt_id = p.id
    ORDER BY o.datum DESC
    LIMIT 8
  `).all() as any[];

  return (
    <div className="w-full bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden animate-in fade-in duration-700">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Clock className="text-emerald-500" size={20} />
          <h2 className="text-xl font-black italic uppercase tracking-tighter">
            Audit Trail <span className="text-white/20">// Realtime Log</span>
          </h2>
        </div>
        <div className="flex gap-2">
           <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">
             <Monitor size={10} /> POS
           </span>
           <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">
             <Globe size={10} /> Online
           </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 border-b border-white/5">
              <th className="p-6">Timestamp</th>
              <th className="p-6">Source</th>
              <th className="p-6">Asset / Product</th>
              <th className="p-6 text-right">Tax Class</th>
              <th className="p-6 text-right">Gross Amount</th>
              <th className="p-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-mono text-[10px] text-white/40 italic">
                  {new Date(log.datum).toLocaleString('de-DE')}
                </td>
                <td className="p-6">
                  {log.typ === 'POS' ? (
                    <div className="flex items-center gap-2 text-amber-500">
                      <Monitor size={14} />
                      <span className="text-[10px] font-black uppercase tracking-tighter italic">Terminal</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-500">
                      <Globe size={14} />
                      <span className="text-[10px] font-black uppercase tracking-tighter italic">Webstore</span>
                    </div>
                  )}
                </td>
                <td className="p-6">
                  <p className="font-black uppercase italic tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
                    {log.artikel_name}
                  </p>
                </td>
                <td className="p-6 text-right font-mono text-[10px] text-white/40">
                  {log.ust_satz}% UST
                </td>
                <td className="p-6 text-right font-black italic text-lg tracking-tighter">
                  {log.gesamtpreis.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </td>
                <td className="p-6">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase border border-emerald-500/20">
                      {log.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
