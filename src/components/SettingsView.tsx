import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Settings, 
  Database, 
  MessageSquare, 
  ShieldCheck, 
  Network, 
  Save, 
  RefreshCw, 
  Sliders, 
  HelpCircle,
  Clock,
  Wifi,
  Globe,
  Radio,
  Cpu,
  Zap,
  Palette
} from "lucide-react";

interface SettingsViewProps {
  ispName: string;
  setIspName: (v: string) => void;
  ispTagline: string;
  setIspTagline: (v: string) => void;
  ispLogoIcon: string;
  setIspLogoIcon: (v: string) => void;
  ispColor: string;
  setIspColor: (v: string) => void;
}

export default function SettingsView({
  ispName,
  setIspName,
  ispTagline,
  setIspTagline,
  ispLogoIcon,
  setIspLogoIcon,
  ispColor,
  setIspColor
}: SettingsViewProps) {
  const [mikrotikHost, setMikrotikHost] = useState("192.168.1.1");
  const [mikrotikUser, setMikrotikUser] = useState("admin_billing");
  const [mikrotikPass, setMikrotikPass] = useState("••••••••••••");
  const [mikrotikPort, setMikrotikPort] = useState("8728"); // Default api port
  
  const [waEndpoint, setWaEndpoint] = useState("https://api.wasender.id/v1/send");
  const [waToken, setWaToken] = useState("tok_netmanager_45f891bca7");
  const [waTemplate, setWaTemplate] = useState("Yth Bpk/Ibu {nama}, tagihan internet {paket} sebesar Rp {harga} jatuh tempo pada {due_date}. Silakan lakukan pelunasan untuk menghindari pemutusan otomatis.");

  const [autoIsolate, setAutoIsolate] = useState(true);
  const [gracePeriod, setGracePeriod] = useState("3"); // days

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Seluruh konfigurasi sistem berhasil disimpan dan diterapkan pada router aktif!");
    }, 1000);
  };

  const handleTriggerBackup = () => {
    alert(`Backup basis data ${ispName} berhasil dibuat!\nFile cadangan disimpan: 'backup-20231028-120000.sql'`);
  };

  // Preset colors for quick brand styling
  const colorPresets = [
    { name: "Gold Classic", hex: "#C5A059" },
    { name: "Emerald Green", hex: "#10B981" },
    { name: "Neon Blue", hex: "#0EA5E9" },
    { name: "Royal Purple", hex: "#6366F1" },
    { name: "Hot Crimson", hex: "#F43F5E" },
    { name: "Vibrant Orange", hex: "#F97316" }
  ];

  // Preset Lucide Icons for dynamic selection
  const logoIcons = [
    { name: "Wifi", label: "Wireless" },
    { name: "Globe", label: "Broadband" },
    { name: "Radio", label: "Antenna" },
    { name: "Network", label: "Local Net" },
    { name: "Cpu", label: "Server Node" },
    { name: "Zap", label: "High Speed" }
  ];

  const CurrentLogoIcon = (LucideIcons as any)[ispLogoIcon] || Wifi;

  return (
    <form onSubmit={handleSave} className="space-y-6 text-slate-100 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Pengaturan Sistem</h1>
          <p className="text-sm text-slate-400 mt-1">
            Konfigurasi sambungan API Mikrotik, WhatsApp Gateway, dan kebijakan kustomisasi brand ISP Anda.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{ backgroundColor: ispColor }}
          className="hover:brightness-110 text-black font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin text-black" />
          ) : (
            <Save className="w-4 h-4 text-black" />
          )}
          <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
        </button>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: ISP BRAND CUSTOMIZATION */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Palette style={{ color: ispColor }} className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
              Kustomisasi Brand & Logo ISP
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Live Preview Box */}
            <div className="p-4 bg-[#090E17] border border-white/5 rounded-xl flex items-center gap-4">
              <div 
                style={{ backgroundColor: ispColor }} 
                className="w-12 h-12 rounded-xl rotate-45 flex items-center justify-center text-black shadow-lg"
              >
                <CurrentLogoIcon className="-rotate-45 w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider mb-0.5">Live Brand Preview</span>
                <h4 className="text-base font-bold text-white uppercase leading-none">
                  {ispName || "NAMA ISP"}<span style={{ color: ispColor }}>.</span>
                </h4>
                <p className="text-[10px] text-white/40 font-semibold mt-1 max-w-[220px] truncate uppercase">
                  {ispTagline || "WiFi Billing Solutions"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Nama Brand ISP</label>
                <input
                  type="text"
                  required
                  value={ispName}
                  onChange={(e) => setIspName(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-white font-bold uppercase"
                  placeholder="NETMANAGER"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Slogan / Tagline</label>
                <input
                  type="text"
                  required
                  value={ispTagline}
                  onChange={(e) => setIspTagline(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300"
                  placeholder="WiFi Billing Solutions"
                />
              </div>
            </div>

            {/* Custom Logo Icon Select */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Pilih Icon Logo</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {logoIcons.map((ico) => {
                  const IconComp = (LucideIcons as any)[ico.name] || Wifi;
                  const isSelected = ispLogoIcon === ico.name;
                  return (
                    <button
                      key={ico.name}
                      type="button"
                      onClick={() => setIspLogoIcon(ico.name)}
                      style={isSelected ? { borderColor: ispColor, color: ispColor } : {}}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-white/5 text-white" 
                          : "border-slate-800 bg-[#0C1222] text-slate-400 hover:text-white"
                      }`}
                    >
                      <IconComp className="w-5 h-5 stroke-[2]" />
                      <span className="text-[8px] font-semibold text-center leading-none">{ico.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Preset Selector */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Warna Aksen Brand</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {colorPresets.map((preset) => {
                  const isSelected = ispColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setIspColor(preset.hex)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-white/5 border-slate-400 text-white font-bold" 
                          : "border-slate-800 bg-[#0C1222] text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                      <span className="text-[9px] truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Direct Hex Code Input */}
              <div className="flex items-center gap-2 mt-3 p-2 bg-[#090E17] border border-white/5 rounded-xl max-w-xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Custom Hex Color:</span>
                <input 
                  type="text"
                  value={ispColor}
                  onChange={(e) => setIspColor(e.target.value)}
                  className="bg-transparent text-[#C5A059] font-mono font-bold text-center w-24 outline-none border-b border-slate-800 focus:border-[#C5A059]"
                  placeholder="#C5A059"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* SECTION 2: MIKROTIK API CONFIG */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Network style={{ color: ispColor }} className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
              Koneksi API Mikrotik (Default)
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Host IP Router</label>
                <input
                  type="text"
                  required
                  value={mikrotikHost}
                  onChange={(e) => setMikrotikHost(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase">API Port</label>
                <input
                  type="text"
                  required
                  value={mikrotikPort}
                  onChange={(e) => setMikrotikPort(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase">API Username</label>
                <input
                  type="text"
                  required
                  value={mikrotikUser}
                  onChange={(e) => setMikrotikUser(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase">API Password</label>
                <input
                  type="password"
                  required
                  value={mikrotikPass}
                  onChange={(e) => setMikrotikPass(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal">
              *{ispName} menggunakan SSL API Port 8729 secara default. Pastikan IP address server {ispName} telah masuk whitelist di IP - Services - API-SSL di Winbox Anda.
            </p>
          </div>
        </div>

        {/* SECTION 3: WHATSAPP GATEWAY CONFIG */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <MessageSquare className="w-5 h-5 text-[#25D366]" />
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
              WhatsApp Gateway Integrasi
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Endpoint URL</label>
              <input
                type="text"
                required
                value={waEndpoint}
                onChange={(e) => setWaEndpoint(e.target.value)}
                className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase">API Token Authorization</label>
              <input
                type="password"
                required
                value={waToken}
                onChange={(e) => setWaToken(e.target.value)}
                className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-400 font-semibold uppercase">Template Pesan Tagihan</label>
                <span className="text-[10px] text-slate-500 font-mono">Tags: &#123;nama&#125;, &#123;paket&#125;, &#123;harga&#125;, &#123;due_date&#125;</span>
              </div>
              <textarea
                rows={3}
                required
                value={waTemplate}
                onChange={(e) => setWaTemplate(e.target.value)}
                className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl outline-none text-slate-300 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: AUTOMATION RULES */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Sliders style={{ color: ispColor }} className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
              Kebijakan Isolir & Jatuh Tempo
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-300 block">Isolir Otomatis (Auto Block)</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Matikan koneksi PPPoE/Hotspot otomatis saat melewati jatuh tempo</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoIsolate}
                  onChange={(e) => setAutoIsolate(e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  style={{ '--peer-checked-bg': ispColor } as React.CSSProperties}
                  className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--peer-checked-bg,#C5A059)]" 
                />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-300 block">Masa Toleransi Pelunasan</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Jumlah hari toleransi setelah jatuh tempo sebelum isolir aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  className="w-14 text-center bg-[#0C1222] border border-slate-800 p-1.5 rounded-lg outline-none text-slate-300 font-mono font-bold"
                />
                <span className="text-slate-400 font-semibold text-[11px]">Hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: SYSTEM DATABASE BACKUP */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl lg:col-span-2">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Database style={{ color: ispColor }} className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
              Backup & Database Utility
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="flex items-center justify-between p-4 bg-[#090E17] border border-white/5 rounded-xl">
              <div>
                <span className="font-bold text-slate-300 block">Cadangkan Basis Data (Local Backup)</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Backup semua konfigurasi, database transaksi, dan data pelanggan</span>
              </div>
              <button
                type="button"
                onClick={handleTriggerBackup}
                style={{ borderColor: `${ispColor}40`, color: ispColor }}
                className="hover:bg-white/5 bg-transparent border font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Backup Database
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#090E17] border border-white/5 rounded-xl">
              <div>
                <span className="font-bold text-slate-300 block">Sinkronisasi Menyeluruh (Global Sync)</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Paksa pemutakhiran queue, pppoe secret, dan hotspot user di seluruh node router</span>
              </div>
              <button
                type="button"
                onClick={() => alert(`Mengirim perintah Sync global... Seluruh node router ${ispName} berhasil dimutakhirkan!`)}
                className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Sync All Nodes
              </button>
            </div>
          </div>
        </div>

      </div>

    </form>
  );
}
