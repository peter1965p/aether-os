import {
  Truck,
  ChevronRight,
  FileText,
  MapPin,
  Fingerprint,
  LifeBuoy,
  ShieldCheck,
  User,
} from "lucide-react";

export default function CustomerDashboard() {
  // Später: const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ?').all(session.user.id);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Welcome back, <span className="text-orange-600">Client_0815</span>
        </h1>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
          System Node: Delivery Status // Active Transactions
        </p>
      </header>

      {/* Order Status Card */}
      <div className="bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest bg-orange-600/10 px-3 py-1 rounded-full">
              In Transit
            </span>
            <h3 className="text-xl font-black text-white mt-3 uppercase tracking-tight">
              Order #AE-99281
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-gray-500 uppercase">
              Estimated Arrival
            </p>
            <p className="text-lg font-black text-white italic">
              Tomorrow, 14:00
            </p>
          </div>
        </div>

        <div className="p-8 bg-[#151515]/50 flex items-center gap-8">
          <div className="flex-1 space-y-4">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]"></div>
            </div>
            <div className="flex justify-between text-[8px] font-black uppercase text-gray-600 tracking-widest">
              <span>Processed</span>
              <span className="text-orange-500 underline underline-offset-4 decoration-orange-500/30">
                Shipped
              </span>
              <span>Delivered</span>
            </div>
          </div>

          <button className="bg-white text-black px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all flex items-center gap-2 group">
            Track Package{" "}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* INVOICES */}
        <div className="p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] group hover:border-orange-600/30 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-10 transition-opacity">
            <FileText className="w-24 h-24 text-white" />
          </div>
          <FileText className="w-6 h-6 text-orange-600 mb-4" />
          <h4 className="text-white font-black uppercase tracking-widest text-[11px]">
            Invoices
          </h4>
          <p className="text-gray-500 text-[9px] mt-1 font-bold uppercase tracking-tighter">
            Billing History & PDF Export
          </p>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] group hover:border-orange-600/30 transition-all cursor-pointer relative overflow-hidden">
          <MapPin className="w-6 h-6 text-orange-600 mb-4" />
          <h4 className="text-white font-black uppercase tracking-widest text-[11px]">
            Delivery Nodes
          </h4>
          <p className="text-gray-500 text-[9px] mt-1 font-bold uppercase tracking-tighter">
            Manage Shipping Destinations
          </p>
        </div>

        {/* SECURITY / IDENTITY */}
        <div className="p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] group hover:border-orange-600/30 transition-all cursor-pointer relative overflow-hidden">
          <Fingerprint className="w-6 h-6 text-orange-600 mb-4" />
          <h4 className="text-white font-black uppercase tracking-widest text-[11px]">
            Security Key
          </h4>
          <p className="text-gray-500 text-[9px] mt-1 font-bold uppercase tracking-tighter">
            Identity & Password Config
          </p>
        </div>

        {/* SUPPORT TICKETS */}
        <div className="p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] group hover:border-orange-600/30 transition-all cursor-pointer relative overflow-hidden">
          <LifeBuoy className="w-6 h-6 text-orange-600 mb-4" />
          <h4 className="text-white font-black uppercase tracking-widest text-[11px]">
            Support Center
          </h4>
          <p className="text-gray-500 text-[9px] mt-1 font-bold uppercase tracking-tighter">
            Active Identity Tickets
          </p>
        </div>

        {/* DATA PRIVACY */}
        <div className="p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] group hover:border-orange-600/30 transition-all cursor-pointer relative overflow-hidden">
          <ShieldCheck className="w-6 h-6 text-orange-600 mb-4" />
          <h4 className="text-white font-black uppercase tracking-widest text-[11px]">
            Data Privacy
          </h4>
          <p className="text-gray-500 text-[9px] mt-1 font-bold uppercase tracking-tighter">
            Authorized Data Access
          </p>
        </div>

        {/* IDENTITY PROFILE */}
        <div className="p-8 bg-[#121212] border border-white/5 rounded-[2.5rem] group hover:border-orange-600/30 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-10 transition-opacity text-white">
            <User className="w-24 h-24" />
          </div>
          <User className="w-6 h-6 text-orange-600 mb-4" />
          <h4 className="text-white font-black uppercase tracking-widest text-[11px]">
            Identity Profile
          </h4>
          <p className="text-gray-500 text-[9px] mt-1 font-bold uppercase tracking-tighter">
            Personal Details & Preferences
          </p>
        </div>
      </div>
    </div>
  );
}
