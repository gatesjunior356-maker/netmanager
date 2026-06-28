import React from "react";
import * as LucideIcons from "lucide-react";
import { 
  LayoutDashboard, 
  Users, 
  Wifi, 
  FileText, 
  BarChart3, 
  Network, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus,
  X,
  Radio,
  CreditCard
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddCustomerClick: () => void;
  onLogout: () => void;
  ispName: string;
  ispTagline: string;
  ispLogoIcon: string;
  ispColor: string;
  isOpen?: boolean;
  onClose?: () => void;
  subPlan?: string;
  subExpiryDate?: string;
  onUpgradeClick?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  onAddCustomerClick, 
  onLogout,
  ispName,
  ispTagline,
  ispLogoIcon,
  ispColor,
  isOpen,
  onClose,
  subPlan = "trial",
  subExpiryDate = "05 Jul 2026",
  onUpgradeClick
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pelanggan", label: "Pelanggan", icon: Users },
    { id: "paket", label: "Paket Layanan", icon: Wifi },
    { id: "olt", label: "Monitoring OLT", icon: Radio },
    { id: "gateway", label: "Payment Gateway", icon: CreditCard },
    { id: "transaksi", label: "Transaksi", icon: FileText },
    { id: "laporan", label: "Laporan", icon: BarChart3 },
    { id: "router", label: "Router Management", icon: Network },
    { id: "pengaturan", label: "Pengaturan", icon: Settings },
  ];

  // Dynamic Lucide icon lookup for customizable logo
  const LogoIcon = (LucideIcons as any)[ispLogoIcon] || Wifi;

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/70 z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 lg:sticky lg:top-0 w-72 bg-[#080808] border-r border-white/5 flex flex-col justify-between h-screen shrink-0 z-40 lg:z-20 font-sans transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header Logo */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                style={{ backgroundColor: ispColor }}
                className="w-9 h-9 rounded-lg rotate-45 flex items-center justify-center text-black shadow-lg shadow-black/40 transition-all duration-300"
              >
                <LogoIcon className="-rotate-45 w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="ml-1">
                <h2 className="text-lg font-bold text-white tracking-tight leading-none uppercase max-w-[140px] truncate">
                  {ispName}<span style={{ color: ispColor }}>.</span>
                </h2>
                <span className="text-[9px] uppercase tracking-[0.15em] text-white/40 mt-1 block font-bold max-w-[140px] truncate">
                  {ispTagline}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            {onClose && (
              <button 
                onClick={onClose}
                className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Action Button */}
          <div className="p-4">
            <button
              onClick={() => {
                onAddCustomerClick();
                if (onClose) onClose();
              }}
              style={{ backgroundColor: ispColor }}
              className="w-full text-black font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer hover:brightness-110"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="text-sm">Tambah Pelanggan</span>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="px-3 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              const activeStyle = "bg-white/5 font-bold border-l-4";

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onClose) onClose();
                  }}
                  style={isActive ? { color: ispColor, borderLeftColor: ispColor } : {}}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm transition-all text-left cursor-pointer ${
                    isActive 
                      ? activeStyle 
                      : "text-white/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                  }`}
                >
                  <Icon 
                    style={isActive ? { color: ispColor } : {}}
                    className={`w-[18px] h-[18px] ${isActive ? "" : "text-white/40"}`} 
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Subscription Status Pill/Box */}
          <div className="px-4 py-3 mx-4 mt-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-between">
              <span className="text-[10px] text-white/40 uppercase font-semibold tracking-wider">Status Akun</span>
              <span 
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                  subPlan === "trial" 
                    ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20" 
                    : subPlan === "bulanan"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}
              >
                {subPlan === "trial" ? "Trial 7 Hari" : subPlan === "bulanan" ? "Bulanan" : "Tahunan"}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white truncate">
                {subPlan === "trial" ? "Uji Coba Gratis" : "Sistem Berlangganan"}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">
                Masa aktif s/d <span className="text-white/60 font-medium">{subExpiryDate}</span>
              </div>
            </div>
            
            <button
              onClick={onUpgradeClick}
              style={{ color: ispColor, borderColor: `${ispColor}30` }}
              className="w-full mt-1 bg-white/5 border text-center font-bold text-[10px] uppercase py-2 px-3 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              {subPlan === "trial" ? "Upgrade Sekarang" : "Perpanjang / Kelola"}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => {
              onTabChange("help");
              if (onClose) onClose();
            }}
            style={activeTab === "help" ? { color: ispColor, borderLeftColor: ispColor } : {}}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white text-left transition-all cursor-pointer ${
              activeTab === "help" ? "bg-white/5 font-semibold border-l-4" : "border-l-4 border-transparent"
            }`}
          >
            <HelpCircle 
              style={activeTab === "help" ? { color: ispColor } : {}}
              className={`w-[18px] h-[18px] ${activeTab === "help" ? "" : "text-white/40"}`} 
            />
            <span>Bantuan</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 text-left transition-all border-l-4 border-transparent cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px] text-rose-400/60" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
