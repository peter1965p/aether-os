import { createUser } from '@/modules/users/lib/actions';
import Link from 'next/link';

export default function NewUserPage() {
  return (
    <div className="max-w-2xl mx-auto pt-10">
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Initialize <span className="text-blue-500">Identity</span>
        </h1>
        <Link href="/admin/users" className="text-[10px] font-black text-[#444444] hover:text-white uppercase tracking-[0.3em] transition-colors">
          &larr; Terminal Back
        </Link>
      </div>

      <form action={createUser} className="bg-[#0a0a0a] border border-[#1a1a1a] p-12 rounded-[2.5rem] shadow-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#333333] ml-2">Codename</label>
          <input name="username" placeholder="e.g. operative_01" required className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-[#222222]" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#333333] ml-2">Access Email</label>
          <input name="email" type="email" required className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#333333] ml-2">Security Key (Password)</label>
          <input name="password" type="password" required className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all" />
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-400 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 uppercase text-sm tracking-widest">
            Authorize New User
          </button>
        </div>
      </form>
    </div>
  );
}