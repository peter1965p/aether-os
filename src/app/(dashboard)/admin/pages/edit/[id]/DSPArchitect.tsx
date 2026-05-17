"use client";

import React, { useState, useEffect, useTransition, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {
  Save, ArrowLeft, LayoutTemplate, Type, AlignLeft,
  Image as ImageIcon, ExternalLink, Cpu, Trash2,
  ArrowUp, ArrowDown, Plus, Send, Settings2, Upload, Loader2, CheckCircle2,
  Sliders, FileImage, Maximize2, Move, Unlock, Lock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import db from "@/lib/db";
import { savePageSection, uploadSectorImage } from "@/lib/actions/sector.actions"; 
import { updatePageIsLandingPage } from "../../actions";

import { ComplianceGuard } from "@/modules/admin/components/ComplianceGuard";
import { getSystemIdentity } from "@/lib/identity";

interface Sector {
  id: string | number;
  page_id?: number;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  section_type: string;
  button_text?: string;
  order_index: number;
}

interface FormLibraryItem {
  name: string;
  slug: string;
}

interface StorageBridgeConfig {
  show: boolean;               
  file: File | null;           
  previewUrl: string;          
  sectorId: string | number;   
  index: number;               
  quality: number;             
  format: "image/webp" | "image/jpeg"; 
}

// Intelligente Zentrierung, die erkennt ob Hoch- oder Querformat vorliegt
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number | null) {
  if (aspect) {
    // Falls Hochformat vorliegt, passen wir die initiale Breite an, damit es nicht blockiert
    const widthPercent = mediaWidth < mediaHeight ? 0.95 : 0.9;
    return centerCrop(
      makeAspectCrop({ unit: '%', width: widthPercent * 100 }, aspect, mediaWidth, mediaHeight),
      mediaWidth,
      mediaHeight
    );
  }
  // Komplettes Erfassen im Freihand-Modus
  return {
    unit: '%' as const,
    x: 0,
    y: 0,
    width: 100,
    height: 100
  };
}

export function DSPArchitect({ initialPage }: { initialPage: any }) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState<Sector[]>(initialPage.sectors || []);
  const [availableForms, setAvailableForms] = useState<FormLibraryItem[]>([]);
  const [systemIdentity, setSystemIdentity] = useState<any>({});
  
  const [isTransitionPending, startTransition] = useTransition();
  
  const [uploadingSectorId, setUploadingSectorId] = useState<string | number | null>(null);
  const [uploadSuccessSectorId, setUploadSuccessSectorId] = useState<string | number | null>(null);

  const [bridgeConfig, setBridgeConfig] = useState<StorageBridgeConfig>({
    show: false,
    file: null,
    previewUrl: "",
    sectorId: "",
    index: 0,
    quality: 0.85,       
    format: "image/webp" 
  });

  // --- ✂️ SEITENVERHÄLTNIS-UPDATE ---
  const [crop, setCrop] = useState<Crop>(); 
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>(); 
  const [aspect, setAspect] = useState<number | null>(null); // Standardmäßig frei ("null"), damit du sofort alles ziehen kannst!
  const [imageScale, setImageScale] = useState<number>(100);   

  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    async function initData() {
      const [{ data: formsData }, identityData] = await Promise.all([
        db.from("forms").select("name, slug"),
        getSystemIdentity()
      ]);
      if (formsData) setAvailableForms(formsData);
      if (identityData) setSystemIdentity(identityData);
    }
    initData();
  }, []);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, order_index: i })));
  };

  const addSection = () => {
    const newSection: Sector = {
      id: `new-${Math.random().toString(36).substr(2, 9)}`, 
      page_id: page.id,
      title: "New Sector",
      subtitle: "",
      content: "",
      image_url: "",
      button_text: "",
      section_type: "Standard",
      order_index: sections.length
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string | number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const triggerImagePipeline = (e: React.ChangeEvent<HTMLInputElement>, sectorId: string | number, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    
    setCrop(undefined);
    setCompletedCrop(undefined);
    setImageScale(100); 

    setBridgeConfig({
      show: true,
      file,
      previewUrl: objectUrl,
      sectorId,
      index,
      quality: 0.85, 
      format: "image/webp"
    });
    
    e.target.value = "";
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }, [aspect]);

  // Umschalt-Watcher: Berechnet das Gitter neu, wenn du den Lock-Button drückst
  useEffect(() => {
    if (imageRef.current && bridgeConfig.show) {
      const { width, height } = imageRef.current;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }, [aspect, bridgeConfig.show]);

  const executeProcessingAndUpload = async () => {
    const { file, sectorId, index, quality, format } = bridgeConfig;
    if (!file || !imageRef.current || !canvasRef.current || !completedCrop) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    if (!ctx) return;

    // Skalierungsfaktoren anhand der realen Bildauflösung berechnen
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      img,
      completedCrop.x * scaleX,   
      completedCrop.y * scaleY,   
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,                 
      0,                 
      completedCrop.width * scaleX,
      completedCrop.height * scaleY 
    );

    setBridgeConfig(prev => ({ ...prev, show: false }));

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("CRITICAL_PROCESSING_ERROR: Canvas Data Export Failed");
        return;
      }

      const fileExt = format === "image/webp" ? "webp" : "jpg";
      const optimizedFile = new File([blob], `sector_${Date.now()}.${fileExt}`, {
        type: format
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);

      try {
        setUploadingSectorId(sectorId);
        setUploadSuccessSectorId(null);

        const result = await uploadSectorImage(formData, sectorId);

        if (result.success && result.url) {
          const newSections = [...sections];
          newSections[index].image_url = result.url;
          setSections(newSections);
          
          setUploadSuccessSectorId(sectorId);
          setTimeout(() => setUploadSuccessSectorId(null), 4000);
        } else {
          console.error("❌ AWS_ORBITAL_STORAGE_UPLINK_FAILED:", result.error);
          alert(`AWS_STORAGE_CRITICAL: Uplink Failed -> ${result.error}`);
        }
      } catch (error: any) {
        console.error("❌ AWS_ORBITAL_STORAGE_UPLINK_FAILED:", error.message);
        alert(`AWS_STORAGE_CRITICAL: Uplink Exception.`);
      } {
        setUploadingSectorId(null);
        URL.revokeObjectURL(bridgeConfig.previewUrl);
      }
    }, format, quality);
  };

  const handleToggleLanding = () => {
    const nextStatus = !page.is_landingpage;
    setPage({ ...page, is_landingpage: nextStatus });

    startTransition(async () => {
      const { success } = await updatePageIsLandingPage(page.id, nextStatus);
      if (!success) setPage({ ...page, is_landingpage: !nextStatus });
      router.refresh();
    });
  };

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const pageTitle = formData.get("title") as string;
      const pageSlug = formData.get("slug") as string;
      
      const { error: pageUpdateError } = await db
        .from("pages")
        .update({ title: pageTitle, slug: pageSlug })
        .eq("id", page.id);

      if (pageUpdateError) {
        console.error("❌ CORE_PAGE_DEPLOYMENT_FAILED:", pageUpdateError.message);
        return;
      }

      const activeIds = sections.filter(s => typeof s.id === "number").map(s => s.id);
      if (activeIds.length > 0) {
        await db.from("sectors").delete().eq("page_id", page.id).not("id", "in", `(${activeIds.join(",")})`);
      } else {
        await db.from("sectors").delete().eq("page_id", page.id);
      }

      for (const section of sections) {
        const isNew = typeof section.id === "string" && section.id.startsWith("new-");
        
        const payload = {
          id: isNew ? undefined : (section.id as number),
          page_id: page.id,
          section_type: section.section_type,
          title: section.title,
          subtitle: section.subtitle || "",
          content: section.content,
          image_url: section.image_url || "",
          button_text: section.button_text || "",
          order_index: section.order_index
        };

        await savePageSection(payload);
      }

      router.refresh();
    });
  };

  return (
      <div className="p-8 max-w-5xl mx-auto min-h-screen font-mono text-white relative">

        {/* =========================================================================
            🎛️ CONTROL CENTER MODAL: INTERACTIVE CROPPING & PREFLIGHT BRIDGE
            ========================================================================= */}
        {bridgeConfig.show && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0c0c0c] border border-cyan-500/30 max-w-5xl w-full rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[95vh]">
              
              <div className="p-6 border-b border-white/5 bg-zinc-950 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Sliders size={18} className="text-cyan-500" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Storage Optimization Bridge</h3>
                    <p className="text-[8px] text-zinc-500 uppercase mt-0.5">8-Point Native Matrix Engine (No-Drift)</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    URL.revokeObjectURL(bridgeConfig.previewUrl);
                    setBridgeConfig(prev => ({ ...prev, show: false }));
                  }} 
                  className="text-zinc-500 hover:text-white uppercase text-[9px] font-black border border-white/10 px-3 py-1.5 rounded-lg hover:bg-zinc-900 transition-all"
                >
                  Abbrechen
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 relative grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* INTERACTIVE WORKSPACE (Left Column) */}
                <div className="lg:col-span-8 flex flex-col justify-between h-[58vh]">
                  <div className="w-full">
                    <label className="text-[8px] text-zinc-500 uppercase tracking-widest block mb-2">Original Payload Preview (All 8 Handles Active)</label>
                    
                    {/* Der Container bleibt stabil, die maximale Höhe des Bildes wird über das Style-Attribut geregelt */}
                    <div className="relative border border-white/5 bg-zinc-950/40 rounded-xl p-6 flex items-center justify-center h-[52vh] max-h-[52vh] overflow-hidden border-dashed">
                      <ReactCrop
                        crop={crop}
                        onChange={(c: Crop) => setCrop(c)}
                        onComplete={(c: PixelCrop) => setCompletedCrop(c)}
                        aspect={aspect ? aspect : undefined} 
                        className="max-h-full max-w-full"
                      >
                        <img 
                          ref={imageRef}
                          src={bridgeConfig.previewUrl} 
                          alt="Pre-upload checking" 
                          onLoad={onImageLoad} 
                          style={{ maxHeight: `${(imageScale * 45) / 100}vh` }}
                          className="max-w-full block select-none pointer-events-none rounded-sm object-contain transition-[max-height] duration-150"
                        />
                      </ReactCrop>
                    </div>
                  </div>

                  <div className="text-[7px] text-zinc-600 uppercase tracking-wider font-mono mt-2">
                    RAW_SIZE: {bridgeConfig.file ? (bridgeConfig.file.size / 1024 / 1024).toFixed(2) : 0} MB
                  </div>
                </div>

                {/* SCALE MATRIX SIDEBAR (Right Column) */}
                <div className="lg:col-span-4 bg-zinc-950/60 p-6 border border-white/5 rounded-2xl flex flex-col justify-between h-[58vh]">
                  
                  <div className="space-y-5 overflow-y-auto pr-1">
                    <div className="text-[10px] font-black uppercase text-cyan-500 border-b border-white/5 pb-2 tracking-widest">
                      Scale & Axis Matrix
                    </div>

                    {/* INTERACTIVE ASPECT MODE TOGGLE */}
                    <div className="space-y-2">
                      <label className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest block">Proportion Engine</label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => setAspect(null)}
                          className={`p-3 border rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all ${
                            aspect === null 
                              ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                              : "border-white/5 text-zinc-500 bg-transparent hover:border-white/10"
                          }`}
                        >
                          <Unlock size={12} /> Free Scaling (Full Height)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAspect(16 / 9)}
                          className={`p-3 border rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all ${
                            aspect === 16 / 9
                              ? "border-cyan-500 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                              : "border-white/5 text-zinc-500 bg-transparent hover:border-white/10"
                          }`}
                        >
                          <Lock size={12} /> Force 16:9 Landscape
                        </button>
                      </div>
                    </div>

                    {/* WORKSPACE ZOOM */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest block">Workspace Zoom</label>
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{imageScale}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="100" 
                        step="5"
                        value={imageScale}
                        onChange={(e) => setImageScale(parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-800 accent-cyan-500 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-[7px] text-zinc-500 uppercase leading-normal">
                        Verkleinert das Bild im Editor, um mehr Raum zum Ziehen zu schaffen.
                      </p>
                    </div>

                    {/* TARGET FORMAT */}
                    <div className="space-y-2">
                      <label className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest block">Target Format</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setBridgeConfig(p => ({ ...p, format: "image/webp" }))}
                          className={`p-2.5 border rounded-lg text-[9px] font-black uppercase transition-all ${
                            bridgeConfig.format === "image/webp" ? "border-cyan-500 text-cyan-400 bg-cyan-500/5" : "border-white/5 text-zinc-500"
                          }`}
                        >
                          WEBP
                        </button>
                        <button
                          type="button"
                          onClick={() => setBridgeConfig(p => ({ ...p, format: "image/jpeg" }))}
                          className={`p-2.5 border rounded-lg text-[9px] font-black uppercase transition-all ${
                            bridgeConfig.format === "image/jpeg" ? "border-cyan-500 text-cyan-400 bg-cyan-500/5" : "border-white/5 text-zinc-500"
                          }`}
                        >
                          JPEG
                        </button>
                      </div>
                    </div>

                    {/* COMPRESSION QUALITY */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest block">Compression</label>
                        <span className="font-mono text-[10px] text-zinc-400 font-bold">{(bridgeConfig.quality * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.2" 
                        max="1.0" 
                        step="0.05"
                        value={bridgeConfig.quality}
                        onChange={(e) => setBridgeConfig(p => ({ ...p, quality: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-zinc-800 accent-cyan-500 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                  </div>

                  {/* SUBMIT ENGINE */}
                  <div className="border-t border-white/5 pt-4 mt-auto space-y-3 bg-zinc-950/20">
                    {completedCrop && (
                      <div className="text-[8px] text-zinc-500 font-mono uppercase flex justify-between">
                        <span>Target Resolution:</span>
                        <span className="text-cyan-400 font-bold">{Math.round(completedCrop.width)}x{Math.round(completedCrop.height)}px</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={executeProcessingAndUpload}
                      disabled={!completedCrop} 
                      className={`w-full py-3.5 px-4 flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest rounded-xl font-black shadow-[0_0_20px_rgba(6,182,212,0.15)] ${
                          completedCrop 
                          ? "bg-cyan-600 hover:bg-cyan-500 text-white" 
                          : "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <FileImage size={14} /> S3 Inject
                    </button>
                  </div>

                </div>

                <canvas ref={canvasRef} className="hidden" />

              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            UI HEADER & FORM (Unverändert für die Datenintegrität)
            ========================================================================= */}
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8 sticky top-0 bg-black/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-6">
            <Link href="/admin/pages" className="p-3 bg-zinc-950 border border-white/10 text-zinc-500 hover:text-white transition-all rounded-xl">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] text-cyan-500 uppercase tracking-[0.3em] mb-1">
                <Cpu size={12} /> DSP_Architect_v1.9 // Storage_Control_Bridge
              </div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                {page.title} <span className="text-cyan-500">_MOD</span>
              </h1>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button
                type="button"
                onClick={handleToggleLanding}
                disabled={isTransitionPending}
                className={`px-4 py-3 border text-[9px] uppercase font-black tracking-widest transition-all rounded-xl ${
                    page.is_landingpage ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-white/5 text-zinc-600 hover:border-white/20'
                }`}
            >
              {page.is_landingpage ? "Active_Home" : "Set_Home"}
            </button>

            <button
                type="submit"
                form="main-edit-form"
                disabled={isTransitionPending}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 px-8 flex items-center gap-3 transition-all uppercase text-[10px] tracking-widest rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Save size={18} /> {isTransitionPending ? "Deploying..." : "Deploy_Changes"}
            </button>
          </div>
        </div>

        <form id="main-edit-form" action={handleSave}>
          <input type="hidden" name="page_id" value={page.id} />

          <ComplianceGuard page={page} sections={sections} identity={systemIdentity} />

          {/* CORE SETTINGS BLOCK */}
          <section className="bg-zinc-900/20 border border-white/5 p-8 mb-12 rounded-3xl backdrop-blur-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-cyan-500">
              <Settings2 size={14} /> Core_Settings
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Page Title</label>
                <input
                    name="title"
                    value={page.title}
                    onChange={(e) => setPage({...page, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 p-4 outline-none focus:border-cyan-500/50 rounded-xl font-bold uppercase"
                    placeholder="TITLE"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Page Slug</label>
                <input
                    name="slug"
                    value={page.slug}
                    onChange={(e) => setPage({...page, slug: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 p-4 text-cyan-500 outline-none rounded-xl font-mono"
                    placeholder="SLUG"
                />
              </div>
            </div>
          </section>

          {/* SECTOR STREAM ENGINE */}
          <div className="space-y-8">
            {sections.map((section, index) => (
                <div key={section.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  <div className="absolute -left-14 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <button type="button" onClick={() => moveSection(index, 'up')} className="p-2 bg-zinc-900 border border-white/10 rounded-lg hover:text-cyan-500 transition-colors"><ArrowUp size={14}/></button>
                    <button type="button" onClick={() => moveSection(index, 'down')} className="p-2 bg-zinc-900 border border-white/10 rounded-lg hover:text-cyan-500 transition-colors"><ArrowDown size={14}/></button>
                    <button type="button" onClick={() => removeSection(section.id)} className="p-2 bg-zinc-900 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                  </div>

                  <div className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] group-hover:border-cyan-500/30 transition-all shadow-xl">
                    <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                      <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        Sector_0{index + 1} // {section.section_type}
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="text-[8px] text-zinc-600 uppercase font-bold">Module_Type:</label>
                        <select
                            value={section.section_type}
                            onChange={(e) => {
                              const newSections = [...sections];
                              newSections[index].section_type = e.target.value;
                              setSections(newSections);
                            }}
                            className="bg-zinc-900 px-4 py-2 text-[10px] text-white border border-white/10 outline-none font-bold cursor-pointer hover:border-cyan-500/50 rounded-lg transition-all"
                        >
                          <option value="Standard">STANDARD_MODULE</option>
                          <option value="Hero">HERO_INTERFACE</option>
                          <option value="Grid">GRID_REGISTRY</option>
                          <option value="Form">FORM_UPLINK</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.section_type === "Form" ? (
                          <div className="bg-cyan-500/[0.03] border border-cyan-500/20 p-8 rounded-2xl space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                                <Send size={20} />
                              </div>
                              <div>
                                <h4 className="text-xs font-black uppercase text-white tracking-widest">Hardware_Link_Configuration</h4>
                                <p className="text-[8px] text-zinc-500 uppercase mt-1">Wähle eine Node aus der Form Library</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[8px] text-cyan-500/60 uppercase font-black tracking-widest">Active Form Endpoint</label>
                              <select
                                  value={section.content}
                                  onChange={(e) => {
                                    const newSections = [...sections];
                                    newSections[index].content = e.target.value;
                                    setSections(newSections);
                                  }}
                                  className="w-full bg-zinc-950 border border-white/10 p-5 text-sm font-black uppercase tracking-tighter outline-none focus:border-cyan-500 text-white rounded-xl"
                              >
                                <option value="">-- WAITING FOR SELECTION --</option>
                                {availableForms.map(f => (
                                    <option key={f.slug} value={f.slug}>{f.name.toUpperCase()} (/{f.slug})</option>
                                ))}
                              </select>
                            </div>
                          </div>
                      ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Sector Title</label>
                                <input
                                    value={section.title}
                                    onChange={(e) => {
                                      const newSections = [...sections];
                                      newSections[index].title = e.target.value;
                                      setSections(newSections);
                                    }}
                                    className="w-full bg-zinc-950/50 border border-white/5 p-4 text-xl font-black italic uppercase outline-none focus:border-cyan-500/30 rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Sector Subtitle</label>
                                <input
                                    value={section.subtitle || ""}
                                    onChange={(e) => {
                                      const newSections = [...sections];
                                      newSections[index].subtitle = e.target.value;
                                      setSections(newSections);
                                    }}
                                    className="w-full bg-zinc-950/50 border border-white/5 p-4 text-sm font-bold uppercase outline-none focus:border-cyan-500/30 rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                              <div className="md:col-span-5 space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                  <ImageIcon size={10} className="text-cyan-500" /> Sector Image Link (AWS URL)
                                </label>
                                <input
                                    type="text"
                                    value={section.image_url || ""}
                                    onChange={(e) => {
                                      const newSections = [...sections];
                                      newSections[index].image_url = e.target.value;
                                      setSections(newSections);
                                    }}
                                    placeholder="AWS S3 Node Link..."
                                    className="w-full bg-zinc-950/50 border border-white/5 p-4 text-xs font-mono outline-none focus:border-cyan-500/30 text-zinc-300 rounded-xl"
                                />
                              </div>

                              <div className="md:col-span-4 space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">AWS_Orbital_Upload</label>
                                <div className="relative">
                                  <input
                                      type="file"
                                      accept="image/*"
                                      id={`aws-upload-${section.id}`}
                                      disabled={uploadingSectorId === section.id}
                                      onChange={(e) => triggerImagePipeline(e, section.id, index)}
                                      className="hidden"
                                  />
                                  <label
                                      htmlFor={`aws-upload-${section.id}`}
                                      className={`w-full border p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs uppercase font-bold transition-all ${
                                          uploadingSectorId === section.id
                                              ? "bg-zinc-950 border-cyan-500/30 text-cyan-500 cursor-wait animate-pulse"
                                              : uploadSuccessSectorId === section.id
                                              ? "bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                              : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-cyan-500/30"
                                      }`}
                                  >
                                    {uploadingSectorId === section.id ? (
                                        <>
                                          <Loader2 size={14} className="animate-spin text-cyan-500" />
                                          AWS_S3_SYNC...
                                        </>
                                    ) : uploadSuccessSectorId === section.id ? (
                                        <>
                                          <CheckCircle2 size={14} className="text-emerald-400 animate-bounce" />
                                          SYNC_SUCCESS
                                        </>
                                    ) : (
                                        <>
                                          <Upload size={14} className="text-cyan-500" />
                                          Upload via AWS
                                        </>
                                    )}
                                  </label>
                                </div>
                              </div>
                              
                              <div className="md:col-span-3 space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Button Payload</label>
                                <input
                                    type="text"
                                    value={section.button_text || ""}
                                    onChange={(e) => {
                                      const newSections = [...sections];
                                      newSections[index].button_text = e.target.value;
                                      setSections(newSections);
                                    }}
                                    placeholder="BUTTON_TEXT"
                                    className="w-full bg-zinc-950/50 border border-white/5 p-4 text-xs outline-none focus:border-cyan-500/30 rounded-xl font-bold uppercase"
                                />
                              </div>
                            </div>

                            {section.image_url && (
                              <div className="border border-white/5 bg-zinc-900/10 p-2 rounded-xl animate-in fade-in duration-300 max-w-md">
                                <div className="text-[7px] text-zinc-600 font-mono uppercase tracking-widest mb-1 px-1 flex justify-between">
                                  <span>[AWS_PREVIEW_UPLINK]</span>
                                  <span className="text-cyan-500/70">STATUS: LIVE_S3_RESOLVED</span>
                                </div>
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-black">
                                  <img 
                                    src={section.image_url} 
                                    alt="AWS Architecture Preview" 
                                    className="w-full h-full object-cover grayscale opacity-50"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Content Logic</label>
                              <textarea
                                  value={section.content}
                                  onChange={(e) => {
                                    const newSections = [...sections];
                                    newSections[index].content = e.target.value;
                                    setSections(newSections);
                                  }}
                                  rows={4}
                                  className="w-full bg-transparent border-l-2 border-white/5 p-6 text-zinc-400 outline-none focus:border-cyan-500/30 font-sans text-sm rounded-r-xl"
                              />
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addSection}
                className="w-full py-12 border-2 border-dashed border-white/5 rounded-[2rem] text-zinc-600 hover:border-cyan-500/30 hover:text-cyan-500 transition-all flex flex-col items-center justify-center gap-4 group bg-white/[0.01]"
            >
              <div className="p-4 rounded-full bg-zinc-900 border border-white/5 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all">
                <Plus className="group-hover:rotate-90 transition-transform duration-300" size={24} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Initialize_New_Sector</span>
            </button>
          </div>
        </form>
      </div>
  );
}