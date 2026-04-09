"use client";

import { updateStaffRole } from "@/modules/inventory/actions";
import { useState } from "react";

export default function RoleSwitcher({
  userId,
  currentRole,
}: {
  userId: number;
  currentRole: string;
}) {
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newRole: any) => {
    setIsUpdating(true);
    setRole(newRole);
    await updateStaffRole(userId, newRole);
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col group/select w-full max-w-[180px]">
      <div className="relative flex items-center">
        {/* Der Custom Select Container */}
        <select
          defaultValue={role}
          disabled={isUpdating}
          onChange={(e) => handleChange(e.target.value)}
          className={`
            appearance-none w-full
            text-[10px] font-black italic tracking-[0.15em] uppercase
            px-5 py-3 rounded-xl border transition-all duration-300
            cursor-pointer outline-none bg-black/40
            ${isUpdating ? "opacity-50 cursor-wait" : "opacity-100"}
            ${
              role === "admin"
                ? "border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.05)] hover:border-red-500 hover:bg-red-500/5"
                : role === "operator"
                  ? "border-blue-500/30 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.05)] hover:border-blue-500 hover:bg-blue-500/5"
                  : "border-green-500/30 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.05)] hover:border-green-500 hover:bg-green-500/5"
            }
          `}
        >
          <option value="admin" className="bg-[#0c0c0c] text-red-500">
            ROOT_ADMIN
          </option>
          <option value="operator" className="bg-[#0c0c0c] text-blue-500">
            SYSTEM_OPERATOR
          </option>
          <option value="observer" className="bg-[#0c0c0c] text-green-500">
            NODE_OBSERVER
          </option>
        </select>

        {/* Custom Arrow Icon */}
        <div
          className={`absolute right-4 pointer-events-none transition-transform duration-300 group-hover/select:translate-y-0.5
          ${role === "admin" ? "text-red-500" : role === "operator" ? "text-blue-500" : "text-green-500"}`}
        >
          <svg
            width="8"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 px-1">
        <span className="text-[7px] text-white/20 font-black uppercase tracking-[0.2em]">
          Clearance_Level
        </span>
        {isUpdating && (
          <span className="text-[7px] text-blue-400 font-black animate-pulse uppercase tracking-widest">
            Syncing...
          </span>
        )}
      </div>
    </div>
  );
}
