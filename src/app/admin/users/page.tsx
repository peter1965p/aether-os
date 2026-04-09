import db from "@/lib/db";
import RoleSwitcher from "@/components/admin/RoleSwitcher";

export default async function UsersAdminPage() {
  /**
   * AETHER CLOUD FETCH
   * Wir holen die Identitäten aus der Supabase-Cloud.
   * 'status' ist vorerst auskommentiert, falls die Spalte in deiner DB noch fehlt.
   */
  const { data: users, error } = await db
    .from("users")
    .select("id, username, email, role") 
    .order("username", { ascending: true });

  const displayUsers = users || [];

  if (error) {
    console.error("AETHER_IDENTITY_ERROR:", error.message);
  }

  return (
    <div className="space-y-16 p-2">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
              Aether // Identity Provider
            </span>
          </div>
          <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none text-white">
            Access <span className="text-[#1a1a1a]">Control</span>
          </h1>
          <p className="text-[#444444] text-[10px] font-bold uppercase tracking-[0.3em] border-l-2 border-blue-500 pl-4">
            Managing System Identities // Registry: {displayUsers.length} entities
            detected
          </p>
        </div>

        <button className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] hover:bg-blue-400 hover:scale-105 transition-all uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.2)] active:scale-95">
          Create Identity +
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-[#070707] border border-white/[0.03] rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0c0c0c] border-b border-white/[0.05]">
              <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                Primary Identity
              </th>
              <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                Security Clearance
              </th>
              <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-center">
                Status
              </th>
              <th className="px-12 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-right">
                Operations
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {displayUsers.map((user: any) => (
              <tr
                key={user.id}
                className="group hover:bg-blue-600/[0.03] transition-all duration-500"
              >
                <td className="px-12 py-10">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center text-blue-500 font-black italic text-xl group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-blue-400 transition-colors">
                        {user.username}
                      </div>
                      <div className="text-[10px] text-[#333] font-black uppercase tracking-widest mt-1">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-12 py-10">
                  {/* Der Switcher nutzt die neue Action 'updateStaffRole' */}
                  <RoleSwitcher userId={user.id} currentRole={user.role} />
                </td>

                <td className="px-12 py-10">
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3 bg-[#0a0a0a] w-fit px-4 py-2 rounded-full border border-white/[0.03]">
                      <div className="w-2 h-2 rounded-full bg-[#00FF15] shadow-[0_0_12px_#00FF15] animate-pulse" />
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">
                        Active
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-12 py-10 text-right">
                  <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all duration-300">
                    <button className="px-5 py-2.5 bg-[#111] hover:bg-blue-600 text-blue-500 hover:text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                      Permissions
                    </button>
                    <button className="px-5 py-2.5 bg-[#111] hover:bg-red-600 text-[#333] hover:text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}