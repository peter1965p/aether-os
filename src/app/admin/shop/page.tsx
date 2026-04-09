import { executeSql } from "@/modules/db/actions";

export default async function ShopAdminPage() {
  // Abfrage an die nun korrekte Tabelle 'products'
  const productsRes = await executeSql("SELECT * FROM products ORDER BY id ASC");
  
  if (!productsRes.success) {
    return (
      <div className="min-h-screen bg-black text-red-500 p-20 font-black uppercase tracking-tighter">
        KERNEL_ERROR // {productsRes.error}
      </div>
    );
  }

  const products = productsRes.data;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
          Inventory // <span className="text-[#ff4d00]">Products</span>
        </h1>
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
          AETHER OS // System Node: Shop_Management
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 hover:border-[#ff4d00]/30 transition-all group shadow-2xl relative overflow-hidden">
            {/* Status Indicator */}
            <div className="flex justify-between items-start mb-6">
              <span className="text-[9px] font-black text-[#ff4d00] uppercase tracking-widest bg-[#ff4d00]/10 px-3 py-1 rounded-full">
                ID::{product.id}
              </span>
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
            </div>

            <h2 className="text-2xl font-black uppercase italic mb-2 group-hover:text-[#ff4d00] transition-colors leading-tight">
              {product.name}
            </h2>
            
            <p className="text-gray-500 text-xs leading-relaxed mb-8 h-12 overflow-hidden italic">
              {product.description || "No tactical briefing available for this unit."}
            </p>

            <div className="flex items-end justify-between pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Credits</p>
                <p className="text-2xl font-black text-white italic">
                  {Number(product.price).toLocaleString('de-DE')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Stock</p>
                <p className={`text-xl font-black ${product.stock > 0 ? 'text-white' : 'text-red-500/50'}`}>
                  {product.stock}
                </p>
              </div>
            </div>

            {/* Subtile Grid-Deko für den AETHER-Look */}
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
              <div className="w-12 h-12 border-t border-r border-white" />
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-gray-700 font-black uppercase tracking-[0.8em] text-sm">
            Inventory Empty // No assets detected
          </p>
        </div>
      )}
    </div>
  );
}