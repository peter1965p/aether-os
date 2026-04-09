'use client';

import React, { useEffect, useState } from 'react';
import db from '@/lib/db';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';

export default function FinanceMasterWidget() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    orderCount: 0,
    avgOrderValue: 0,
    growth: 12.5 // Hardcoded für den Look, bis die History-Logik steht
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFinanceData() {
      try {
        setLoading(true);
        
        // KERNEL DATA FETCH: Wir holen die Verkäufe und joinen die PRODUCTS (nicht produkte!)
        const { data: orders, error } = await db
          .from('orders')
          .select(`
            id,
            total_price,
            status,
            order_items (
              quantity,
              price_at_purchase,
              products (
                name
              )
            )
          `);

        if (error) throw error;

        if (orders) {
          const total = orders.reduce((sum: number, order: any) => sum + (Number(order.total_price) || 0), 0);
          const count = orders.length;
          
          setMetrics({
            totalRevenue: total,
            orderCount: count,
            avgOrderValue: count > 0 ? total / count : 0,
            growth: 12.5
          });
        }
      } catch (err) {
        console.error("AETHER_FINANCE_ERROR: Check table relationships.", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFinanceData();
  }, []);

  return (
    <div className="p-10 w-full bg-black/20 backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* 1. Revenue Card */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500/50">
            <Wallet size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Revenue</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-black italic text-white tracking-tighter">
              {metrics.totalRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </h3>
            <div className="flex items-center text-green-500 text-[10px] font-bold bg-green-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} />
              {metrics.growth}%
            </div>
          </div>
        </div>

        {/* 2. Orders Card */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-purple-500/50">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Orders</span>
          </div>
          <h3 className="text-5xl font-black italic text-white tracking-tighter">
            {metrics.orderCount.toString().padStart(2, '0')}
          </h3>
        </div>

        {/* 3. Avg Value Card */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-500/50">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Avg Ticket</span>
          </div>
          <h3 className="text-5xl font-black italic text-white tracking-tighter">
            {metrics.avgOrderValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </h3>
        </div>

        {/* 4. System Pulse Visualizer */}
        <div className="flex items-center justify-end">
          <div className="flex gap-1 h-12 items-end">
            {[40, 70, 45, 90, 65, 80, 30, 50].map((h, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-blue-500/20 rounded-full overflow-hidden relative"
                style={{ height: `${h}%` }}
              >
                <div className="absolute bottom-0 w-full bg-blue-500 animate-pulse" style={{ height: '40%' }} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
          <div className="text-[10px] font-black text-blue-500 animate-pulse tracking-[0.5em] uppercase">
            Syncing Financial Kernel...
          </div>
        </div>
      )}
    </div>
  );
}