import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Lock, 
  User, 
  Wifi, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Cpu,
  Network,
  CreditCard,
  Building2,
  LockKeyhole,
  Check
} from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (email: string, selectedPlan?: string) => void;
  ispName: string;
  ispTagline: string;
  ispLogoIcon: string;
  ispColor: string;
}

export default function LoginScreen({ 
  onLoginSuccess,
  ispName,
  ispTagline,
  ispLogoIcon,
  ispColor
}: LoginScreenProps) {
  // Mode: 'login' | 'plans' | 'register'
  const [mode, setMode] = useState<'login' | 'plans' | 'register'>('login');
  
  // Form states
  const [username, setUsername] = useState("admin@netmanager");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register state
  const [regFullName, setRegFullName] = useState("");
  const [regIspName, setRegIspName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<'trial' | 'bulanan' | 'tahunan'>('trial');

  // Loading sequence steps for beautiful onboarding simulation
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate real auth delay
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(username);
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regFullName || !regIspName) {
      setError("Seluruh kolom wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    setOnboardingStep(1);

    // Dynamic steps simulation
    setTimeout(() => {
      setOnboardingStep(2);
      setTimeout(() => {
        setOnboardingStep(3);
        setTimeout(() => {
          setOnboardingStep(4);
          setTimeout(() => {
            setIsSubmitting(false);
            onLoginSuccess(regEmail, selectedPlanId);
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  // Dynamic Lucide icon lookup for customizable logo
  const LogoIcon = (LucideIcons as any)[ispLogoIcon] || Wifi;

  const plans = [
    {
      id: "trial" as const,
      name: "Trial 7 Hari",
      price: "Gratis",
      period: "Selama 7 Hari",
      desc: "Sempurna untuk menguji keandalan sistem NetManager dengan router tunggal Anda.",
      features: [
        "1 Router Aktif Terhubung",
        "Maksimal 20 Pelanggan Aktif",
        "WhatsApp Billing Alert Manual",
        "Monitor Trafik Jaringan",
        "Backup Database Lokal",
        "Support via Grup Komunitas"
      ],
      badge: "Uji Coba",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    },
    {
      id: "bulanan" as const,
      name: "Paket Bulanan",
      price: "Rp 149.000",
      period: "/ Bulan",
      desc: "Solusi lengkap, otomatis, dan fleksibel untuk mengembangkan bisnis RT/RW Net Anda.",
      features: [
        "Hingga 5 Router MikroTik",
        "Unlimited Pelanggan PPPoE/Hotspot",
        "Auto Isolate / Isolir Otomatis",
        "Auto WhatsApp Billing Gateway",
        "Rekap Laporan Keuangan Bulanan",
        "Backup Harian Cloud Otomatis",
        "Premium Email & Chat Support"
      ],
      badge: "Paling Populer",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      popular: true
    },
    {
      id: "tahunan" as const,
      name: "Paket Tahunan",
      price: "Rp 1.190.000",
      period: "/ Tahun",
      desc: "Investasi cerdas jangka panjang dengan prioritas performa, konsultasi gratis, & backup seumur hidup.",
      features: [
        "Unlimited Router & Server Node",
        "Unlimited Pelanggan Aktif",
        "Semua Fitur Bulanan Premium",
        "Support Prioritas WhatsApp 24/7",
        "Free Konsultasi Topologi Jaringan",
        "Lisensi Backup Permanen",
        "Hemat 33% Biaya Bulanan"
      ],
      badge: "Hemat 33%",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    }
  ];

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-y-auto py-12 px-4"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, #151515 0%, #050505 100%),
          linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 32px 32px, 32px 32px"
      }}
    >
      {/* Decorative ambient background glows using customizable brand color */}
      <div 
        style={{ backgroundColor: `${ispColor}0A` }} // very transparent
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        style={{ backgroundColor: `${ispColor}05` }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Onboarding Setup Simulation Overlay */}
      {isSubmitting && onboardingStep > 0 && (
        <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C0C0C] border border-white/5 p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
            <div 
              className="w-16 h-16 rounded-2xl rotate-45 flex items-center justify-center mx-auto mb-8 shadow-xl animate-pulse"
              style={{ backgroundColor: ispColor }}
            >
              <LogoIcon className="-rotate-45 w-8 h-8 text-black stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Mengonfigurasi Akun Anda</h3>
            <p className="text-xs text-white/40 mb-8 uppercase tracking-widest font-mono">Jangan tutup halaman ini</p>

            {/* Steps Timeline Indicator */}
            <div className="space-y-4 max-w-xs mx-auto text-left">
              {[
                "Mendaftarkan kredensial admin sistem...",
                "Menyiapkan container database terisolasi...",
                "Sinkronisasi lisensi billing PPPoE...",
                "Hampir selesai! Membuka dashboard..."
              ].map((stepText, idx) => {
                const currentStepNum = idx + 1;
                const isDone = onboardingStep > currentStepNum;
                const isCurrent = onboardingStep === currentStepNum;

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                        isDone 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                          : isCurrent 
                          ? "animate-spin border-transparent" 
                          : "border-white/5 text-white/20"
                      }`}
                      style={isCurrent ? { borderTopColor: ispColor } : {}}
                    >
                      {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : !isCurrent ? currentStepNum : null}
                    </div>
                    <span className={`text-xs ${isDone ? "text-white/60" : isCurrent ? "text-white font-semibold" : "text-white/20"}`}>
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className={`w-full z-10 transition-all duration-300 ${mode === 'plans' ? 'max-w-6xl' : 'max-w-md'}`}>
        
        {/* LOGO AND BRAND HEADER */}
        {mode !== 'plans' && (
          <div className="flex flex-col items-center mb-8 text-center">
            <div 
              style={{ backgroundColor: ispColor }}
              className="w-12 h-12 rounded-xl rotate-45 flex items-center justify-center mb-6 shadow-xl shadow-black/40 transition-all duration-300"
            >
              <LogoIcon className="-rotate-45 w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans uppercase">
              {ispName}<span style={{ color: ispColor }}>.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-2 block font-bold font-sans">
              {ispTagline}
            </p>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' && (
          <div className="bg-[#0C0C0C]/95 border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">Selamat Datang Kembali</h2>
              <p className="text-xs text-white/40 mt-1">Masuk untuk mengelola tagihan & router MikroTik Anda.</p>
            </div>

            <form onSubmit={handleSubmitLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-950/30 border border-red-900/50 text-red-200 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Username / Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-[#111] border border-white/5 focus:border-[#C5A059] focus:ring-1 focus:ring-white/10 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                    placeholder="admin@netmanager"
                    style={{ focusBorderColor: ispColor }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-[#111] border border-white/5 focus:border-[#C5A059] focus:ring-1 focus:ring-white/10 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center text-white/40 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 rounded border-white/10 bg-[#111] focus:ring-1"
                  />
                  Ingat Saya
                </label>
                <button 
                  type="button" 
                  onClick={() => alert("Silakan hubungi administrator IT untuk mereset password Anda.")}
                  style={{ color: ispColor }}
                  className="hover:brightness-110 transition-colors cursor-pointer text-xs font-medium"
                >
                  Lupa Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: ispColor }}
                className="w-full mt-2 text-black font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
              >
                {isSubmitting ? "Menghubungkan..." : "Masuk ke Dashboard"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <span className="text-xs text-white/40">Belum memiliki akun billing?</span>
              <button 
                onClick={() => {
                  setError("");
                  setMode('plans');
                }}
                style={{ color: ispColor }}
                className="ml-1.5 text-xs font-bold hover:brightness-110 underline transition-all cursor-pointer"
              >
                Mulai Registrasi & Langganan
              </button>
            </div>

            {/* Footer encryption note */}
            <div className="mt-8 pt-4 border-t border-white/5 text-center">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
                Sistem Terenkripsi • Akses tidak sah dilarang
              </p>
            </div>
          </div>
        )}

        {/* MODE 2: SUBSCRIPTION PLANS SELECTION */}
        {mode === 'plans' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <div 
                style={{ backgroundColor: ispColor }}
                className="w-12 h-12 rounded-xl rotate-45 flex items-center justify-center mb-6 shadow-xl"
              >
                <LogoIcon className="-rotate-45 w-6 h-6 text-black stroke-[2.5]" />
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Pilih Paket Layanan Billing RT/RW Net
              </h1>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Kelola ribuan pelanggan PPPoE, Hotspot voucher, integrasi WhatsApp Gateway, isolir otomatis, dan rekap keuangan lengkap dalam satu sistem terpusat.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`bg-[#0C0C0C]/90 border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                    plan.popular 
                      ? "border-slate-500 shadow-2xl shadow-black/50 md:-translate-y-2" 
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  {/* Popular label / standard label */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                    {plan.popular && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Recommended
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white uppercase">{plan.name}</h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed min-h-[48px]">{plan.desc}</p>

                    {/* Price section */}
                    <div className="my-6 border-y border-white/5 py-4">
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-xs text-white/40 ml-1.5 font-medium">{plan.period}</span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Keuntungan & Fitur:</span>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-white/70">
                          <CheckCircle2 style={{ color: ispColor }} className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Action */}
                  <button
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setMode('register');
                    }}
                    style={plan.popular ? { backgroundColor: ispColor, color: "#000" } : { borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
                    className={`w-full mt-8 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 ${
                      plan.popular ? "shadow-lg" : "border hover:bg-white/5"
                    }`}
                  >
                    <span>Mulai Dengan {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Back button */}
            <div className="text-center pt-4">
              <button 
                onClick={() => setMode('login')}
                className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Login</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: REGISTRATION FORM */}
        {mode === 'register' && (
          <div className="bg-[#0C0C0C]/95 border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-md animate-fade-in">
            {/* Header with chosen plan status */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Buat Akun Administrator</h2>
                <p className="text-xs text-white/40 mt-1">Lengkapi data untuk meluncurkan billing system Anda.</p>
              </div>
              <button 
                onClick={() => setMode('plans')}
                className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 hover:brightness-110 cursor-pointer"
              >
                Ganti Paket
              </button>
            </div>

            {/* Current Chosen Plan Info Bar */}
            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-semibold">Paket Terpilih</span>
                <div className="text-xs font-bold text-white mt-0.5">
                  {selectedPlanId === 'trial' ? "Trial 7 Hari" : selectedPlanId === 'bulanan' ? "Paket Bulanan" : "Paket Tahunan"}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 uppercase font-semibold">Harga</span>
                <div className="text-xs font-bold text-[#C5A059] mt-0.5">
                  {selectedPlanId === 'trial' ? "Gratis" : selectedPlanId === 'bulanan' ? "Rp 149.000 / bln" : "Rp 1.190.000 / thn"}
                </div>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/30 border border-red-900/50 text-red-200 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Pemilik
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/5 focus:border-[#C5A059] focus:ring-1 focus:ring-white/10 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                    placeholder="Budi Setiawan"
                  />
                </div>
              </div>

              {/* ISP Brand Name */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  Nama RT/RW Net / Brand ISP
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={regIspName}
                    onChange={(e) => setRegIspName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/5 focus:border-[#C5A059] focus:ring-1 focus:ring-white/10 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                    placeholder="BUDI NET"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  Alamat Email Administrator
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/5 focus:border-[#C5A059] focus:ring-1 focus:ring-white/10 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                    placeholder="budi@myisp.net"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <LockKeyhole className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/5 focus:border-[#C5A059] focus:ring-1 focus:ring-white/10 rounded-xl text-sm text-white placeholder-white/20 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Agreement */}
              <p className="text-[10px] text-white/40 leading-normal">
                Dengan mengklik tombol di bawah, Anda menyetujui Ketentuan Layanan, Kebijakan Privasi, dan bersedia memulai {selectedPlanId === 'trial' ? "uji coba gratis" : "pembayaran lisensi"} untuk brand {regIspName || "ISP Anda"}.
              </p>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: ispColor }}
                className="w-full mt-2 text-black font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
              >
                <span>{selectedPlanId === 'trial' ? "Mulai Uji Coba Gratis Sekarang" : "Proses Pembayaran & Luncurkan"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Link to login */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <span className="text-xs text-white/40">Sudah memiliki akun billing?</span>
              <button 
                onClick={() => setMode('login')}
                style={{ color: ispColor }}
                className="ml-1.5 text-xs font-bold hover:brightness-110 underline transition-all cursor-pointer"
              >
                Kembali ke Form Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
