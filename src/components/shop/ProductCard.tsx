// src/components/shop/ProductCard.tsx
export function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl flex flex-col h-full">
      {/* Glühender Hintergrund-Effekt bei Hover */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Bild-Container */}
      <div className="h-64 overflow-hidden relative">
        <img 
          src={product.bild_url || '/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full">
          <span className="text-blue-500 font-black text-xs uppercase tracking-widest">{product.preis} €</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 relative z-10">
        <div className="mb-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter italic group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-1">Kernel ID: {product.id}</p>
        </div>
        
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-8">
          {product.beschreibung}
        </p>

        <button className="mt-auto w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-blue-500/20">
          Add to System
        </button>
      </div>
    </div>
  );
}