import { registerCustomer } from '@/modules/auth/customer-actions';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-[#0a0a0a] border border-[#1a1a1a] p-16 rounded-[3rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
            Create <span className="text-[#2600FF]">Account</span>
          </h1>
          <p className="text-[#444444] text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            Join the Aether Network
          </p>
        </div>

        <form action={registerCustomer} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-[#333333] ml-4">Full Identity Name</label>
            <input name="name" required className="w-full bg-transparent border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white focus:border-[#ff4d00] outline-none transition-all" placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-[#333333] ml-4">Email Address</label>
            <input name="email" type="email" required className="w-full bg-transparent border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white focus:border-[#ff4d00] outline-none transition-all" placeholder="name@domain.com" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-[#333333] ml-4">Security Password</label>
            <input name="password" type="password" required className="w-full bg-transparent border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white focus:border-[#ff4d00] outline-none transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-blue text-white font-black py-5 rounded-2xl hover:bg-[#ff4d00] hover:text-white transition-all uppercase text-xs tracking-widest mt-4">
            Initialize Membership
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[10px] font-bold text-[#444444] hover:text-white uppercase tracking-widest transition-colors">
            Already have an identity? Login here
          </Link>
        </div>
      </div>
    </div>
  );
}