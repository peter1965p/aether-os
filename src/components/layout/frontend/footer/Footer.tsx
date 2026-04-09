import React from 'react';
import { Package, Heart, Shield, Globe, Cpu } from 'lucide-react'; // Alle Icons sicher dabei!

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sticky w-full shadow-3xl bg-slate-800 border-t border-orange-400 py-12 px-6 lg:px-24 text-[#24292e]">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: System Status & Logo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1e5d9c] rounded-lg flex items-center justify-center text-white shadow-lg">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-orange-600 uppercase tracking-tighter text-xl">AETHER <span className="text-[#1e5d9c]">OS</span></h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Next-Gen of an Enterprise Infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-orange-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Kernel Online</span>
            </div>
            <div className="text-orange-600">|</div>
            <div className="flex items-center gap-2 text-white">
              <Globe size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">v4.0.6-stable</span>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-16 border-b border-gray-100">
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.3em] text-gray-400">Resources</h4>
            <ul className="space-y-4 text-sm font-semibold text-gray-600">
              <li><a href="#" className="hover:text-[#1e5d9c] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#1e5d9c] transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-[#1e5d9c] transition-colors">Community Modules</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.3em] text-gray-400">Company</h4>
            <ul className="space-y-4 text-sm font-semibold text-gray-600">
              <li><a href="#" className="hover:text-[#1e5d9c] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#1e5d9c] transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-[#1e5d9c] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.3em] text-gray-400">System Newsletter</h4>
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
              <input
                type="email"
                placeholder="news24regional@gmail.com"
                className="bg-transparent flex-1 px-4 py-2 text-sm outline-none font-medium"
              />
              <button className="bg-[#24292e] text-white px-6 py-2 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">Made with <Heart size={12} className="text-red-500 fill-red-500" /> in Germany</span>
            <span>© 1995 - {currentYear} Paeffgen IT </span>
          </div>
          <div className="flex items-center gap-6">
            <Shield size={16} className="text-gray-300" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">Privacy Policy</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">Legal Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
