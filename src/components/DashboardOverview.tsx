import React from "react";
import { 
  Users, 
  Wifi, 
  Network, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  ShieldAlert,
  Server,
  Radio,
  Zap,
  Activity,
  Sparkles
} from "lucide-react";
import { Customer, CustomerStatus, RouterNode, InternetPlan } from "../types";

interface DashboardOverviewProps {
  customers: Customer[];
  routers: RouterNode[];
  plans: InternetPlan[];
  onNavigate: (tab: string) => void;
  subPlan?: string;
  subExpiryDate?: string;
  onUpgradeClick?: () => void;
}

export default function DashboardOverview({
  customers,
  routers,
  plans,
  onNavigate,
  subPlan = "trial",
  subExpiryDate = "05 Jul 2026",
  onUpgradeClick
}: DashboardOverviewProps) {
  // Calculated stats
  const countTotal = customers.length;
  const countActive = customers.filter(c => c.status === CustomerStatus.AKTIF).length;
  const countIsolir = customers.filter(c => c.status === CustomerStatus.ISOLIR).length;
  const countOffline = customers.filter(c => c.status === CustomerStatus.NONAKTIF).length;

  const onlineRouters = routers.filter(r => r.status === "Online").length;
  const totalRouters = routers.length;

  // Total current active downstream bandwidth
  const totalLeases = routers.reduce((sum, r) => sum + r.activeUsers, 0);

  const systemAlerts = [
    { id: 1, type: "warning", message: "Node 'Mikrotik 02 - Cabang Selatan' terputus dari server API central.", time: "10 menit lalu" },
    { id: 2, type: "info", message: "Sebanyak 12 tagihan PPPoE jatuh tempo hari ini. WhatsApp reminder siap dikirim.", time: "1 jam lalu" },
    { id: 3, type: "danger", message: "Percobaan brute force SSH terdeteksi di Mikrotik 01 dari IP 185.220.101.5.", time: "2 jam lalu" }
  ];

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Trial Promo Banner */}
      {subPlan === "trial" && (
        <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0 border border-[#C5A059]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                Masa Uji Coba 7 Hari Aktif
                <span className="bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#C5A059]/20">Trial</span>
              </h4>
              <p className="text-[11px] text-white/60 mt-0.5">Masa aktif uji coba Anda berakhir pada <span className="text-[#C5A059] font-medium">{subExpiryDate}</span>. Upgrade ke Paket Bulanan/Tahunan untuk terus menikmati fitur premium!</p>
            </div>
          </div>
          <button 
            onClick={onUpgradeClick}
            className="text-black bg-[#C5A059] hover:bg-[#D4B069] text-xs font-extrabold py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] shadow-md shadow-[#C5A059]/10"
          >
            Upgrade Sekarang
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#121212] to-[#070707] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#C5A059]/2 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-2">
          <span className="bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Sistem Operasional Aktif
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            Selamat Datang di NetManager Control Center
          </h2>
          <p className="text-xs text-white/60 leading-relaxed max-w-md">
            Kelola infrastruktur jaringan WiFi, tagihan otomatis PPPoE/Hotspot, dan integrasi WhatsApp Gateway dalam satu dashboard terpadu.
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL CUSTOMERS */}
        <div 
          onClick={() => onNavigate("pelanggan")}
          className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-[#C5A059]/30 transition-all group shadow-md"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Total Pelanggan
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              {countTotal}
            </div>
            <span className="text-[10px] text-white/50 block">
              {countActive} aktif • {countIsolir} isolir
            </span>
          </div>
          <div className="w-10 h-10 bg-[#C5A059]/10 rounded-xl flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black transition-colors">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* ACTIVE LEASES / BANDWIDTH USERS */}
        <div 
          onClick={() => onNavigate("router")}
          className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-[#C5A059]/30 transition-all group shadow-md"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Total Active Leases
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              {totalLeases}
            </div>
            <span className="text-[10px] text-white/50 block">
              Pengguna hotspot & PPPoE aktif
            </span>
          </div>
          <div className="w-10 h-10 bg-[#C5A059]/10 rounded-xl flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black transition-colors">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* ROUTER NODES ON/OFF */}
        <div 
          onClick={() => onNavigate("router")}
          className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-[#C5A059]/30 transition-all group shadow-md"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Koneksi Router
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              {onlineRouters}/{totalRouters}
            </div>
            <span className="text-[10px] text-white/50 block">
              {onlineRouters} node online saat ini
            </span>
          </div>
          <div className="w-10 h-10 bg-[#C5A059]/10 rounded-xl flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black transition-colors">
            <Network className="w-5 h-5" />
          </div>
        </div>

        {/* OUTSTANDING ALERTS */}
        <div 
          onClick={() => alert("Peringatan Keamanan: Mikrotik 02 terputus dari jaringan. Silakan lakukan 'Test Ping' di halaman Router Management untuk diagnosa.")}
          className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-red-500/40 transition-all group shadow-md"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Log Gangguan
            </span>
            <div className="text-2xl font-bold text-rose-500 font-mono">
              {countIsolir} <span className="text-xs text-white/40 font-sans font-normal">isolir</span>
            </div>
            <span className="text-[10px] text-rose-400 block">
              Butuh penanganan isolir
            </span>
          </div>
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Grid: Router Overview & Security Log alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Router Quick Stats Overview */}
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-white/50 tracking-widest uppercase">
            Status Router Jaringan
          </h3>

          <div className="space-y-4">
            {routers.map((router) => (
              <div 
                key={router.id} 
                className="bg-[#050505] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#C5A059]/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    router.status === "Online" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{router.name}</span>
                    <span className="text-[10px] text-white/40 font-mono block mt-0.5">{router.ipAddress}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="font-mono">
                    <span className="text-[10px] text-white/30 block">Uptime</span>
                    <span className="text-white/80 font-bold">{router.uptime}</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-[10px] text-white/30 block">Active Users</span>
                    <span className="text-white/80 font-bold">{router.activeUsers}</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-[10px] text-white/30 block">CPU</span>
                    <span className="text-white/80 font-bold">{router.cpuLoad}%</span>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => onNavigate("router")}
                    className="text-xs text-[#C5A059] hover:text-[#D4B069] font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Kelola</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security and Warning Alerts Log column */}
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/50 tracking-widest uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
              <span>Log Gangguan & Security</span>
            </h3>

            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-xl border text-xs flex gap-2.5 ${
                    alert.type === 'danger' 
                      ? 'bg-rose-950/20 border-rose-900/10 text-rose-300' 
                      : alert.type === 'warning' 
                      ? 'bg-amber-950/20 border-amber-900/10 text-amber-300' 
                      : 'bg-[#C5A059]/5 border-[#C5A059]/10 text-[#E8D4A2]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="leading-relaxed">{alert.message}</p>
                    <span className="text-[10px] text-white/30 font-mono block">
                      {alert.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 flex justify-between items-center text-xs text-white/40">
            <span>Infrastruktur Terlindungi</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Uptime Jaringan: 99.98%</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
