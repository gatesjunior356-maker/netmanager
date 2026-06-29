import React, { useState, useEffect } from "react";
import { 
  Radio, 
  Cpu, 
  Thermometer, 
  Layers, 
  Search, 
  Filter, 
  RefreshCw, 
  Server, 
  TrendingUp, 
  Power, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Wifi, 
  User, 
  Clock, 
  Info,
  ChevronRight,
  Plus
} from "lucide-react";

interface OltDevice {
  id: string;
  name: string;
  type: "GPON" | "EPON" | "XPON";
  vendor: string;
  ipAddress: string;
  portsCount: number;
  cpuLoad: number;
  temp: number;
  uptime: string;
  totalOnu: number;
  onlineOnu: number;
  offlineOnu: number;
  warningOnu: number;
}

interface OnuDevice {
  id: string;
  name: string;
  sn: string;
  ponPort: number;
  onuIndex: number;
  type: string;
  rxPower: number; // dBm (attenuation)
  distance: number; // km
  status: "Online" | "Offline" | "LOS" | "Dying Gasp";
  uptime: string;
  lastOffline?: string;
  ipAllocated?: string;
  oltId?: string;
}

export default function OltMonitoringView() {
  // Sample OLT Devices loaded as state
  const [oltDevices, setOltDevices] = useState<OltDevice[]>(() => {
    const saved = localStorage.getItem("netmanager_olt_devices");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "olt-01",
        name: "OLT-01: Huawei MA5608T GPON (Core Pusat)",
        type: "GPON",
        vendor: "Huawei",
        ipAddress: "10.10.20.2",
        portsCount: 8,
        cpuLoad: 14,
        temp: 41,
        uptime: "45d 12h 4m",
        totalOnu: 154,
        onlineOnu: 142,
        offlineOnu: 8,
        warningOnu: 4
      },
      {
        id: "olt-02",
        name: "OLT-02: ZTE C320 GPON (Cluster Selatan)",
        type: "GPON",
        vendor: "ZTE",
        ipAddress: "10.10.20.3",
        portsCount: 4,
        cpuLoad: 22,
        temp: 47,
        uptime: "12d 6h 19m",
        totalOnu: 82,
        onlineOnu: 75,
        offlineOnu: 5,
        warningOnu: 2
      },
      {
        id: "olt-03",
        name: "OLT-03: HiOSO HA7304C EPON (Sektor Barat FTTH)",
        type: "EPON",
        vendor: "HiOSO",
        ipAddress: "10.10.30.5",
        portsCount: 4,
        cpuLoad: 8,
        temp: 38,
        uptime: "89d 22h 44m",
        totalOnu: 48,
        onlineOnu: 44,
        offlineOnu: 3,
        warningOnu: 1
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("netmanager_olt_devices", JSON.stringify(oltDevices));
  }, [oltDevices]);

  const [selectedOltId, setSelectedOltId] = useState<string>("olt-01");
  const selectedOlt = oltDevices.find(o => o.id === selectedOltId) || oltDevices[0];

  // PON Ports selection
  const [selectedPonPort, setSelectedPonPort] = useState<number | null>(null); // null means "All PON Ports"

  // Onu Data list (pre-populated with realistic simulation data matching OLT-01 Huawei)
  const [onuData, setOnuData] = useState<OnuDevice[]>(() => {
    const saved = localStorage.getItem("netmanager_onu_devices");
    if (saved) return JSON.parse(saved);
    return [
      // PON Port 1 -> OLT-01
      { id: "ONU-1/1", name: "Budi Setiawan", sn: "HWTC8C726A20", ponPort: 1, onuIndex: 1, type: "Huawei EG8141A5", rxPower: -19.4, distance: 0.8, status: "Online", uptime: "14d 2h", ipAllocated: "192.168.1.10", oltId: "olt-01" },
      { id: "ONU-1/2", name: "Hendra Wijaya", sn: "HWTC8C7291F0", ponPort: 1, onuIndex: 2, type: "Huawei EG8141A5", rxPower: -21.1, distance: 1.1, status: "Online", uptime: "28d 19h", ipAllocated: "192.168.1.11", oltId: "olt-01" },
      { id: "ONU-1/3", name: "Siti Rahmawati", sn: "HWTC4A12B880", ponPort: 1, onuIndex: 3, type: "Huawei EG8010H", rxPower: -26.4, distance: 2.3, status: "Online", uptime: "4d 1h", ipAllocated: "192.168.1.12", oltId: "olt-01" }, // Warning (Signal Lemah)
      { id: "ONU-1/4", name: "Adi Saputra", sn: "HWTC7E188C10", ponPort: 1, onuIndex: 4, type: "ZTE F609", rxPower: -18.2, distance: 0.5, status: "Online", uptime: "42d 11h", ipAllocated: "192.168.1.13", oltId: "olt-01" },
      { id: "ONU-1/5", name: "Diana Putri", sn: "HWTC9201FC80", ponPort: 1, onuIndex: 5, type: "Huawei EG8141A5", rxPower: -99.0, distance: 1.7, status: "LOS", uptime: "-", lastOffline: "28 Jun 15:32", oltId: "olt-01" }, // Loss of Signal
      
      // PON Port 2 -> OLT-02
      { id: "ONU-2/1", name: "Rian Hidayat", sn: "HWTC82C9012A", ponPort: 2, onuIndex: 1, type: "Huawei EG8141A5", rxPower: -20.5, distance: 1.2, status: "Online", uptime: "10d 6h", ipAllocated: "192.168.1.14", oltId: "olt-02" },
      { id: "ONU-2/2", name: "Eko Prasetyo", sn: "HWTC732A1F50", ponPort: 2, onuIndex: 2, type: "ZTE F609", rxPower: -23.8, distance: 1.9, status: "Online", uptime: "5d 20h", ipAllocated: "192.168.1.15", oltId: "olt-02" },
      { id: "ONU-2/3", name: "Mega Utami", sn: "HWTC802B33AA", ponPort: 2, onuIndex: 3, type: "Huawei EG8010H", rxPower: -28.9, distance: 2.8, status: "Online", uptime: "1d 12h", ipAllocated: "192.168.1.16", oltId: "olt-02" }, // Warning
      { id: "ONU-2/4", name: "Yusuf Mansur", sn: "HWTC955CD901", ponPort: 2, onuIndex: 4, type: "FiberHome AN5506", rxPower: -99.0, distance: 2.1, status: "Offline", uptime: "-", lastOffline: "27 Jun 09:12", oltId: "olt-02" },
      { id: "ONU-2/5", name: "Slamet Santoso", sn: "HWTC82A41C90", ponPort: 2, onuIndex: 5, type: "Huawei EG8141A5", rxPower: -19.1, distance: 0.9, status: "Online", uptime: "65d 4h", ipAllocated: "192.168.1.17", oltId: "olt-02" },
      
      // PON Port 3 -> OLT-03
      { id: "ONU-3/1", name: "Anisa Rahma", sn: "HWTC89221FA1", ponPort: 3, onuIndex: 1, type: "ZTE F609", rxPower: -17.8, distance: 0.6, status: "Online", uptime: "8d 14h", ipAllocated: "192.168.1.18", oltId: "olt-03" },
      { id: "ONU-3/2", name: "Dwi Cahyono", sn: "HWTC7E10A980", ponPort: 3, onuIndex: 2, type: "Huawei EG8141A5", rxPower: -22.3, distance: 1.4, status: "Online", uptime: "19d 22h", ipAllocated: "192.168.1.19", oltId: "olt-03" },
      { id: "ONU-3/3", name: "Lestari Dewi", sn: "HWTC92211C88", ponPort: 3, onuIndex: 3, type: "Huawei EG8010H", rxPower: -32.5, distance: 3.1, status: "LOS", uptime: "-", lastOffline: "28 Jun 16:11", oltId: "olt-03" }, // Warning / Red
      { id: "ONU-3/4", name: "Guntur Wibowo", sn: "HWTC91A88D22", ponPort: 3, onuIndex: 4, type: "FiberHome AN5506", rxPower: -21.4, distance: 1.3, status: "Online", uptime: "12d 8h", ipAllocated: "192.168.1.20", oltId: "olt-03" },
      { id: "ONU-3/5", name: "Indah Permata", sn: "HWTC7C7118B0", ponPort: 3, onuIndex: 5, type: "Huawei EG8141A5", rxPower: -99.0, distance: 2.2, status: "Dying Gasp", uptime: "-", lastOffline: "28 Jun 16:45", oltId: "olt-03" }, // Power outage at client site
    ];
  });

  useEffect(() => {
    localStorage.setItem("netmanager_onu_devices", JSON.stringify(onuData));
  }, [onuData]);

  // Add OLT Form States
  const [showAddOltModal, setShowAddOltModal] = useState(false);
  const [newOltName, setNewOltName] = useState("");
  const [newOltType, setNewOltType] = useState<"GPON" | "EPON" | "XPON">("GPON");
  const [newOltVendor, setNewOltVendor] = useState("Huawei");
  const [newOltIp, setNewOltIp] = useState("");
  const [newOltPorts, setNewOltPorts] = useState(8);
  const [newOltLocation, setNewOltLocation] = useState("");

  const handleAddOltSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOltName || !newOltIp) {
      alert("Nama OLT dan IP Address wajib diisi!");
      return;
    }

    const newId = `olt-${Date.now()}`;
    const locationStr = newOltLocation ? ` (${newOltLocation})` : "";
    const fullName = `${newOltName}: ${newOltVendor} ${newOltType}${locationStr}`;

    const newOlt: OltDevice = {
      id: newId,
      name: fullName,
      type: newOltType,
      vendor: newOltVendor,
      ipAddress: newOltIp,
      portsCount: Number(newOltPorts),
      cpuLoad: Math.floor(10 + Math.random() * 15),
      temp: Math.floor(35 + Math.random() * 12),
      uptime: "0d 0h 1m",
      totalOnu: 0,
      onlineOnu: 0,
      offlineOnu: 0,
      warningOnu: 0
    };

    setOltDevices(prev => [...prev, newOlt]);
    setSelectedOltId(newId);
    setSelectedPonPort(null);
    setShowAddOltModal(false);

    // Reset Form
    setNewOltName("");
    setNewOltIp("");
    setNewOltLocation("");
    setNewOltPorts(8);
    setNewOltType("GPON");
    setNewOltVendor("Huawei");

    alert(`Perangkat OLT "${newOltName}" berhasil ditambahkan dan dihubungkan!`);
  };

  // Search & Filter Status
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "online" | "warning" | "offline">("semua");

  // Dynamic simulation statuses
  const [checkingOnuId, setCheckingOnuId] = useState<string | null>(null);
  const [rebootingOnuId, setRebootingOnuId] = useState<string | null>(null);
  const [showRogueModal, setShowRogueModal] = useState(false);
  const [onboardSn, setOnboardSn] = useState("");
  const [onboardName, setOnboardName] = useState("");
  const [onboardPort, setOnboardPort] = useState(3);
  const [onboardType, setOnboardType] = useState("Huawei EG8141A5");

  // Rogue/Unregistered ONUs simulation
  const [rogueOnus, setRogueOnus] = useState<Array<{sn: string; port: number; type: string; rssi: number}>>([
    { sn: "HWTC8F12B9D1", port: 3, type: "Huawei EG8141A5", rssi: -18.7 },
    { sn: "ZTETG0182C31", port: 4, type: "ZTE F609", rssi: -22.4 }
  ]);

  // Attenuation Power evaluation helper
  const getRxPowerLabel = (power: number, status: string) => {
    if (status !== "Online") return { text: "Offline", color: "text-white/30 bg-white/5 border-white/5" };
    if (power >= -24.0) return { text: `${power.toFixed(1)} dBm (Bagus)`, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (power >= -27.0) return { text: `${power.toFixed(1)} dBm (Cukup)`, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { text: `${power.toFixed(1)} dBm (Kritis)`, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "LOS":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse";
      case "Dying Gasp":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-white/5 text-white/40 border border-white/10";
    }
  };

  // Run Attenuation Refresh Simulation
  const handleRefreshAttenuation = (onuId: string) => {
    setCheckingOnuId(onuId);
    setTimeout(() => {
      setOnuData(prev => prev.map(o => {
        if (o.id === onuId) {
          // Simulate slight dBm fluctuation or fixing high attenuation
          const newPower = o.status === "Online" ? -(17.0 + Math.random() * 9.0) : -99.0;
          return { ...o, rxPower: parseFloat(newPower.toFixed(1)) };
        }
        return o;
      }));
      setCheckingOnuId(null);
    }, 1200);
  };

  // Run ONU SNMP Reboot Simulation
  const handleRebootOnu = (onuId: string, clientName: string) => {
    if (confirm(`Kirim SNMP packet untuk REBOOT ONU milik ${clientName} (${onuId})?`)) {
      setRebootingOnuId(onuId);
      
      // Temporarily change status to offline
      setOnuData(prev => prev.map(o => o.id === onuId ? { ...o, status: "Offline", rxPower: -99.0, uptime: "-" } : o));

      setTimeout(() => {
        // Change back to online after 3 seconds boot simulation
        setOnuData(prev => prev.map(o => o.id === onuId ? { 
          ...o, 
          status: "Online", 
          rxPower: -19.5, 
          uptime: "0d 0h 1m" 
        } : o));
        setRebootingOnuId(null);
        alert(`Koneksi ONU ${onuId} berhasil dipulihkan setelah reboot SNMP.`);
      }, 3000);
    }
  };

  // Handle onboarding rogue ONU
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName) {
      alert("Nama Pelanggan wajib diisi!");
      return;
    }

    // Add new ONU to list
    const newOnu: OnuDevice = {
      id: `ONU-${onboardPort}/${onuData.filter(o => o.ponPort === onboardPort).length + 1}`,
      name: onboardName,
      sn: onboardSn,
      ponPort: onboardPort,
      onuIndex: onuData.filter(o => o.ponPort === onboardPort).length + 1,
      type: onboardType,
      rxPower: -19.8,
      distance: parseFloat((0.5 + Math.random() * 2).toFixed(1)),
      status: "Online",
      uptime: "0d 0h 1m",
      ipAllocated: `192.168.1.${Math.floor(21 + Math.random() * 200)}`,
      oltId: selectedOltId
    };

    setOnuData(prev => [newOnu, ...prev]);
    
    // Update active OLT stats
    setOltDevices(prev => prev.map(olt => {
      if (olt.id === selectedOltId) {
        return {
          ...olt,
          totalOnu: olt.totalOnu + 1,
          onlineOnu: olt.onlineOnu + 1
        };
      }
      return olt;
    }));

    setRogueOnus(prev => prev.filter(r => r.sn !== onboardSn));
    setShowRogueModal(false);
    setOnboardName("");
    alert(`ONU SN ${onboardSn} berhasil terdaftar dan ditautkan ke akun ${onboardName}!`);
  };

  // Filter ONU list
  const filteredOnus = onuData.filter(onu => {
    // OLT filter (defaulting to olt-01 if not specified)
    const onuOltId = onu.oltId || "olt-01";
    if (onuOltId !== selectedOltId) return false;

    // Port filter
    if (selectedPonPort !== null && onu.ponPort !== selectedPonPort) return false;

    // Search term matching
    const matchesSearch = 
      onu.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      onu.sn.toLowerCase().includes(searchTerm.toLowerCase()) || 
      onu.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Status tabs filters
    if (statusFilter === "online") return onu.status === "Online" && onu.rxPower >= -24.0;
    if (statusFilter === "warning") return onu.status === "Online" && onu.rxPower < -24.0;
    if (statusFilter === "offline") return onu.status !== "Online";

    return true;
  });

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-br from-[#121212] to-[#070707] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20" />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Optical Network
            </span>
            <span className="text-white/40 text-xs font-mono">• SNMP Sync v2c</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Monitoring OLT & Redaman ONU</h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-2xl leading-relaxed">
            Monitor level daya optik (Rx Power dBm) ONT pelanggan secara live. Deteksi gangguan putus kabel, power failure (dying gasp), serta aktivasi ONT baru secara otomatis.
          </p>
        </div>

        {/* Selected OLT Dropdown & Add Button */}
        <div className="flex flex-col sm:flex-row items-end gap-3 shrink-0 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <label className="block text-[9px] text-white/40 uppercase font-bold tracking-wider mb-1.5">Pilih Perangkat OLT</label>
            <div className="relative flex items-center">
              <Server className="absolute left-3 w-4 h-4 text-white/40" />
              <select
                value={selectedOltId}
                onChange={(e) => {
                  setSelectedOltId(e.target.value);
                  setSelectedPonPort(null); // Reset port on OLT change
                }}
                className="w-full sm:w-72 pl-9 pr-8 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-bold text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 cursor-pointer appearance-none"
              >
                {oltDevices.map((olt) => (
                  <option key={olt.id} value={olt.id} className="bg-[#0C0C0C] py-2">{olt.name}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 w-4 h-4 text-white/40 rotate-90 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={() => setShowAddOltModal(true)}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap border border-amber-500 hover:border-amber-400"
          >
            <Plus className="w-4 h-4" /> Tambah OLT
          </button>
        </div>
      </div>

      {/* Rogue ONU Warning Bar */}
      {rogueOnus.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                Ditemukan {rogueOnus.length} ONU Belum Terregistrasi (Rogue ONUs)!
                <span className="bg-rose-500/20 text-rose-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Auto-Detect</span>
              </h4>
              <p className="text-[11px] text-white/60 mt-0.5">Sinyal ONT baru terdeteksi pada port PON OLT. Silakan daftarkan untuk menghubungkan ke billing pelanggan.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {rogueOnus.map((rogue, index) => (
              <button
                key={index}
                onClick={() => {
                  setOnboardSn(rogue.sn);
                  setOnboardPort(rogue.port);
                  setOnboardType(rogue.type);
                  setShowRogueModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-extrabold px-3 py-2 rounded-lg transition-all active:scale-[0.98] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Registrasi {rogue.sn.substring(0, 6)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 shrink-0">
            <Cpu className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">CPU & Temperatur</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {selectedOlt.cpuLoad}% <span className="text-white/40 font-normal text-xs">/</span> {selectedOlt.temp}°C
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 shrink-0">
            <Layers className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Total Terdaftar</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {selectedOlt.totalOnu} <span className="text-white/30 text-[11px] font-semibold">ONUs</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Online / Stabil</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {selectedOlt.onlineOnu} <span className="text-white/30 text-[11px] font-semibold">Aktif ({Math.round(selectedOlt.onlineOnu / selectedOlt.totalOnu * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 shrink-0">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Gangguan / Off</span>
            <div className="text-base font-extrabold text-white mt-0.5 text-rose-400">
              {selectedOlt.offlineOnu} <span className="text-white/30 text-[11px] font-semibold">ONUs ({selectedOlt.warningOnu} Lemah)</span>
            </div>
          </div>
        </div>
      </div>

      {/* PON Ports Visual Selector Grid */}
      <div className="bg-[#0C0C0C]/90 border border-white/5 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xs uppercase font-extrabold text-white/40 tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-500" /> Pilih Port PON OLT untuk Memfilter Distribusi Serat Optik
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Port ALL */}
          <button
            onClick={() => setSelectedPonPort(null)}
            className={`p-3.5 border rounded-xl text-center transition-all cursor-pointer flex flex-col justify-between h-20 ${
              selectedPonPort === null 
                ? "bg-amber-500/10 border-amber-500/30 shadow-lg" 
                : "bg-black/20 border-white/5 hover:border-white/10"
            }`}
          >
            <span className="text-[10px] text-white/40 uppercase font-bold">Semua Port</span>
            <div className="text-sm font-black mt-1">
              PON All
            </div>
            <span className="text-[9px] text-white/60 font-medium">{selectedOlt.totalOnu} ONU</span>
          </button>

          {/* Individual Ports */}
          {Array.from({ length: selectedOlt.portsCount }).map((_, idx) => {
            const portNum = idx + 1;
            const portOnus = onuData.filter(o => o.ponPort === portNum);
            const total = portOnus.length;
            const online = portOnus.filter(o => o.status === "Online").length;
            const offline = total - online;

            return (
              <button
                key={portNum}
                onClick={() => setSelectedPonPort(portNum)}
                className={`p-3 border rounded-xl text-center transition-all cursor-pointer flex flex-col justify-between h-20 relative overflow-hidden ${
                  selectedPonPort === portNum 
                    ? "bg-amber-500/10 border-amber-500/30 shadow-lg" 
                    : "bg-black/20 border-white/5 hover:border-white/10"
                }`}
              >
                {/* Laser level mini bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
                
                <span className="text-[9px] text-white/30 uppercase font-bold">Port 0/{portNum}</span>
                <div className="text-xs font-extrabold mt-1 text-white">
                  PON Port {portNum}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-white/50">
                  <span className="text-emerald-400 font-bold">{online} On</span>
                  <span>/</span>
                  <span className={offline > 0 ? "text-rose-400 font-bold" : "text-white/40"}>{offline} Off</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Table Filters */}
      <div className="bg-[#0C0C0C]/90 border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-black/20">
          
          {/* Filters Tab */}
          <div className="flex border border-white/5 bg-black/60 p-1 rounded-xl w-full md:w-auto overflow-x-auto whitespace-nowrap">
            {[
              { key: "semua" as const, label: "Semua ONU" },
              { key: "online" as const, label: "Sinyal Bagus" },
              { key: "warning" as const, label: "Redaman Tinggi" },
              { key: "offline" as const, label: "Offline / LOS" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab.key 
                    ? "bg-white/5 text-amber-400 shadow-sm font-black" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Cari nama, SN ONU, atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* ONU Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] text-white/40 uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">ONU ID & SN</th>
                <th className="py-4 px-6 font-bold">Nama Pelanggan</th>
                <th className="py-4 px-6 font-bold">PON Port</th>
                <th className="py-4 px-6 font-bold text-center">Rx Power (Redaman)</th>
                <th className="py-4 px-6 font-bold text-center">Jarak Optik</th>
                <th className="py-4 px-6 font-bold">Status Link</th>
                <th className="py-4 px-6 font-bold text-right">Aksi Diagnostik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredOnus.length > 0 ? (
                filteredOnus.map((onu) => {
                  const powerLabel = getRxPowerLabel(onu.rxPower, onu.status);
                  const isChecking = checkingOnuId === onu.id;
                  const isRebooting = rebootingOnuId === onu.id;

                  return (
                    <tr key={onu.id} className="hover:bg-white/[0.01] transition-colors">
                      {/* ONU ID & SN */}
                      <td className="py-4 px-6">
                        <div className="font-mono text-white font-bold">{onu.id}</div>
                        <div className="text-[10px] text-white/40 mt-0.5 uppercase font-semibold">{onu.sn}</div>
                        <div className="text-[9px] text-white/30 font-mono mt-0.5">{onu.type}</div>
                      </td>

                      {/* Customer Name */}
                      <td className="py-4 px-6 font-medium text-white/80">
                        <div className="flex items-center gap-1.5 font-sans">
                          <User className="w-3.5 h-3.5 text-white/30" />
                          <span>{onu.name}</span>
                        </div>
                        {onu.ipAllocated && (
                          <div className="text-[10px] font-mono text-white/30 mt-0.5">IP: {onu.ipAllocated}</div>
                        )}
                      </td>

                      {/* PON Port */}
                      <td className="py-4 px-6 font-bold text-white/60">
                        Port 0/{onu.ponPort}
                      </td>

                      {/* Attenuation Rx Power */}
                      <td className="py-4 px-6 text-center">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${powerLabel.color}`}>
                          {powerLabel.text}
                        </span>
                      </td>

                      {/* Distance */}
                      <td className="py-4 px-6 text-center font-mono font-bold text-white/60">
                        {onu.distance} km
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(onu.status)}`}>
                          {onu.status === "Online" ? `ONLINE (${onu.uptime})` : onu.status}
                        </span>
                        {onu.status !== "Online" && onu.lastOffline && (
                          <div className="text-[9px] text-white/30 mt-1 flex items-center gap-1 font-sans">
                            <Clock className="w-2.5 h-2.5" /> Sejak {onu.lastOffline}
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          onClick={() => handleRefreshAttenuation(onu.id)}
                          disabled={isChecking || isRebooting}
                          className="inline-flex items-center gap-1 bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold py-1.5 px-2.5 rounded-lg text-[10px] transition-all disabled:opacity-30 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
                          {isChecking ? "Menguji..." : "Uji Sinyal"}
                        </button>

                        <button
                          onClick={() => handleRebootOnu(onu.id, onu.name)}
                          disabled={isChecking || isRebooting || onu.status !== "Online"}
                          className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold py-1.5 px-2.5 rounded-lg text-[10px] transition-all disabled:opacity-30 cursor-pointer"
                        >
                          <Power className="w-3 h-3" />
                          {isRebooting ? "Rebooting..." : "Reboot"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-white/20" />
                      <p className="text-xs">Tidak ada ONU/ONT yang sesuai dengan filter pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Attenuation standard box */}
        <div className="p-4 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10.5px] text-white/40">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-500" />
            <span>Standard Redaman GPON Ideal: <span className="text-emerald-400 font-medium">-15 dBm s/d -24 dBm</span>. Batas Kritis LOS: <span className="text-rose-400 font-medium">&gt; -28 dBm</span>.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Bagus</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Cukup</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Kritis</span>
          </div>
        </div>
      </div>

      {/* Onboarding Rogue ONU Modal */}
      {showRogueModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C0C0C] border border-white/5 p-6 rounded-2xl shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Registrasi & Onboarding ONU Baru</h3>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              Daftarkan perangkat ONU serat optik yang baru dipasang di sisi pelanggan ke OLT Huawei Core Anda.
            </p>

            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Serial Number ONU (Detected)</label>
                <input
                  type="text"
                  readOnly
                  value={onboardSn}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white/80 outline-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Target Port PON</label>
                  <input
                    type="text"
                    readOnly
                    value={`GPON Port 0/${onboardPort}`}
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white/80 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Model / Tipe ONU</label>
                  <input
                    type="text"
                    readOnly
                    value={onboardType}
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white/80 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Tautkan ke Pelanggan Billing</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Subardjo"
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  className="w-full py-2.5 px-3 bg-black border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                />
                <span className="text-[9px] text-white/30 mt-1 block">Tautkan SN ONU ini dengan profil pelanggan aktif atau baru di database billing.</span>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowRogueModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-2.5 rounded-xl text-xs shadow-lg transition-all cursor-pointer active:scale-[0.98]"
                >
                  Daftarkan ONU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add OLT Modal */}
      {showAddOltModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C0C0C] border border-white/5 p-6 rounded-2xl shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Tambah Perangkat OLT Baru</h3>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              Integrasikan perangkat OLT baru ke dalam monitoring sistem jaringan Fiber Optik (FTTH) Anda.
            </p>

            <form onSubmit={handleAddOltSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Nama / Kode OLT</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: OLT-04"
                  value={newOltName}
                  onChange={(e) => setNewOltName(e.target.value)}
                  className="w-full py-2.5 px-3 bg-black border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Teknologi PON</label>
                  <select
                    value={newOltType}
                    onChange={(e) => setNewOltType(e.target.value as "GPON" | "EPON" | "XPON")}
                    className="w-full py-2.5 px-3 bg-black border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="GPON" className="bg-[#0C0C0C]">GPON</option>
                    <option value="EPON" className="bg-[#0C0C0C]">EPON</option>
                    <option value="XPON" className="bg-[#0C0C0C]">XPON</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Vendor OLT</label>
                  <select
                    value={newOltVendor}
                    onChange={(e) => setNewOltVendor(e.target.value)}
                    className="w-full py-2.5 px-3 bg-black border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Huawei" className="bg-[#0C0C0C]">Huawei</option>
                    <option value="ZTE" className="bg-[#0C0C0C]">ZTE</option>
                    <option value="HiOSO" className="bg-[#0C0C0C]">HiOSO</option>
                    <option value="FiberHome" className="bg-[#0C0C0C]">FiberHome</option>
                    <option value="Nokia" className="bg-[#0C0C0C]">Nokia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">IP Address OLT</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 10.10.40.2"
                    value={newOltIp}
                    onChange={(e) => setNewOltIp(e.target.value)}
                    className="w-full py-2.5 px-3 bg-black border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Jumlah Port PON</label>
                  <select
                    value={newOltPorts}
                    onChange={(e) => setNewOltPorts(Number(e.target.value))}
                    className="w-full py-2.5 px-3 bg-black border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="4" className="bg-[#0C0C0C]">4 Port PON</option>
                    <option value="8" className="bg-[#0C0C0C]">8 Port PON</option>
                    <option value="16" className="bg-[#0C0C0C]">16 Port PON</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Deskripsi Lokasi / Cluster (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Sektor Utara FTTH"
                  value={newOltLocation}
                  onChange={(e) => setNewOltLocation(e.target.value)}
                  className="w-full py-2.5 px-3 bg-black border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddOltModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-2.5 rounded-xl text-xs shadow-lg transition-all cursor-pointer active:scale-[0.98]"
                >
                  Hubungkan OLT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
