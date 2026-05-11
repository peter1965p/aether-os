/**
 * AETHER OS // DOCUMENTS PAGE (EXTENDED)
 * Pfad: src/app/(dashboard)/client/documents/page.tsx
 */
"use client";

import React, { useState, useEffect } from 'react';
import { getCustomerInvoices, generateInvoiceData } from "@/modules/shop/actions"; 
import { FileText, Download, Loader2, AlertCircle } from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await getCustomerInvoices(1); // Client_ID 1
      if (response.success && response.data) {
        setDocuments(response.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  /**
   * Verarbeitet den Download-Prozess
   * @param orderId - Die numerische ID aus der Datenbank
   */
  const handleDownload = async (orderId: number) => {
    setProcessingId(orderId.toString());

    try {
      // 1. Hole die detaillierten Rechnungsdaten (Preise, Steuern, Posten)
      const invoiceDetail = await generateInvoiceData(orderId);

      if (!invoiceDetail) {
        alert("Fehler beim Abrufen der Rechnungsdetails.");
        return;
      }

      // 2. Logik zur PDF-Erzeugung oder Navigation zur Druckansicht
      // Für AETHER OS nutzen wir vorerst eine dedizierte Druck-Route
      window.open(`/client/orders/${orderId}`, '_blank');

    } catch (error) {
      console.error("AETHER_DOWNLOAD_FAULT:", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-8 text-blue-500 font-mono flex items-center gap-3"><Loader2 className="animate-spin" /> INITIALISIERE ARCHIV...</div>;

  return (
      <div className="p-6 space-y-6 bg-black min-h-screen text-white">
        <header className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black italic uppercase tracking-widest">
            Meine <span className="text-blue-500">Dokumente</span>
          </h1>
        </header>

        <div className="grid gap-4">
          {documents.map((doc) => (
              <div key={doc.id} className="group p-5 bg-zinc-900/30 border border-white/5 rounded-xl flex justify-between items-center hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg group-hover:bg-blue-500/10">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-bold uppercase tracking-tight">Rechnung</p>
                    <p className="text-xs text-zinc-500 font-mono">{doc.invoiceNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right font-mono">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total</p>
                    <p className="text-sm font-black text-white">{doc.amount.toFixed(2)} €</p>
                  </div>

                  <button
                      onClick={() => handleDownload(doc.id)}
                      disabled={processingId === doc.id.toString()}
                      className="p-3 bg-white/5 hover:bg-blue-500 disabled:opacity-50 rounded-full transition-all text-white flex items-center justify-center"
                  >
                    {processingId === doc.id.toString() ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}