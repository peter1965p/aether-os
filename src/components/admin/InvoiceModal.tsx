"use client";

import { Printer, X, Download } from "lucide-react";

interface InvoiceProps {
  data: {
    order: { id: number; datum: string; gesamtpreis: number };
    items: Array<{ name: string; menge: number; einzelpreis: number }>;
  };
  onClose: () => void;
}

export function InvoiceModal({ data, onClose }: InvoiceProps) {
  if (!data) return null;
  const { order, items } = data;

  const handlePrint = () => {
    // Öffnet ein neues Fenster, um Firefox-Layout-Bugs zu umgehen
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = items
      .map(
        (item) => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
        <div>
          <div style="font-weight: bold; text-transform: uppercase;">${item.name}</div>
          <div style="font-size: 10px; color: #666;">${item.menge} x ${item.einzelpreis.toFixed(2)}€</div>
        </div>
        <div style="font-weight: bold;">${(item.menge * item.einzelpreis).toFixed(2)}€</div>
      </div>
    `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>AETHER OS - Invoice #${order.id}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: black; background: white; padding: 40px; }
            .header { border-bottom: 3px solid black; margin-bottom: 30px; padding-bottom: 10px; }
            .total { font-size: 28px; font-weight: bold; margin-top: 30px; display: flex; justify-content: space-between; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0; font-style: italic;">INVOICE</h1>
            <p style="font-size: 12px; margin: 5px 0;">ID: ${order.id} // ${new Date(order.datum).toLocaleString()}</p>
          </div>
          <div class="items">${itemsHtml}</div>
          <div class="total">
            <span>TOTAL</span>
            <span>${order.gesamtpreis.toFixed(2)}€</span>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 100);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div
        id="printable-invoice"
        className="bg-[#0a0a0a] text-white border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-10 animate-in zoom-in duration-300"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter">
              INVOICE
            </h2>
            <p className="text-[10px] font-mono text-white/30 uppercase mt-2">
              ID_{order.id} // {new Date(order.datum).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Items List */}
        <div className="space-y-6 mb-12 max-h-[40vh] overflow-y-auto pr-2">
          {items.map((item: any, i: number) => (
            <div
              key={i}
              className="flex justify-between items-end border-b border-white/5 pb-4"
            >
              <div className="space-y-1">
                <p className="text-xs font-black uppercase">{item.name}</p>
                <p className="text-[10px] font-mono text-white/40">
                  {item.menge} x {item.einzelpreis.toFixed(2)}€
                </p>
              </div>
              <span className="text-sm font-bold">
                {(item.menge * item.einzelpreis).toFixed(2)}€
              </span>
            </div>
          ))}
        </div>

        {/* Total Display */}
        <div className="bg-white/5 p-8 rounded-3xl mb-10">
          <div className="flex justify-between items-center text-3xl font-black italic tracking-tighter text-blue-500">
            <span>TOTAL</span>
            <span>{order.gesamtpreis.toFixed(2)}€</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print Receipt
          </button>
          <button className="p-5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
