'use client';

import React from 'react';
import { Layout, Grid, Sparkles } from 'lucide-react';

export function AssetBar({ onAddTemplate }: { onAddTemplate: (template: any) => void }) {
  // Alle Templates in EINEM Array sammeln
  const templates = [
    {
      id: 'lp_hero_premium',
      label: 'LandPress Premium',
      description: 'High-End Dashboard Promo',
      icon: <Sparkles className="text-amber-400" />,
      data: {
        type: 'frame',
        position: { x: 50, y: 50 },
        size: { width: 1200, height: 700 },
        style: { 
          backgroundColor: '#0f172a', 
          borderRadius: '40px', 
          padding: '60px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        },
        children: [
          { 
            id: 'lp_title', type: 'text', 
            content: 'The all-in-one platform for digital content creators', 
            position: { x: 100, y: 80 },
            style: { fontSize: '56px', fontWeight: '900', color: '#fff', textAlign: 'center', width: 1000 } 
          },
          { 
            id: 'lp_dashboard', type: 'frame', 
            position: { x: 100, y: 320 },
            size: { width: 1000, height: 320 },
            style: { backgroundColor: '#ffffff10', borderRadius: '24px', border: '1px solid #ffffff20', backdropFilter: 'blur(10px)' }
          }
        ]
      }
    },
    {
      id: 'hero_split',
      label: 'Hero Split',
      description: 'Image + Headline',
      icon: <Layout className="text-blue-400" />,
      data: {
        type: 'frame',
        size: { width: 1440, height: 600 },
        style: { display: 'flex', backgroundColor: '#050505', gap: '40px', padding: '80px' },
        children: [
          {
            type: 'frame',
            size: { width: 600, height: 440 },
            style: { backgroundColor: '#1a1a1a', borderRadius: '24px', border: '1px solid #ffffff10' },
            children: [{ type: 'text', content: 'IMG', position: { x: 280, y: 200 }, style: { color: '#333' } }]
          },
          {
            type: 'text',
            content: 'Future of \nDesign',
            position: { x: 700, y: 150 },
            style: { fontSize: '80px', fontWeight: '900', color: '#ffffff', lineHeight: '1.1' }
          }
        ]
      }
    },
    {
      id: 'feature_grid',
      label: 'Feature Grid',
      description: '3-Column Layout',
      icon: <Grid className="text-purple-400" />,
      data: {
        type: 'frame',
        size: { width: 1440, height: 400 },
        style: { display: 'flex', backgroundColor: '#000', justifyContent: 'space-around', padding: '60px' },
        children: [
          { type: 'text', content: 'Feature A', position: { x: 100, y: 100 }, style: { fontSize: '24px', color: '#fff' } },
          { type: 'text', content: 'Feature B', position: { x: 600, y: 100 }, style: { fontSize: '24px', color: '#fff' } },
          { type: 'text', content: 'Feature C', position: { x: 1100, y: 100 }, style: { fontSize: '24px', color: '#fff' } }
        ]
      }
    }
  ];

  return (
    <div className="w-64 border-r border-white/5 bg-[#050505] flex flex-col p-4 gap-4 overflow-y-auto min-w-[256px]">
      <div className="mb-4">
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Library</h3>
        <p className="text-[9px] text-white/40 mt-1">Smart Blocks for Company</p>
      </div>

      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onAddTemplate(t.data)}
          className="w-full aspect-[4/3] bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-start justify-between hover:bg-white/[0.05] hover:border-blue-500/50 transition-all group text-left"
        >
          <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
            {t.icon}
          </div>
          <div>
            <div className="text-[11px] font-bold text-white group-hover:text-blue-400">{t.label}</div>
            <div className="text-[9px] text-white/30 truncate w-48">{t.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}