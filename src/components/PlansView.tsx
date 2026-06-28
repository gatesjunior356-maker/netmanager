import React, { useState } from "react";
import { 
  Wifi, 
  Plus, 
  Trash2, 
  Edit3, 
  Activity, 
  Users, 
  DollarSign, 
  X,
  Gauge
} from "lucide-react";
import { InternetPlan } from "../types";

interface PlansViewProps {
  plans: InternetPlan[];
  onAddPlan: (p: InternetPlan) => void;
  onUpdatePlan: (p: InternetPlan) => void;
  onDeletePlan: (id: string) => void;
  showAddModal: boolean;
  onCloseAddModal: () => void;
}

export default function PlansView({
  plans,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
  showAddModal,
  onCloseAddModal
}: PlansViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<InternetPlan | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // New Plan form state
  const [name, setName] = useState("");
  const [speed, setSpeed] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");

  // Edit Plan form state
  const [editName, setEditName] = useState("");
  const [editSpeed, setEditSpeed] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !speed || !price) return;

    const newPlan: InternetPlan = {
      id: `plan-${name.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random() * 100)}`,
      name,
      speedMbps: parseInt(speed),
      price: parseFloat(price),
      activeSubscribers: 0,
      description: desc || "Layanan internet andalan pelanggan."
    };

    onAddPlan(newPlan);
    
    // reset form
    setName("");
    setSpeed("");
    setPrice("");
    setDesc("");
    onCloseAddModal();
  };

  const openEditModal = (p: InternetPlan) => {
    setSelectedPlan(p);
    setEditName(p.name);
    setEditSpeed(p.speedMbps.toString());
    setEditPrice(p.price.toString());
    setEditDesc(p.description);
    setShowEditModal(true);
  };

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const updated: InternetPlan = {
      ...selectedPlan,
      name: editName,
      speedMbps: parseInt(editSpeed),
      price: parseFloat(editPrice),
      description: editDesc
    };

    onUpdatePlan(updated);
    setShowEditModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Paket Layanan Internet</h1>
          <p className="text-sm text-slate-400 mt-1">
            Konfigurasi kecepatan bandwidth (Queue Limit) dan nominal tarif bulanan untuk pelanggan Anda.
          </p>
        </div>

        <button
          onClick={onCloseAddModal}
          className="bg-[#004CED] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-md shadow-blue-600/10 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Paket Baru</span>
        </button>
      </div>

      {/* Plans Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div 
            key={p.id} 
            className="bg-[#111A2E] border border-slate-800/80 hover:border-slate-700 transition-all rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group"
          >
            {/* Top section */}
            <div className="p-6 space-y-4">
              
              {/* Plan name & Icon */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Wifi className="w-6 h-6 stroke-[2]" />
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Ubah Paket"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (p.activeSubscribers > 0) {
                        alert(`Tidak dapat menghapus paket ini karena memiliki ${p.activeSubscribers} pelanggan aktif. Pindahkan pelanggan ke paket lain terlebih dahulu.`);
                        return;
                      }
                      if (confirm(`Apakah Anda yakin ingin menghapus paket layanan ${p.name}?`)) {
                        onDeletePlan(p.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                    title="Hapus Paket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Speed Tag */}
              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-white tracking-tight">
                  {p.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-400">
                  <Gauge className="w-4 h-4" />
                  <span>Bandwidth Speed: {p.speedMbps} Mbps</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>

            {/* Bottom section with pricing & subscriber counter */}
            <div className="p-6 bg-[#0D1526]/80 border-t border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Tarif Bulanan
                </span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  Rp {p.price.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-300 font-medium">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-white font-mono">{p.activeSubscribers}</span>
                <span className="text-slate-500">user</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE NEW PLAN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wifi className="text-blue-500 w-5 h-5" />
                <span>Tambah Paket Internet Baru</span>
              </h3>
              <button onClick={onCloseAddModal} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase">Nama Paket</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home Pro 150Mbps"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5 uppercase">Kecepatan (Mbps)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 150"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5 uppercase">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 500000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase">Deskripsi Paket</label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi singkat fitur paket..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/10"
                >
                  Simpan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="text-blue-500 w-5 h-5" />
                <span>Ubah Detail Paket</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePlan} className="p-6 space-y-4">
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5 uppercase">Kecepatan (Mbps)</label>
                    <input
                      type="number"
                      required
                      value={editSpeed}
                      onChange={(e) => setEditSpeed(e.target.value)}
                      className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5 uppercase">Harga Paket (Rp)</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase">Deskripsi Layanan</label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-2.5 rounded-xl text-slate-200 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/10"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
