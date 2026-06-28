import React, { useState } from "react";
import { Search, Bell, HelpCircle, Download, Plus, CheckCircle, User, Menu } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDownloadReport: () => void;
  onAddPackageClick: () => void;
  onAddRouterClick: () => void;
  userEmail: string;
  onMenuToggle?: () => void;
}

export default function Header({
  activeTab,
  searchQuery,
  onSearchChange,
  onDownloadReport,
  onAddPackageClick,
  onAddRouterClick,
  userEmail,
  onMenuToggle
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Tagihan CUST-10933 (Anita Wijaya) jatuh tempo hari ini", unread: true },
    { id: 2, text: "Mikrotik 02 terputus dari jaringan", unread: true },
    { id: 3, text: "Pembayaran baru dari Budi Santoso (INV-202310-001) sukses", unread: false }
  ]);

  const searchPlaceholders: Record<string, string> = {
    dashboard: "Cari transaksi, pelanggan...",
    pelanggan: "Cari pelanggan atau ID tagihan...",
    paket: "Cari paket internet...",
    transaksi: "Cari nomor invoice, deskripsi...",
    laporan: "Cari di laporan keuangan...",
    router: "Cari router, ip address...",
    pengaturan: "Cari parameter pengaturan...",
    help: "Cari bantuan atau FAQ..."
  };

  const placeholder = searchPlaceholders[activeTab] || "Cari sesuatu...";

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-20 bg-[#080808] border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-15 select-none shrink-0 font-sans">
      
      {/* Left side: Hamburger (on mobile) & Search (on desktop) */}
      <div className="flex items-center gap-3 flex-1 md:flex-initial">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Input on Desktop */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 rounded-xl text-sm text-white placeholder-white/30 transition-all outline-none"
            placeholder={placeholder}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-white/40 hover:text-white/70"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Mobile current page title indicator */}
        <div className="md:hidden truncate">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">
            NetManager ID
          </span>
          <h2 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider truncate leading-none mt-1">
            {activeTab === "pelanggan" ? "Pelanggan" : activeTab === "paket" ? "Paket" : activeTab === "transaksi" ? "Transaksi" : activeTab === "laporan" ? "Laporan" : activeTab === "router" ? "Router" : activeTab === "pengaturan" ? "Pengaturan" : activeTab === "help" ? "Bantuan" : "Dashboard"}
          </h2>
        </div>
      </div>

      {/* Action Buttons & Utilities */}
      <div className="flex items-center gap-2.5 sm:gap-5">
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all relative"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C5A059] rounded-full border-2 border-[#080808]" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0E0E0E] border border-white/10 rounded-2xl shadow-xl z-30 p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <span className="text-xs font-semibold text-white">Notifikasi</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] text-[#C5A059] hover:text-[#D4B069] transition-colors"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="text-xs flex items-start gap-2 p-2 rounded-lg hover:bg-white/5">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${n.unread ? 'bg-[#C5A059]' : 'bg-white/20'}`} />
                    <p className={`${n.unread ? 'text-white font-medium' : 'text-white/60'} text-[11px] leading-snug`}>
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Icon - hide on mobile */}
        <button 
          onClick={() => alert("NetManager ID Billing v2.4.1. Silakan buka menu Bantuan untuk manual lengkap.")}
          className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all hidden sm:block"
          title="Bantuan Cepat"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Vertical divider - hide on mobile */}
        <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

        {/* Report Download Button - hide text on small screens, only show icon or hide entirely on mobile */}
        <button
          onClick={onDownloadReport}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 font-semibold p-2 sm:py-2 sm:px-4 rounded-xl flex items-center gap-2 text-xs transition-all active:scale-[0.98]"
          title="Unduh Laporan"
        >
          <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white/40" />
          <span className="hidden md:inline">Unduh Laporan</span>
        </button>

        {/* Primary Tab-Specific Action Button - responsive: icon only on small screens */}
        {activeTab === "paket" ? (
          <button
            onClick={onAddPackageClick}
            className="bg-[#C5A059] hover:bg-[#D4B069] text-black font-bold p-2 sm:py-2 sm:px-4 rounded-xl flex items-center gap-1.5 text-xs shadow-md shadow-[#C5A059]/10 transition-all active:scale-[0.98]"
            title="Paket Baru"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Paket Baru</span>
          </button>
        ) : activeTab === "router" ? (
          <button
            onClick={onAddRouterClick}
            className="bg-[#C5A059] hover:bg-[#D4B069] text-black font-bold p-2 sm:py-2 sm:px-4 rounded-xl flex items-center gap-1.5 text-xs shadow-md shadow-[#C5A059]/10 transition-all active:scale-[0.98]"
            title="Tambah Router"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Tambah Router</span>
          </button>
        ) : (
          <button
            onClick={onAddPackageClick}
            className="bg-[#C5A059] hover:bg-[#D4B069] text-black font-bold p-2 sm:py-2 sm:px-4 rounded-xl flex items-center gap-1.5 text-xs shadow-md shadow-[#C5A059]/10 transition-all active:scale-[0.98]"
            title="Paket Baru"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Paket Baru</span>
          </button>
        )}

        {/* Profile Avatar */}
        <div 
          onClick={() => alert(`Masuk sebagai: ${userEmail}\nLevel Akses: Super Administrator\nSesi aktif berjalan terenkripsi.`)}
          className="flex items-center gap-2 cursor-pointer group"
          title="Info Akun"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-[#C5A059] transition-all">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
              alt="Admin Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
