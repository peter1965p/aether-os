import { getAllCustomers } from "@/modules/pos/actions";
import CustomerClientContainer from "./CustomerClientContainer";

export default async function CustomerManagementPage() {
  // Wir laden die echten Daten direkt über die POS-Actions im Gehirn
  const customers = await getAllCustomers();

  return (
    <div className="space-y-16 p-2">
      {/* Header Bereich - Jetzt im massiven AETHER Style */}
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Status Indicator: Orange für Customer Module */}
            <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
              Aether // Identity Management
            </span>
          </div>

          <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none text-white">
            Customer <span className="text-[#1a1a1a]">Database</span>
          </h1>

          <p className="text-[#444444] text-[10px] font-bold uppercase tracking-[0.3em] border-l-2 border-orange-500 pl-4">
            Monitoring External Entities // Registry: {customers.length} nodes
            active
          </p>
        </div>

        {/* Action Button - Orange Theme */}
        <button className="bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] hover:bg-orange-400 hover:scale-105 transition-all uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(249,115,22,0.2)] active:scale-95">
          Register New Entity +
        </button>
      </div>

      {/* Der Client Container übernimmt ab hier.
          Er sollte das Grid-Layout und die Searchbar enthalten,
          die wir vorhin besprochen haben.
      */}
      <div className="relative">
        <CustomerClientContainer initialCustomers={customers} />
      </div>

      {/* Subtiler Background Effekt für das gesamte Modul */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}
