import React, { useState, useEffect } from "react";
import { 
  Network, 
  Cpu, 
  Users, 
  Clock, 
  Activity, 
  RefreshCw, 
  Play, 
  Edit2, 
  Plus, 
  X, 
  Trash2, 
  Check, 
  AlertCircle,
  Terminal
} from "lucide-react";
import { RouterNode } from "../types";

interface RoutersViewProps {
  routers: RouterNode[];
  onAddRouter: (r: RouterNode) => void;
  onUpdateRouter: (r: RouterNode) => void;
  onDeleteRouter: (id: string) => void;
  searchQuery: string;
  showAddForm: boolean;
  onCloseAddForm: () => void;
}

export default function RoutersView({
  routers,
  onAddRouter,
  onUpdateRouter,
  onDeleteRouter,
  searchQuery,
  showAddForm,
  onCloseAddForm
}: RoutersViewProps) {
  const [localRouters, setLocalRouters] = useState<RouterNode[]>(routers);
  const [showPingLog, setShowPingLog] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<string[]>([]);
  const [isPinging, setIsPinging] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // New Router form
  const [rtName, setRtName] = useState("");
  const [rtIp, setRtIp] = useState("");
  const [rtStatus, setRtStatus] = useState<"Online" | "Offline">("Online");

  // Keep state synced with props but allow local dynamic updates for real-time simulation
  useEffect(() => {
    setLocalRouters(routers);
  }, [routers]);

  // Simulate real-time bandwidth and CPU fluctuations for ONLINE routers!
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalRouters((prev) => 
        prev.map((router) => {
          if (router.status === "Offline") return router;

          // CPU fluctuation (-3% to +3%)
          const cpuDelta = Math.floor(Math.random() * 7) - 3;
          const newCpu = Math.max(10, Math.min(85, router.cpuLoad + cpuDelta));

          // Bandwidth fluctuation
          const downDelta = Math.floor(Math.random() * 5) - 2;
          const upDelta = Math.floor(Math.random() * 3) - 1;
          const newDown = Math.max(25, Math.min(80, router.downloadSpeed + downDelta));
          const newUp = Math.max(5, Math.min(25, router.uploadSpeed + upDelta));

          // Update histories (keep last 14 entries)
          const newDownHistory = [...router.history.download.slice(1), newDown];
          const newUpHistory = [...router.history.upload.slice(1), newUp];

          return {
            ...router,
            cpuLoad: newCpu,
            downloadSpeed: newDown,
            uploadSpeed: newUp,
            history: {
              download: newDownHistory,
              upload: newUpHistory
            }
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleCreateRouter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtName || !rtIp) return;

    const newRt: RouterNode = {
      id: `rt-0${localRouters.length + 1}`,
      name: rtName,
      ipAddress: rtIp,
      status: rtStatus,
      uptime: rtStatus === "Online" ? "1d 4h 12m" : "-",
      activeUsers: rtStatus === "Online" ? Math.floor(Math.random() * 120) + 40 : 0,
      cpuLoad: rtStatus === "Online" ? 18 : 0,
      maxCpu: 100,
      downloadSpeed: rtStatus === "Online" ? 35 : 0,
      uploadSpeed: rtStatus === "Online" ? 8 : 0,
      history: {
        download: rtStatus === "Online" ? [10, 15, 20, 18, 25, 30, 28, 35, 32, 34, 30, 31, 29, 35] : Array(14).fill(0),
        upload: rtStatus === "Online" ? [2, 4, 5, 6, 8, 9, 7, 8, 7, 8, 8, 9, 8, 8] : Array(14).fill(0)
      }
    };

    onAddRouter(newRt);
    setRtName("");
    setRtIp("");
    onCloseAddForm();
  };

  const handleTestPing = (router: RouterNode) => {
    setShowPingLog(router.name);
    setPingResults([]);
    setIsPinging(true);

    if (router.status === "Offline") {
      setTimeout(() => {
        setPingResults([
          `PING ${router.ipAddress} (${router.ipAddress}) 56(84) bytes of data.`,
          `From ${router.ipAddress} icmp_seq=1 Destination Host Unreachable`,
          `From ${router.ipAddress} icmp_seq=2 Destination Host Unreachable`,
          `--- ${router.ipAddress} ping statistics ---`,
          `2 packets transmitted, 0 received, +2 errors, 100% packet loss`
        ]);
        setIsPinging(false);
      }, 1000);
      return;
    }

    // Interactive successful ping trace
    let count = 1;
    const interval = setInterval(() => {
      if (count === 1) {
        setPingResults(prev => [...prev, `PING ${router.ipAddress} (${router.ipAddress}) 56(84) bytes of data.`]);
      }
      
      const timeMs = (Math.random() * 8 + 6).toFixed(1);
      setPingResults(prev => [
        ...prev, 
        `64 bytes from ${router.ipAddress}: icmp_seq=${count} ttl=64 time=${timeMs} ms`
      ]);

      count++;
      if (count > 4) {
        clearInterval(interval);
        setTimeout(() => {
          setPingResults(prev => [
            ...prev,
            `--- ${router.ipAddress} ping statistics ---`,
            `4 packets transmitted, 4 received, 0% packet loss, time 3004ms`,
            `rtt min/avg/max/mdev = 6.2/8.4/14.1/1.4 ms`
          ]);
          setIsPinging(false);
        }, 300);
      }
    }, 400);
  };

  const handleSyncRouter = (routerId: string) => {
    setSyncingId(routerId);
    // Simulate real synchronization delay
    setTimeout(() => {
      setSyncingId(null);
      alert(`Mikrotik Router lease secrets and queue speeds successfully synchronized!\nDatabase clients are fully aligned with the central router state.`);
    }, 1500);
  };

  const handleToggleOnlineStatus = (routerId: string) => {
    const updated = localRouters.map(r => {
      if (r.id !== routerId) return r;
      const willBeOnline = r.status === "Offline";
      return {
        ...r,
        status: willBeOnline ? "Online" as const : "Offline" as const,
        uptime: willBeOnline ? "1m" : "-",
        activeUsers: willBeOnline ? 142 : 0,
        cpuLoad: willBeOnline ? 15 : 0,
        downloadSpeed: willBeOnline ? 30 : 0,
        uploadSpeed: willBeOnline ? 7 : 0,
        history: {
          download: willBeOnline ? [10, 15, 22, 25, 20, 24, 28, 30, 27, 29, 30, 28, 31, 30] : Array(14).fill(0),
          upload: willBeOnline ? [2, 3, 5, 6, 4, 5, 6, 7, 6, 7, 7, 6, 8, 7] : Array(14).fill(0)
        }
      };
    });
    setLocalRouters(updated);
    
    // Notify parent
    const target = updated.find(r => r.id === routerId);
    if (target) {
      onUpdateRouter(target);
    }
  };

  // Filter router list by top level query
  const filteredRouters = localRouters.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Router</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pantau dan kelola node Mikrotik yang terhubung melalui API Winbox/REST.
          </p>
        </div>

        <button
          onClick={onCloseAddForm}
          className="bg-[#004CED] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-md shadow-blue-600/10 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Router</span>
        </button>
      </div>

      {/* QUICK ROUTER ADD FORM OVERLAY */}
      {showAddForm && (
        <div className="bg-[#111A2E] border border-blue-500/20 rounded-2xl p-6 shadow-xl max-w-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Network className="text-blue-500 w-4 h-4" />
              <span>Daftarkan Router Mikrotik Baru</span>
            </span>
            <button onClick={onCloseAddForm} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateRouter} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">Nama Node Router</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mikrotik 03 - Cabang Utara"
                  value={rtName}
                  onChange={(e) => setRtName(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">IP Address / Host API</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 192.168.10.1"
                  value={rtIp}
                  onChange={(e) => setRtIp(e.target.value)}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">Status Awal</label>
                <select
                  value={rtStatus}
                  onChange={(e) => setRtStatus(e.target.value as "Online" | "Offline")}
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 outline-none"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onCloseAddForm}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Hubungkan Router
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Router Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {filteredRouters.map((r) => {
          const isOnline = r.status === "Online";
          
          // Generate customized SVG polyline path coordinates for the graph
          const generateSvgPath = (data: number[], scaleMax = 100) => {
            if (data.length === 0) return "0,80";
            const width = 340;
            const height = 80;
            const step = width / (data.length - 1);
            return data.map((val, idx) => {
              const x = idx * step;
              const y = height - (val / scaleMax) * height;
              return `${x},${y}`;
            }).join(" ");
          };

          const downloadPath = generateSvgPath(r.history.download, 100);
          const uploadPath = generateSvgPath(r.history.upload, 100);

          return (
            <div 
              key={r.id} 
              className={`bg-[#111A2E] border rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between ${
                isOnline ? "border-slate-800/80" : "border-rose-950/40"
              }`}
            >
              {/* Card Header */}
              <div className="p-6 pb-4 border-b border-slate-800/80 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{r.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{r.ipAddress}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status chip */}
                  <button 
                    onClick={() => handleToggleOnlineStatus(r.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 transition-all ${
                      isOnline 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" 
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/10 hover:bg-rose-500/20"
                    }`}
                    title="Klik untuk mensimulasikan toggle koneksi"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {isOnline ? "Online" : "Offline"}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus konfigurasi koneksi router ${r.name}?`)) {
                        onDeleteRouter(r.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
                    title="Hapus Router"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="p-6 grid grid-cols-3 gap-4 border-b border-slate-800/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Uptime
                  </span>
                  <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {r.uptime}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Active Users
                  </span>
                  <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {r.activeUsers} <span className="text-[10px] font-normal text-slate-500">leases</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    CPU Load
                  </span>
                  <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    {r.cpuLoad}%
                  </div>
                </div>

                {/* CPU Progress Bar */}
                <div className="col-span-3 pt-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${
                        r.cpuLoad > 60 ? "bg-red-500" : r.cpuLoad > 40 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${r.cpuLoad}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bandwidth Dynamic Wave Chart */}
              <div className="p-6 pb-4 border-b border-slate-800/50 flex-1">
                <div className="flex justify-between items-center mb-4 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Real-time Bandwidth
                  </span>
                  <div className="flex gap-4">
                    <span className="text-emerald-400 font-mono font-semibold">
                      ↓ {r.downloadSpeed} Mbps
                    </span>
                    <span className="text-blue-400 font-mono font-semibold">
                      ↑ {r.uploadSpeed} Mbps
                    </span>
                  </div>
                </div>

                {/* SVG Area Chart */}
                <div className="h-24 w-full relative">
                  {isOnline ? (
                    <svg className="w-full h-full" viewBox="0 0 340 80" preserveAspectRatio="none">
                      <defs>
                        {/* Gradients */}
                        <linearGradient id="grad-down" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="grad-up" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Download Wave Grid helpers */}
                      <line x1="0" y1="20" x2="340" y2="20" stroke="#1E293B" strokeDasharray="3,3" />
                      <line x1="0" y1="40" x2="340" y2="40" stroke="#1E293B" strokeDasharray="3,3" />
                      <line x1="0" y1="60" x2="340" y2="60" stroke="#1E293B" strokeDasharray="3,3" />

                      {/* Download Area */}
                      <path
                        d={`M 0,80 L ${downloadPath} L 340,80 Z`}
                        fill="url(#grad-down)"
                      />
                      {/* Download Polyline Stroke */}
                      <path
                        d={`M ${downloadPath}`}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-1000"
                      />

                      {/* Upload Area */}
                      <path
                        d={`M 0,80 L ${uploadPath} L 340,80 Z`}
                        fill="url(#grad-up)"
                      />
                      {/* Upload Polyline Stroke */}
                      <path
                        d={`M ${uploadPath}`}
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <AlertCircle className="w-5 h-5 mb-1 text-slate-700" />
                      <span className="text-[10px] tracking-wider uppercase font-bold text-slate-600">
                        Koneksi Offline
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-[#0D1526]/80 flex gap-2 items-center">
                <button
                  onClick={() => handleTestPing(r)}
                  className="flex-1 bg-[#121B2D] border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-500" />
                  <span>Test Ping</span>
                </button>

                <button
                  onClick={() => handleSyncRouter(r.id)}
                  disabled={!isOnline || syncingId !== null}
                  className="flex-1 bg-[#121B2D] border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-45 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${syncingId === r.id ? 'animate-spin text-blue-400' : ''}`} />
                  <span>{syncingId === r.id ? "Syncing..." : "Sync Database"}</span>
                </button>

                <button
                  onClick={() => {
                    const newName = prompt(`Ubah nama router untuk ${r.name}:`, r.name);
                    if (newName) {
                      onUpdateRouter({ ...r, name: newName });
                    }
                  }}
                  className="p-2 bg-[#121B2D] border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                  title="Edit Nama Router"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}

      </div>

      {/* TERMINAL PING LOG OVERLAY */}
      {showPingLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#050B14] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl font-mono">
            
            {/* Terminal Title Bar */}
            <div className="bg-[#121B2D] px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Terminal className="text-blue-500 w-4 h-4" />
                <span>Router Diagnostic Utility — {showPingLog}</span>
              </span>
              <button 
                onClick={() => setShowPingLog(null)} 
                disabled={isPinging}
                className="text-slate-400 hover:text-white p-1 disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-6 space-y-2 text-xs text-emerald-400 min-h-[220px] max-h-[350px] overflow-y-auto">
              {pingResults.length === 0 && (
                <div className="text-slate-500 italic">Membuka socket jaringan diagnostic...</div>
              )}
              {pingResults.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  {line}
                </div>
              ))}
              {isPinging && (
                <div className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
              )}
            </div>

            {/* Terminal Footer */}
            <div className="bg-[#121B2D] px-5 py-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowPingLog(null)}
                disabled={isPinging}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                Tutup Diagnostik
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
