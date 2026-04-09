'use client';

import { publishPage } from '@/modules/inventory/actions';
import { useState, useEffect } from 'react';
import { 
  Layout, Plus, Eye, Save, Move, 
  FileText, ChevronDown, Trash2,
  ImageIcon, Type, MousePointer, MousePointer2 
} from 'lucide-react';

export default function PageBuilder() {
  const [pages, setPages] = useState([
    { id: 1, title: 'Frontpage', slug: 'home' },
    { id: 2, title: 'Über Uns', slug: 'about' }
  ]);
  
  const [activePage, setActivePage] = useState(pages[0]);
  const [activeSection, setActiveSection] = useState('HERO_SECTION');

  const [heroContent, setHeroContent] = useState({
    title: 'AETHER OS',
    description: 'NEXT GEN CORPORATE TERMINAL'
  });

  // LOGIK HIER OBEN (Nach den States, vor dem return)
  const handleCreatePage = () => {
    const title = prompt("Name der neuen Seite für AETHER COMPANY:");
    if (title) {
      const slug = title.toLowerCase().replace(/ /g, '-');
      const newPage = { id: Date.now(), title, slug };
      setPages([...pages, newPage]);
      setActivePage(newPage);
    }
  };

  const handlePublish = async () => {
    const pageData = {
      title: activePage.title,
      slug: activePage.slug,
      content: JSON.stringify(heroContent) 
    };

    const result = await publishPage(pageData);
    
    if (result.success) {
      alert(`MISSION CONTROL: Seite "${activePage.title}" wurde erfolgreich im AETHER OS veröffentlicht!`);
    } else {
      alert("SYSTEM_ERROR: Veröffentlichung fehlgeschlagen.");
    }
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-4">
          <p className="text-[#444444] text-[10px] font-black tracking-[0.4em] uppercase">Editor // Frontend_Core</p>
          <div className="flex items-center gap-6">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white">
              PAGE<span className="text-blue-500">BUILDER</span>
            </h1>
            
            <div className="relative group">
              <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase text-blue-400 hover:border-blue-500 transition-all shadow-lg text-left">
                <FileText size={14} /> {activePage.title} <ChevronDown size={12} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-xl hidden group-hover:block z-50 overflow-hidden shadow-2xl">
                {pages.map(page => (
                  <button 
                    key={page.id}
                    onClick={() => setActivePage(page)}
                    className={`w-full p-4 text-left text-[9px] font-black uppercase flex justify-between items-center group/item border-b border-white/5 transition-colors ${activePage.id === page.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {page.title}
                  </button>
                ))}
                <button onClick={handleCreatePage} className="w-full p-4 text-left text-[9px] font-black uppercase text-green-500 hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2">
                  <Plus size={12} /> Neue Seite erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 border border-white/10 text-white font-black uppercase rounded-xl hover:bg-white/5 transition-all flex items-center gap-2 text-[10px]">
            <Eye size={16}/> Preview
          </button>
          {/* HIER WIRD DIE FUNKTION JETZT KORREKT AUFGERUFEN */}
          <button 
            onClick={handlePublish}
            className="px-8 py-3 bg-blue-600 text-black font-black uppercase rounded-xl hover:bg-white transition-all flex items-center gap-2 text-[10px] shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Save size={16}/> Publish_Changes
          </button>
        </div>
      </header>

      {/* ... Rest der Datei bleibt wie gehabt */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-[#050505] border border-white/5 p-6 rounded-[2.5rem] space-y-4 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 ml-2">Active_Sections</h3>
            {/* Sektions-Buttons... */}
            {[
              { id: 'HERO_SECTION', label: 'Hero_Section' },
              { id: 'ABOUT_COMPANY', label: 'About_Company' },
              { id: 'PRODUCT_SHOWCASE', label: 'Product_Showcase' },
              { id: 'CONTACT_FOOTER', label: 'Contact_Footer' }
            ].map((section) => (
              <button 
                key={section.id} 
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all group ${activeSection === section.id ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <Move size={14} className={activeSection === section.id ? 'text-blue-500' : 'text-gray-600'} />
                  <span className={`text-[10px] font-bold uppercase ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`}>{section.label}</span>
                </div>
                {activeSection === section.id && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
              </button>
            ))}
          </div>
        </aside>

        <main className="lg:col-span-3">
           {/* Editor Area... */}
           <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-12 space-y-10 min-h-[600px] relative overflow-hidden">
             {/* Sektions-Header */}
             <div className="flex justify-between items-center pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 shadow-inner"><Layout size={24}/></div>
                  <div>
                    <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">
                      {activeSection.replace('_', ' ')}
                    </h3>
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em]">Editing: {activePage.title} // /{activePage.slug}</p>
                  </div>
                </div>
             </div>

             {/* Content Editor Logic */}
             {activeSection === 'HERO_SECTION' ? (
                <div className="grid grid-cols-1 gap-10 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1 flex items-center gap-2"><Type size={14} /> Headline_Text</label>
                    <input value={heroContent.title} onChange={(e) => setHeroContent({...heroContent, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-3xl font-black text-white italic uppercase tracking-tighter outline-none focus:border-blue-500 transition-all shadow-inner" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1 flex items-center gap-2"><MousePointer size={14} /> Sub_Description</label>
                    <textarea value={heroContent.description} onChange={(e) => setHeroContent({...heroContent, description: e.target.value})} rows={3} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white font-mono text-sm outline-none focus:border-blue-500 transition-all resize-none shadow-inner" />
                  </div>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-white/5 rounded-[2rem]">
                   <MousePointer2 size={40} className="text-gray-800 mb-4 animate-bounce" />
                   <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.4em]">Select Section to build</p>
                </div>
             )}
           </div>
        </main>
      </div>
    </div>
  );
}