import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Send, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Phone, 
  Server, 
  Wifi, 
  UserPlus, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Customer, CustomerStatus, MikrotikStatus, InternetPlan } from "../types";

interface CustomersViewProps {
  customers: Customer[];
  plans: InternetPlan[];
  onAddCustomer: (c: Customer) => void;
  onUpdateCustomer: (c: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  searchQuery: string;
  showAddModal: boolean;
  onCloseAddModal: () => void;
}

export default function CustomersView({
  customers,
  plans,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  searchQuery,
  showAddModal,
  onCloseAddModal
}: CustomersViewProps) {
  const [activeTab, setActiveTab] = useState<"semua" | "aktif" | "isolir" | "nonaktif" | "server">("semua");
  const [localSearch, setLocalSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWhatsAppTemplate, setShowWhatsAppTemplate] = useState<Customer | null>(null);

  // New Customer Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [planId, setPlanId] = useState(plans[0]?.id || "plan-pro");
  const [phone, setPhone] = useState("");
  const [ipAddress, setIpAddress] = useState("192.168.1.");
  const [server, setServer] = useState("Mikrotik 01 - Pusat");
  const [status, setStatus] = useState<CustomerStatus>(CustomerStatus.AKTIF);

  // NEW CONNECTION TYPE & AUTO-GENERATED STATES
  const [connectionType, setConnectionType] = useState<"PPPoE" | "Static IP">("PPPoE");
  const [pppoeUser, setPppoeUser] = useState("");
  const [pppoePass, setPppoePass] = useState("");
  const [generatedCustId, setGeneratedCustId] = useState("");

  // Edit Customer Form State (for modal)
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPlanId, setEditPlanId] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editIp, setEditIp] = useState("");
  const [editServer, setEditServer] = useState("");
  const [editStatus, setEditStatus] = useState<CustomerStatus>(CustomerStatus.AKTIF);
  const [editConnectionType, setEditConnectionType] = useState<"PPPoE" | "Static IP">("PPPoE");
  const [editPppoeUser, setEditPppoeUser] = useState("");
  const [editPppoePass, setEditPppoePass] = useState("");

  // Auto-generate customer ID when connectionType changes or modal opens
  useEffect(() => {
    if (showAddModal) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const prefix = connectionType === "PPPoE" ? "PPP" : "STA";
      setGeneratedCustId(`NET-${prefix}-${randNum}`);
    }
  }, [connectionType, showAddModal]);

  // Auto-generate PPPoE username based on customer name
  useEffect(() => {
    if (name && !pppoeUser) {
      const slug = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      setPppoeUser(slug);
    }
  }, [name]);

  // Auto-generate random password when PPPoE is chosen and modal opens
  useEffect(() => {
    if (showAddModal && !pppoePass) {
      setPppoePass("net" + Math.floor(1000 + Math.random() * 9000));
    }
  }, [showAddModal]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter customers by activeTab and searches
  const filteredCustomers = customers.filter(c => {
    // Tab Filter
    if (activeTab === "aktif" && c.status !== CustomerStatus.AKTIF) return false;
    if (activeTab === "isolir" && c.status !== CustomerStatus.ISOLIR) return false;
    if (activeTab === "nonaktif" && c.status !== CustomerStatus.NONAKTIF) return false;
    // For "server" tab, let's filter for enterprise customers (e.g. PT. Maju Jaya or those on Biz Lite)
    if (activeTab === "server" && !c.planId.includes("biz")) return false;

    // Search query
    const query = (searchQuery || localSearch).toLowerCase();
    const matchesName = c.name.toLowerCase().includes(query);
    const matchesId = c.id.toLowerCase().includes(query);
    const matchesAddress = c.address.toLowerCase().includes(query);
    const matchesIP = c.ipAddress.toLowerCase().includes(query);

    return matchesName || matchesId || matchesAddress || matchesIP;
  });

  // Pagination calculation
  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  // Tab count indicators
  const countSemua = customers.length;
  const countAktif = customers.filter(c => c.status === CustomerStatus.AKTIF).length;
  const countIsolir = customers.filter(c => c.status === CustomerStatus.ISOLIR).length;
  const countNonaktif = customers.filter(c => c.status === CustomerStatus.NONAKTIF).length;
  const countServer = customers.filter(c => c.planId.includes("biz")).length;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone) return;

    const newCust: Customer = {
      id: generatedCustId || `CUST-${Math.floor(Math.random() * 9000) + 10000}`,
      name,
      address,
      planId,
      status,
      mikrotikStatus: status === CustomerStatus.AKTIF ? MikrotikStatus.CONNECTED : MikrotikStatus.OFFLINE,
      server,
      dueDate: status === CustomerStatus.AKTIF ? "20 Okt 2023" : "-",
      phone,
      ipAddress: connectionType === "Static IP" ? ipAddress : "-",
      connectionType,
      pppoeUser: connectionType === "PPPoE" ? pppoeUser : undefined,
      pppoePass: connectionType === "PPPoE" ? pppoePass : undefined,
    };

    onAddCustomer(newCust);
    
    // Reset Form
    setName("");
    setAddress("");
    setPhone("");
    setIpAddress("192.168.1.");
    setPppoeUser("");
    setPppoePass("");
    onCloseAddModal();
    setCurrentPage(1);
  };

  const openEditModal = (c: Customer) => {
    setSelectedCustomer(c);
    setEditName(c.name);
    setEditAddress(c.address);
    setEditPlanId(c.planId);
    setEditPhone(c.phone);
    setEditIp(c.ipAddress);
    setEditServer(c.server);
    setEditStatus(c.status);
    
    setEditConnectionType(c.connectionType || "PPPoE");
    setEditPppoeUser(c.pppoeUser || "");
    setEditPppoePass(c.pppoePass || "");
    
    setShowEditModal(true);
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const updated: Customer = {
      ...selectedCustomer,
      name: editName,
      address: editAddress,
      planId: editPlanId,
      phone: editPhone,
      ipAddress: editConnectionType === "Static IP" ? editIp : "-",
      server: editServer,
      status: editStatus,
      mikrotikStatus: editStatus === CustomerStatus.AKTIF ? MikrotikStatus.CONNECTED : MikrotikStatus.OFFLINE,
      dueDate: editStatus === CustomerStatus.AKTIF ? "25 Okt 2023" : "-",
      connectionType: editConnectionType,
      pppoeUser: editConnectionType === "PPPoE" ? editPppoeUser : undefined,
      pppoePass: editConnectionType === "PPPoE" ? editPppoePass : undefined,
    };

    onUpdateCustomer(updated);
    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  const handleTriggerWhatsApp = (c: Customer) => {
    setShowWhatsAppTemplate(c);
  };

  const sendMockWhatsApp = (c: Customer) => {
    alert(`[WhatsApp API Gateway] Berhasil mengirimkan pesan tagihan ke nomor ${c.phone} (${c.name}).\n\nTemplate Pesan:\n"Yth Bpk/Ibu ${c.name}, mohon lakukan pelunasan tagihan internet Anda sebesar Rp ${plans.find(p => p.id === c.planId)?.price.toLocaleString()} sebelum tanggal jatuh tempo ${c.dueDate}. Terima kasih."`);
    setShowWhatsAppTemplate(null);
  };

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Header and top tools */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Daftar Pelanggan</h1>
          <p className="text-sm text-white/60 mt-1">
            Kelola data pelanggan, status paket, dan tagihan aktif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Filter button */}
          <button 
            onClick={() => alert("Mengatur filter lanjutan. Silakan pilih tab status untuk penyaringan cepat.")}
            className="bg-white/5 border border-white/5 hover:border-[#C5A059]/30 text-white/80 py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs transition-all font-semibold"
          >
            <Filter className="w-4 h-4 text-white/40" />
            <span>Filter</span>
          </button>

          {/* Add Customer button */}
          <button
            onClick={onCloseAddModal} // triggers modal via App.tsx state change
            className="bg-[#C5A059] hover:bg-[#D4B069] text-black font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-md shadow-[#C5A059]/10 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Baru</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Navigation Tabs and Search box row */}
        <div className="p-4 bg-[#080808] border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => { setActiveTab("semua"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "semua" ? "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/10" : "text-white/40 hover:text-white/85"
              }`}
            >
              Semua ({countSemua})
            </button>
            <button
              onClick={() => { setActiveTab("aktif"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "aktif" ? "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/10" : "text-white/40 hover:text-white/85"
              }`}
            >
              Aktif ({countAktif})
            </button>
            <button
              onClick={() => { setActiveTab("isolir"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "isolir" ? "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/10" : "text-white/40 hover:text-white/85"
              }`}
            >
              Isolir ({countIsolir})
            </button>
            <button
              onClick={() => { setActiveTab("nonaktif"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "nonaktif" ? "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/10" : "text-white/40 hover:text-white/85"
              }`}
            >
              Nonaktif ({countNonaktif})
            </button>
            <button
              onClick={() => { setActiveTab("server"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === "server" ? "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/10" : "text-white/40 hover:text-white/85"
              }`}
            >
              <Server className="w-3 h-3" />
              <span>Server ({countServer})</span>
            </button>
          </div>

          {/* Quick Search inside Card */}
          <div className="relative w-full lg:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Cari ID/Nama..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/5 focus:border-[#C5A059] rounded-lg text-xs text-white placeholder-white/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider bg-[#080808]">
                <th className="py-4 px-6">Nama & ID</th>
                <th className="py-4 px-4">Alamat Pemasangan</th>
                <th className="py-4 px-4">Paket WiFi</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Status Mikrotik</th>
                <th className="py-4 px-4">Server Mikrotik</th>
                <th className="py-4 px-4 text-center">Jatuh Tempo</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/65">
              {currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-500">
                    Tidak ada data pelanggan yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                currentCustomers.map((c) => {
                  const plan = plans.find(p => p.id === c.planId);
                  const initialLetter = c.name.charAt(0);

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/15 group transition-all text-xs">
                      
                      {/* Avatar, Name & CUST ID */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors uppercase">
                            {initialLetter}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                              <span>{c.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                                (c.connectionType || "PPPoE") === "PPPoE"
                                  ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>
                                {c.connectionType || "PPPoE"}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                              {c.id} • {(c.connectionType || "PPPoE") === "PPPoE" ? `ppp: ${c.pppoeUser || c.name.toLowerCase().replace(/\s+/g, "")}` : `ip: ${c.ipAddress}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 max-w-[150px] truncate text-slate-400 group-hover:text-slate-300">
                        {c.address}
                      </td>

                      {/* Plan Details */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-300">
                          {plan?.name || "Custom Plan"}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {plan ? `Rp ${plan.price.toLocaleString("id-ID")}/bln` : "Custom"}
                        </span>
                      </td>

                      {/* Status Billing */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {c.status === CustomerStatus.AKTIF ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-md font-bold text-[10px]">
                            Aktif
                          </span>
                        ) : c.status === CustomerStatus.ISOLIR ? (
                          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/10 px-2.5 py-1 rounded-md font-bold text-[10px]">
                            Isolir
                          </span>
                        ) : (
                          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/10 px-2.5 py-1 rounded-md font-bold text-[10px]">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Mikrotik Status Dot */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 justify-center">
                          <span className={`w-2 h-2 rounded-full ${
                            c.mikrotikStatus === MikrotikStatus.CONNECTED ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          }`} />
                          <span className={c.mikrotikStatus === MikrotikStatus.CONNECTED ? "text-emerald-400" : "text-rose-400"}>
                            {c.mikrotikStatus}
                          </span>
                        </span>
                      </td>

                      {/* Associated Server */}
                      <td className="py-4 px-4 text-slate-400 font-medium whitespace-nowrap">
                        {c.server}
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 text-center whitespace-nowrap font-mono font-bold text-slate-300">
                        {c.dueDate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp remind button using WhatsApp standard brand green */}
                          <button
                            onClick={() => handleTriggerWhatsApp(c)}
                            style={{ backgroundColor: "#25D366" }}
                            className="p-1.5 text-white hover:brightness-110 rounded-lg transition-all"
                            title="Kirim Tagihan WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg transition-all"
                            title="Edit Pelanggan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus pelanggan ${c.name}?`)) {
                                onDeleteCustomer(c.id);
                              }
                            }}
                            className="p-1.5 bg-rose-950/20 border border-rose-900 hover:bg-rose-900 text-rose-400 hover:text-white rounded-lg transition-all"
                            title="Hapus Pelanggan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Info */}
        <div className="p-5 bg-[#0D1526] border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <span>
            Menampilkan {totalItems > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, totalItems)} dari {totalItems} data
          </span>

          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1.5 bg-[#121B2D] border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 font-bold font-mono rounded-lg transition-all ${
                  currentPage === pageNum 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "bg-[#121B2D] border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 bg-[#121B2D] border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* CREATE NEW CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="text-blue-500 w-5 h-5" />
                <span>Registrasi Pelanggan Baru</span>
              </h3>
              <button onClick={onCloseAddModal} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmad Fauzi"
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08123456789"
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Jl. Kenanga Raya No. 12"
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/60 font-semibold mb-1.5 uppercase tracking-wider">
                    Metode Koneksi Jaringan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConnectionType("PPPoE")}
                      className={`p-3 rounded-xl border text-center font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        connectionType === "PPPoE"
                          ? "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]"
                          : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      <Wifi className="w-4 h-4" />
                      PPPoE Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setConnectionType("Static IP")}
                      className={`p-3 rounded-xl border text-center font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        connectionType === "Static IP"
                          ? "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]"
                          : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      <Server className="w-4 h-4" />
                      Static IP
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 font-semibold mb-1.5 uppercase tracking-wider">
                    ID Pelanggan (Otomatis)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={generatedCustId}
                    className="w-full bg-white/5 border border-white/5 p-2.5 rounded-xl text-[#C5A059] font-mono font-bold outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Pilih Paket Layanan
                  </label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Rp {p.price.toLocaleString()}/bln)
                      </option>
                    ))}
                  </select>
                </div>

                {connectionType === "PPPoE" ? (
                  <>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                        PPPoE Username
                      </label>
                      <input
                        type="text"
                        required
                        value={pppoeUser}
                        onChange={(e) => setPppoeUser(e.target.value)}
                        placeholder="e.g. ahmad_fauzi"
                        className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                        PPPoE Password
                      </label>
                      <input
                        type="text"
                        required
                        value={pppoePass}
                        onChange={(e) => setPppoePass(e.target.value)}
                        placeholder="e.g. pass123"
                        className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                      IP Address Static
                    </label>
                    <input
                      type="text"
                      required
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="e.g. 192.168.1.10"
                      className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Server Mikrotik
                  </label>
                  <select
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                  >
                    <option value="Mikrotik 01 - Pusat">Mikrotik 01 - Pusat</option>
                    <option value="Mikrotik 02 - Cabang Selatan">Mikrotik 02 - Cabang Selatan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Status Awal
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                  >
                    <option value={CustomerStatus.AKTIF}>Aktif</option>
                    <option value={CustomerStatus.ISOLIR}>Isolir</option>
                    <option value={CustomerStatus.NONAKTIF}>Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D4B069] text-black font-bold rounded-xl text-xs shadow-lg shadow-[#C5A059]/15 cursor-pointer"
                >
                  Daftarkan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="text-blue-500 w-5 h-5" />
                <span>Ubah Informasi Pelanggan</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/60 font-semibold mb-1.5 uppercase tracking-wider">
                    Metode Koneksi Jaringan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditConnectionType("PPPoE")}
                      className={`p-3 rounded-xl border text-center font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        editConnectionType === "PPPoE"
                          ? "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]"
                          : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      <Wifi className="w-4 h-4" />
                      PPPoE Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditConnectionType("Static IP")}
                      className={`p-3 rounded-xl border text-center font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        editConnectionType === "Static IP"
                          ? "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]"
                          : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      <Server className="w-4 h-4" />
                      Static IP
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Layanan Internet
                  </label>
                  <select
                    value={editPlanId}
                    onChange={(e) => setEditPlanId(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {editConnectionType === "PPPoE" ? (
                  <>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                        PPPoE Username
                      </label>
                      <input
                        type="text"
                        required
                        value={editPppoeUser}
                        onChange={(e) => setEditPppoeUser(e.target.value)}
                        className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                        PPPoE Password
                      </label>
                      <input
                        type="text"
                        required
                        value={editPppoePass}
                        onChange={(e) => setEditPppoePass(e.target.value)}
                        className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                      IP Address static
                    </label>
                    <input
                      type="text"
                      required
                      value={editIp}
                      onChange={(e) => setEditIp(e.target.value)}
                      className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Server Jaringan
                  </label>
                  <select
                    value={editServer}
                    onChange={(e) => setEditServer(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                  >
                    <option value="Mikrotik 01 - Pusat">Mikrotik 01 - Pusat</option>
                    <option value="Mikrotik 02 - Cabang Selatan">Mikrotik 02 - Cabang Selatan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Status Keanggotaan
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as CustomerStatus)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-[#C5A059] p-2.5 rounded-xl text-slate-200 outline-none"
                  >
                    <option value={CustomerStatus.AKTIF}>Aktif</option>
                    <option value={CustomerStatus.ISOLIR}>Isolir</option>
                    <option value={CustomerStatus.NONAKTIF}>Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D4B069] text-black font-bold rounded-xl text-xs shadow-lg shadow-[#C5A059]/15 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WHATSAPP REMINDER TEMPLATE DIALOG */}
      {showWhatsAppTemplate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl font-sans">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <MessageSquare className="text-emerald-500 w-4 h-4" />
                <span>WhatsApp Billing Reminder</span>
              </span>
              <button onClick={() => setShowWhatsAppTemplate(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-400">
                Gunakan template penagihan WhatsApp Gateway otomatis untuk dikirimkan langsung ke pelanggan ini:
              </p>

              {/* Chat preview style box */}
              <div className="bg-[#090E17] border border-emerald-900/30 p-4 rounded-xl relative">
                <div className="text-[11px] font-bold text-emerald-500 flex items-center gap-1.5 mb-2">
                  <Phone className="w-3 h-3" />
                  <span>Kirim ke: {showWhatsAppTemplate.phone}</span>
                </div>
                <div className="bg-emerald-950/20 text-xs text-emerald-100 p-3 rounded-lg border border-emerald-800/20 leading-relaxed font-mono">
                  Yth. Bpk/Ibu <span className="font-bold">{showWhatsAppTemplate.name}</span>,<br />
                  Mohon lakukan pembayaran tagihan internet Paket <span className="font-bold">{plans.find(p => p.id === showWhatsAppTemplate.planId)?.name}</span> sebesar <span className="font-bold">Rp {plans.find(p => p.id === showWhatsAppTemplate.planId)?.price.toLocaleString()}</span> sebelum tanggal jatuh tempo <span className="font-bold">{showWhatsAppTemplate.dueDate}</span>.<br /><br />
                  Silakan abaikan pesan ini jika Anda sudah melakukan pelunasan. Terima kasih.
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setShowWhatsAppTemplate(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Tutup
                </button>
                <button
                  onClick={() => sendMockWhatsApp(showWhatsAppTemplate)}
                  style={{ backgroundColor: "#25D366" }}
                  className="px-5 py-2 text-white font-bold rounded-xl text-xs hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-emerald-600/10"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
