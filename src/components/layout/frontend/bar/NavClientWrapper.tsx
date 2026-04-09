"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function NavClientWrapper({
  links,
}: {
  links: { name: string; href: string }[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              text-[11px] font-black uppercase tracking-widest transition-all duration-300 px-4 py-2 rounded-lg
              ${
                isActive
                  ? "bg-accent text-black shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] scale-105"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {link.name}
          </Link>
        );
      })}

      {pathname.startsWith("/admin") && (
        <button
          onClick={() => router.push("/login")}
          className="ml-4 flex items-center gap-2 text-[10px] font-black uppercase text-red-500 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
        >
          <LogIn size={14} /> Logout
        </button>
      )}
    </>
  );
}
