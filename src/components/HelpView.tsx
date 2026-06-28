import React, { useState } from "react";
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Send, 
  Terminal, 
  Settings, 
  CheckCircle,
  Wifi
} from "lucide-react";

export default function HelpView() {
  const [supportMsg, setSupportMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSupportMsg("");
      alert("Pesan dukungan Anda berhasil dikirim ke NetManager ID Central Service! Agen dukungan kami akan menghubungi Anda via WhatsApp dalam waktu maksimal 15 menit.");
    }, 1000);
  };

  const guides = [
    {
      title: "Bagaimana cara menghubungkan Mikrotik Baru?",
      steps: [
        "Masuk ke Winbox Mikrotik Anda.",
        "Buka menu IP -> Services.",
        "Aktifkan service 'api' (port 8728) atau 'api-ssl' (port 8729).",
        "Di NetManager ID, buka Router Management, tambahkan IP Address router Anda, port API, beserta user & password login router."
      ]
    },
    {
      title: "Mengapa Status Pelanggan Terisolir (Isolir)?",
      steps: [
        "Status Isolir aktif ketika pelanggan melewati tanggal jatuh tempo pembayaran.",
        "Sistem otomatis memindahkan profil PPPoE/Hotspot pelanggan ke profile isolir di Mikrotik (misal profile 'isolir_netmanager').",
        "Gunakan tombol Kirim Tagihan WhatsApp untuk mengingatkan pelanggan."
      ]
    }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pusat Bantuan & Panduan</h1>
        <p className="text-sm text-slate-400 mt-1">
          Dapatkan panduan operasional teknis billing, dokumentasi skrip Mikrotik, dan hubungi tim dukungan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GUIDES COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                Panduan Cepat Konfigurasi
              </h3>
            </div>

            <div className="space-y-6">
              {guides.map((g, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>{g.title}</span>
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5 pl-1 leading-relaxed">
                    {g.steps.map((s, sIdx) => (
                      <li key={sIdx}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* MIKROTIK COMMANDS */}
          <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Terminal className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                Mikrotik CLI Skrip (Rekomendasi)
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-400 leading-normal">
                Jalankan skrip ini di Terminal Mikrotik untuk membuat Profile Isolir otomatis dengan pengalihan DNS (Redirect page):
              </p>
              
              <div className="bg-[#050B14] p-4 rounded-xl border border-slate-800/80 text-emerald-400 font-mono text-[11px] leading-relaxed select-all overflow-x-auto whitespace-pre">
                {`/ppp profile add name=isolir_netmanager local-address=10.254.254.1 \\
  remote-address=10.254.254.2 dns-server=10.254.254.1 \\
  rate-limit=128k/128k comment="Dibuat otomatis oleh NetManager ID"

/ip dns static add name=internet.murni address=10.254.254.1`}
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORT MESSAGE FORM */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              {/* WhatsApp brand green messaging color */}
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                Hubungi Support
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Mengalami kendala sinkronisasi router atau pengiriman WhatsApp? Kirimkan deskripsi masalah Anda langsung ke tim helpdesk kami.
            </p>

            <form onSubmit={handleSendMsg} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tulis Kendala Anda</label>
                <textarea
                  rows={5}
                  required
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="Sebutkan kendala Anda secara detail beserta ID pelanggan / IP router yang bermasalah..."
                  className="w-full bg-[#0C1222] border border-slate-800 focus:border-blue-500 p-3 rounded-xl text-slate-200 outline-none resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#004CED] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pertanyaan</span>
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
            NetManager ID Support Line • WhatsApp Gateway: +62 812-3456-7890
          </div>
        </div>

      </div>

    </div>
  );
}
