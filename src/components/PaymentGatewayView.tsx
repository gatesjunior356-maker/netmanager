import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Shield, 
  Key, 
  Check, 
  Copy, 
  Globe, 
  Settings, 
  QrCode, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  ArrowUpRight, 
  AlertCircle, 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  RefreshCw,
  X,
  Smartphone,
  CheckCircle2,
  Lock,
  ChevronRight
} from "lucide-react";
import { Customer, CustomerStatus, Transaction, TransactionCategory, TransactionStatus, InternetPlan } from "../types";

interface PaymentGatewayViewProps {
  customers: Customer[];
  plans: InternetPlan[];
  onUpdateCustomer: (c: Customer) => void;
  onAddTransaction: (t: Transaction) => void;
}

interface GatewayConfig {
  merchantId: string;
  clientKey: string;
  serverKey: string;
  environment: "sandbox" | "production";
  webhookUrl: string;
}

interface GatewayTransaction {
  id: string;
  invoiceId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: "SETTLED" | "PENDING" | "EXPIRED";
}

export default function PaymentGatewayView({
  customers,
  plans,
  onUpdateCustomer,
  onAddTransaction
}: PaymentGatewayViewProps) {
  // Config state
  const [config, setConfig] = useState<GatewayConfig>(() => {
    const saved = localStorage.getItem("netmanager_gw_config");
    if (saved) return JSON.parse(saved);
    return {
      merchantId: "M-NET-88204",
      clientKey: "SB-Mid-client-8XfG92Kla9s",
      serverKey: "SB-Mid-server-zP83kJd8E91u",
      environment: "sandbox",
      webhookUrl: "https://netmanager.co/api/v1/payment-callback"
    };
  });

  useEffect(() => {
    localStorage.setItem("netmanager_gw_config", JSON.stringify(config));
  }, [config]);

  // Payment channels toggles
  const [channels, setChannels] = useState<{ [key: string]: boolean }>({
    qris: true,
    bca_va: true,
    mandiri_va: true,
    bri_va: true,
    bni_va: false,
    gopay: true,
    shopeepay: false,
    alfamart: false,
    indomaret: true
  });

  // State to track copied text
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Mock Gateway Transactions Ledger
  const [gatewayTxs, setGatewayTxs] = useState<GatewayTransaction[]>(() => {
    const saved = localStorage.getItem("netmanager_gw_transactions");
    if (saved) return JSON.parse(saved);
    return [
      { id: "PAY-99201", invoiceId: "INV-202310-04", customerName: "Budi Setiawan", amount: 150000, paymentMethod: "QRIS (Gopay)", date: "28 Okt 2023", status: "SETTLED" },
      { id: "PAY-99202", invoiceId: "INV-202310-09", customerName: "Hendra Wijaya", amount: 150000, paymentMethod: "BCA Virtual Account", date: "28 Okt 2023", status: "SETTLED" },
      { id: "PAY-99203", invoiceId: "INV-202310-14", customerName: "Siti Rahmawati", amount: 250000, paymentMethod: "Mandiri Virtual Account", date: "27 Okt 2023", status: "SETTLED" },
      { id: "PAY-99204", invoiceId: "INV-202310-21", customerName: "Diana Putri", amount: 150000, paymentMethod: "QRIS (OVO)", date: "28 Okt 2023", status: "PENDING" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("netmanager_gw_transactions", JSON.stringify(gatewayTxs));
  }, [gatewayTxs]);

  // Checkout Simulator State
  const [selectedCustId, setSelectedCustId] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("qris");
  const [showCheckout, setShowCheckout] = useState(false);
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"details" | "success">("details");
  const [timerSeconds, setTimerSeconds] = useState(1199); // 20 minutes countdown

  // Find customer selected for checkout
  const checkoutCustomer = customers.find(c => c.id === selectedCustId) || customers[0];
  const checkoutPlan = plans.find(p => p.id === checkoutCustomer?.planId) || plans[0];

  // Live countdown timer in checkout
  useEffect(() => {
    let interval: any = null;
    if (showCheckout && checkoutStep === "details") {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev > 0 ? prev - 1 : 1199));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showCheckout, checkoutStep]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  // Launch Checkout Modal
  const handleLaunchCheckout = () => {
    if (!selectedCustId) {
      alert("Silakan pilih pelanggan terlebih dahulu untuk meluncurkan simulator!");
      return;
    }
    setTimerSeconds(1199);
    setCheckoutStep("details");
    setShowCheckout(true);
  };

  // SIMULATE PAYMENT COMPLETED (WEBHOOK SIMULATOR)
  const handleSimulateWebhook = () => {
    setSimulatingPayment(true);
    
    setTimeout(() => {
      // 1. Add record to Gateway Transactions
      const refId = `PAY-99${Math.floor(100 + Math.random() * 900)}`;
      const invId = `INV-SIM-${Math.floor(10 + Math.random() * 90)}`;
      const price = checkoutPlan?.price || 150000;

      const newGatewayTx: GatewayTransaction = {
        id: refId,
        invoiceId: invId,
        customerName: checkoutCustomer.name,
        amount: price,
        paymentMethod: selectedMethod === "qris" ? "QRIS (OVO/Gopay)" : selectedMethod === "bca" ? "BCA Virtual Account" : "Mandiri Virtual Account",
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        status: "SETTLED"
      };

      setGatewayTxs(prev => [newGatewayTx, ...prev]);

      // 2. Update Customer's general status to ACTIVE (Aktif) in core app state
      const updatedCustomer: Customer = {
        ...checkoutCustomer,
        status: CustomerStatus.AKTIF,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) // Set billing due in 30 days
      };
      onUpdateCustomer(updatedCustomer);

      // 3. Add success transaction ledger entry to general financial statements
      const newLedgerTx: Transaction = {
        id: invId,
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        description: `Bayar Internet via Gateway (${selectedMethod.toUpperCase()}) - ${checkoutCustomer.name}`,
        category: TransactionCategory.BERLANGGANAN,
        amount: price,
        status: TransactionStatus.LUNAS
      };
      onAddTransaction(newLedgerTx);

      setSimulatingPayment(false);
      setCheckoutStep("success");
    }, 1500);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num).replace("Rp", "Rp ");
  };

  // Stats calculation
  const totalSettled = gatewayTxs
    .filter(t => t.status === "SETTLED")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = gatewayTxs.filter(t => t.status === "PENDING").length;

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-br from-[#121212] to-[#070707] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20" />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Billing Gateway Active
            </span>
            <span className="text-white/40 text-xs font-mono">• Midtrans / Xendit API Ready</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Payment Gateway & Tagihan Otomatis</h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-2xl leading-relaxed">
            Integrasikan tagihan bulanan RT/RW Net Anda dengan QRIS dan Virtual Account. Invoice terkirim via WhatsApp Gateway secara instan dan berubah status ke Lunas otomatis saat dibayar.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Omset via Gateway</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {formatIDR(totalSettled)}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Transaksi Tertunda</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {pendingCount} <span className="text-white/40 font-normal text-xs">Invoices</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Gateway Status</span>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1 uppercase">
              <Check className="w-3.5 h-3.5" /> SECURE SANDBOX
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0C0C0C]/80 border border-white/5 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Keberhasilan VA/QR</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              98.7% <span className="text-emerald-400 text-xs font-bold font-mono">↑ 0.3%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* API Credentials Settings Section */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Config Box */}
          <div className="bg-[#0C0C0C]/90 border border-white/5 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" /> API Credentials
            </h3>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Konfigurasi API Key dari dashboard Payment Gateway Anda (Midtrans/Xendit) untuk mengaktifkan sinkronisasi otomatis.
            </p>

            <div className="space-y-3.5 pt-2">
              {/* Env mode toggle */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1">Environment Mode</label>
                <div className="flex border border-white/5 bg-black/60 p-1 rounded-xl">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, environment: "sandbox" }))}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      config.environment === "sandbox" ? "bg-white/5 text-emerald-400 font-extrabold shadow" : "text-white/40"
                    }`}
                  >
                    SANDBOX (Test)
                  </button>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, environment: "production" }))}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      config.environment === "production" ? "bg-rose-500/10 text-rose-400 font-extrabold shadow" : "text-white/40"
                    }`}
                  >
                    PRODUCTION
                  </button>
                </div>
              </div>

              {/* Merchant ID */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1">Merchant ID</label>
                <div className="flex bg-black/40 border border-white/5 rounded-xl px-3 py-2 justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white/80">{config.merchantId}</span>
                  <button 
                    onClick={() => handleCopy(config.merchantId, "mid")}
                    className="p-1 hover:bg-white/5 rounded-lg transition-all text-white/30 hover:text-white"
                  >
                    {copiedField === "mid" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Client Key */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1">Client Key (Public)</label>
                <div className="flex bg-black/40 border border-white/5 rounded-xl px-3 py-2 justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white/50 truncate max-w-[200px]">{config.clientKey}</span>
                  <button 
                    onClick={() => handleCopy(config.clientKey, "ckey")}
                    className="p-1 hover:bg-white/5 rounded-lg transition-all text-white/30 hover:text-white shrink-0"
                  >
                    {copiedField === "ckey" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Webhook URL */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1">Webhook URL</label>
                <div className="flex bg-black/40 border border-white/5 rounded-xl px-3 py-2 justify-between items-center">
                  <span className="text-[10px] font-mono text-emerald-400 truncate max-w-[200px]">{config.webhookUrl}</span>
                  <button 
                    onClick={() => handleCopy(config.webhookUrl, "webhook")}
                    className="p-1 hover:bg-white/5 rounded-lg transition-all text-white/30 hover:text-white shrink-0"
                  >
                    {copiedField === "webhook" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[9px] text-white/30 mt-1 block">Pasang URL webhook di atas pada dashboard Midtrans untuk trigger callback otomatis.</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Active Switches */}
          <div className="bg-[#0C0C0C]/90 border border-white/5 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Channel Pembayaran
            </h3>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Aktifkan metode pembayaran instan yang diperbolehkan di sisi pelanggan.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { key: "qris", label: "QRIS (Gopay, OVO, Dana, LinkAja)" },
                { key: "bca_va", label: "BCA Virtual Account" },
                { key: "mandiri_va", label: "Mandiri Virtual Account" },
                { key: "bri_va", label: "BRI Virtual Account" },
                { key: "indomaret", label: "Gerai Ritel Indomaret / Alfamart" },
              ].map((channel) => (
                <label key={channel.key} className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-all select-none">
                  <span className="text-xs text-white/80 font-medium">{channel.label}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={channels[channel.key]}
                      onChange={() => setChannels(prev => ({ ...prev, [channel.key]: !prev[channel.key] }))}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-black after:border-white/20 after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-emerald-500" />
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Simulator & Log Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* LIVE CUSTOMER CHECKOUT SANDBOX/SIMULATOR */}
          <div className="bg-gradient-to-br from-[#121212]/90 to-black border border-white/5 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-x-10 -translate-y-10" />
            
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4.5 h-4.5 text-emerald-400" /> Checkout Simulator (Sandbox Testing)
            </h3>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">
              Pilih pelanggan yang berstatus <strong>Isolir</strong> atau <strong>Nonaktif</strong> di bawah, lalu simulasikan bagaimana sistem memproses pembayaran virtual account/QRIS secara otomatis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              {/* Step 1: Select Customer */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">1. Pilih Pelanggan</label>
                <select
                  value={selectedCustId}
                  onChange={(e) => setSelectedCustId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-semibold text-white outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="" className="bg-[#0C0C0C]">-- Pilih Pelanggan --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0C0C0C]">
                      [{c.id}] {c.name} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Method */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">2. Kanal Pembayaran</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-semibold text-white outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="qris" className="bg-[#0C0C0C]">QRIS (E-Wallet Instan)</option>
                  <option value="bca" className="bg-[#0C0C0C]">BCA Virtual Account</option>
                  <option value="mandiri" className="bg-[#0C0C0C]">Mandiri Virtual Account</option>
                </select>
              </div>

              {/* Step 3: Launch */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleLaunchCheckout}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-2.5 rounded-xl text-xs shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  Buka Portal Bayar
                </button>
              </div>
            </div>
          </div>

          {/* Gateway Transactions Ledger Log */}
          <div className="bg-[#0C0C0C]/90 border border-white/5 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs uppercase font-extrabold text-white/40 tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Jurnal Transaksi Gateway (Webhook Log)
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">Real-Time</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] text-white/40 uppercase tracking-wider">
                    <th className="py-3 px-5 font-bold">Ref ID / Inv</th>
                    <th className="py-3 px-5 font-bold">Pelanggan</th>
                    <th className="py-3 px-5 font-bold">Metode Bayar</th>
                    <th className="py-3 px-5 font-bold">Jumlah</th>
                    <th className="py-3 px-5 font-bold">Waktu Callback</th>
                    <th className="py-3 px-5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {gatewayTxs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="py-3.5 px-5">
                        <div className="font-mono text-white font-bold">{tx.id}</div>
                        <div className="text-[10px] text-white/40 font-semibold">{tx.invoiceId}</div>
                      </td>
                      <td className="py-3.5 px-5 font-medium text-white/80">
                        {tx.customerName}
                      </td>
                      <td className="py-3.5 px-5 text-white/60">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-white font-mono">
                        {formatIDR(tx.amount)}
                      </td>
                      <td className="py-3.5 px-5 text-white/40">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          tx.status === "SETTLED" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : tx.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Payment Checkout Modal (High-Fidelity Checkout Page simulation!) */}
      {showCheckout && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0C0C0C] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Top Security Banner */}
            <div className="bg-emerald-950/20 border-b border-emerald-500/20 px-5 py-3 flex items-center justify-between text-xs text-emerald-400">
              <div className="flex items-center gap-1.5 font-semibold">
                <Lock className="w-3.5 h-3.5" /> Secure Checkout 256-bit SSL
              </div>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutStep === "details" ? (
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                {/* Header brand */}
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Invoice Pembayaran Internet</div>
                  <h4 className="text-lg font-black text-white">Billing RT/RW Net</h4>
                </div>

                {/* Amount Summary */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-semibold">Total Tagihan</span>
                    <div className="text-xl font-mono font-black text-white mt-0.5">
                      {formatIDR(checkoutPlan?.price || 150000)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">Batas Waktu Pembayaran</span>
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-1 justify-end font-mono">
                      <Clock className="w-3.5 h-3.5 animate-pulse" /> {formatTimer(timerSeconds)}
                    </div>
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/40">ID Pelanggan</span>
                    <span className="text-white font-bold font-mono">{checkoutCustomer.id}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/40">Nama Pelanggan</span>
                    <span className="text-white font-bold">{checkoutCustomer.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/40">Paket Internet</span>
                    <span className="text-emerald-400 font-bold uppercase">{checkoutPlan?.name} ({checkoutPlan?.speedMbps} Mbps)</span>
                  </div>
                </div>

                {/* Checkout QR / VA render details */}
                <div className="py-4 flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-2xl">
                  {selectedMethod === "qris" ? (
                    <div className="space-y-4 text-center">
                      <span className="text-[10px] uppercase font-bold text-white/40">Scan QRIS dengan E-Wallet Anda</span>
                      
                      {/* Stylized QR placeholder */}
                      <div className="w-40 h-40 bg-white p-3 rounded-2xl flex items-center justify-center mx-auto shadow-xl relative">
                        <QrCode className="w-full h-full text-black" />
                        <div className="absolute inset-0 m-auto w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black border border-white shadow-lg">
                          QR
                        </div>
                      </div>
                      
                      <p className="text-[10px] text-white/50 max-w-xs mx-auto leading-relaxed">
                        Mendukung GoPay, OVO, ShopeePay, DANA, LinkAja, serta semua aplikasi M-Banking Indonesia.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full px-6 space-y-4 text-center">
                      <span className="text-[10px] uppercase font-bold text-white/40">Kirim Pembayaran ke Virtual Account BCA / Mandiri</span>
                      
                      <div className="bg-black border border-white/10 rounded-xl p-3 flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-[9px] text-white/40 uppercase font-bold">Nomor Virtual Account</span>
                          <div className="text-sm font-mono font-black text-white mt-0.5">88301 08{checkoutCustomer.phone?.replace(/[^0-9]/g, "").substring(0, 8)}</div>
                        </div>
                        <button
                          onClick={() => handleCopy(`88301 08${checkoutCustomer.phone?.replace(/[^0-9]/g, "").substring(0, 8)}`, "vabill")}
                          className="bg-white/5 hover:bg-white/10 text-white font-bold py-1 px-2.5 rounded text-[10px] transition-all flex items-center gap-1"
                        >
                          {copiedField === "vabill" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Salin
                        </button>
                      </div>

                      <div className="text-left text-[11px] text-white/50 space-y-1.5">
                        <p className="font-semibold text-white/80">Petunjuk Transfer M-Banking:</p>
                        <ol className="list-decimal pl-4 space-y-0.5">
                          <li>Buka aplikasi mobile banking Anda, pilih Transfer Ke Virtual Account.</li>
                          <li>Masukkan kode bayar VA di atas.</li>
                          <li>Periksa nama penerima billing cocok dengan nama Anda.</li>
                          <li>Masukkan PIN transfer untuk menyelesaikan pembayaran.</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                {/* DEVELOPER SIMULATOR WEBHOOK TRIGGER */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl leading-normal">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span><strong>Simulator Mode:</strong> Tekan tombol di bawah untuk menembakkan webhook transaksi berhasil ke server billing. Status invoice akan langsung berubah lunas secara real-time.</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateWebhook}
                    disabled={simulatingPayment}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-xl text-xs shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {simulatingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Mengirim Webhook Callback...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Simulasikan Pembayaran Lunas (Callback Webhook)
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success Checkout Onboarding Screen */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-white">Pembayaran Sukses!</h4>
                  <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
                    Koneksi internet untuk pelanggan <strong>{checkoutCustomer.name}</strong> telah diaktifkan kembali secara otomatis di router MikroTik.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl max-w-xs mx-auto text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/40">No. Invoice</span>
                    <span className="text-white font-mono font-bold">INV-SIM-{Math.floor(10 + Math.random() * 90)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Status Koneksi</span>
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-emerald-400" /> AKTIF
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Jatuh Tempo Baru</span>
                    <span className="text-white font-bold">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full bg-white text-black font-extrabold py-3 rounded-xl text-xs shadow hover:bg-white/90 transition-all cursor-pointer"
                >
                  Selesai & Tutup Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
