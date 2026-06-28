import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, X, ShieldCheck, AlertCircle } from "lucide-react";
import { 
  Customer, 
  CustomerStatus, 
  InternetPlan, 
  Transaction, 
  TransactionStatus, 
  TransactionCategory, 
  RouterNode 
} from "./types";
import { 
  initialCustomers, 
  initialPlans, 
  initialTransactions, 
  initialRouters 
} from "./mockData";
import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardOverview from "./components/DashboardOverview";
import CustomersView from "./components/CustomersView";
import PlansView from "./components/PlansView";
import ReportsView from "./components/ReportsView";
import RoutersView from "./components/RoutersView";
import SettingsView from "./components/SettingsView";
import HelpView from "./components/HelpView";

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("netmanager_logged") === "true";
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("netmanager_user") || "admin@netmanager";
  });

  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Mobile sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // ISP Brand Customization States
  const [ispName, setIspName] = useState<string>(() => {
    return localStorage.getItem("netmanager_isp_name") || "NETMANAGER";
  });
  const [ispTagline, setIspTagline] = useState<string>(() => {
    return localStorage.getItem("netmanager_isp_tagline") || "WiFi Billing Solutions";
  });
  const [ispLogoIcon, setIspLogoIcon] = useState<string>(() => {
    return localStorage.getItem("netmanager_isp_logo") || "Wifi";
  });
  const [ispColor, setIspColor] = useState<string>(() => {
    return localStorage.getItem("netmanager_isp_color") || "#C5A059";
  });

  // Subscription States
  const [subPlan, setSubPlan] = useState<string>(() => {
    return localStorage.getItem("netmanager_sub_plan") || "trial";
  });
  const [subExpiryDate, setSubExpiryDate] = useState<string>(() => {
    if (!localStorage.getItem("netmanager_sub_expiry")) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    }
    return localStorage.getItem("netmanager_sub_expiry") || "";
  });
  const [subStatus, setSubStatus] = useState<string>(() => {
    return localStorage.getItem("netmanager_sub_status") || "active";
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("netmanager_isp_name", ispName);
  }, [ispName]);

  useEffect(() => {
    localStorage.setItem("netmanager_isp_tagline", ispTagline);
  }, [ispTagline]);

  useEffect(() => {
    localStorage.setItem("netmanager_isp_logo", ispLogoIcon);
  }, [ispLogoIcon]);

  useEffect(() => {
    localStorage.setItem("netmanager_isp_color", ispColor);
  }, [ispColor]);

  useEffect(() => {
    localStorage.setItem("netmanager_sub_plan", subPlan);
  }, [subPlan]);

  useEffect(() => {
    localStorage.setItem("netmanager_sub_expiry", subExpiryDate);
  }, [subExpiryDate]);

  useEffect(() => {
    localStorage.setItem("netmanager_sub_status", subStatus);
  }, [subStatus]);

  // Global search query
  const [searchQuery, setSearchQuery] = useState("");

  // Persistent Domain States (loaded from localStorage or defaults)
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("netmanager_customers");
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [plans, setPlans] = useState<InternetPlan[]>(() => {
    const saved = localStorage.getItem("netmanager_plans");
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("netmanager_transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [routers, setRouters] = useState<RouterNode[]>(() => {
    const saved = localStorage.getItem("netmanager_routers");
    return saved ? JSON.parse(saved) : initialRouters;
  });

  // Modals / Overlays triggers
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showAddRouterModal, setShowAddRouterModal] = useState(false);

  // Sync to local storage on any state change
  useEffect(() => {
    localStorage.setItem("netmanager_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("netmanager_plans", JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem("netmanager_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("netmanager_routers", JSON.stringify(routers));
  }, [routers]);

  // Handle Login and Logout
  const handleLoginSuccess = (email: string, selectedPlan?: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("netmanager_logged", "true");
    localStorage.setItem("netmanager_user", email);
    
    if (selectedPlan) {
      setSubPlan(selectedPlan);
      const days = selectedPlan === "trial" ? 7 : selectedPlan === "bulanan" ? 30 : 365;
      const date = new Date();
      date.setDate(date.getDate() + days);
      const expiryStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      setSubExpiryDate(expiryStr);
      setSubStatus("active");
    }
  };

  const handleUpgradeSubscription = (plan: string) => {
    setSubPlan(plan);
    const days = plan === "trial" ? 7 : plan === "bulanan" ? 30 : 365;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const expiryStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    setSubExpiryDate(expiryStr);
    setSubStatus("active");
    
    // Add a mockup subscription invoice to transaction history to make the database feel alive!
    const price = plan === "bulanan" ? 149000 : plan === "tahunan" ? 1190000 : 0;
    const newInvoice: Transaction = {
      id: `INV-SUB-0${Math.floor(Math.random() * 90) + 10}`,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      description: `Upgrade Paket Layanan - ${plan === "bulanan" ? "Paket Bulanan" : plan === "tahunan" ? "Paket Tahunan" : "Trial 7 Hari"}`,
      category: TransactionCategory.BERLANGGANAN,
      amount: price,
      status: TransactionStatus.LUNAS
    };
    setTransactions(prev => [newInvoice, ...prev]);
    
    alert(`Selamat! Anda berhasil beralih ke ${plan === "bulanan" ? "Paket Bulanan" : plan === "tahunan" ? "Paket Tahunan" : "Trial 7 Hari"}.\n\nInvoice pembayaran Anda telah dicatat di menu Transaksi.`);
    setShowUpgradeModal(false);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      setIsLoggedIn(false);
      localStorage.setItem("netmanager_logged", "false");
    }
  };

  // Trigger Mock Report Download
  const handleDownloadReport = () => {
    alert("Menyiapkan dokumen PDF Laporan Keuangan...\n\nSistem berhasil menghasilkan file 'NetManager_Financial_Report_Oktober_2023.pdf' dan mengunduhnya ke komputer Anda secara lokal.");
  };

  // Dynamic synchronizer: updates active subscribers count for each plan
  const syncPlanSubscribers = (currentCustomers: Customer[], currentPlans: InternetPlan[]) => {
    return currentPlans.map(plan => {
      const activeCount = currentCustomers.filter(c => c.planId === plan.id && c.status === CustomerStatus.AKTIF).length;
      return {
        ...plan,
        activeSubscribers: activeCount
      };
    });
  };

  // CUSTOMERS OPERATIONS
  const handleAddCustomer = (newCustomer: Customer) => {
    const updatedCustomers = [newCustomer, ...customers];
    setCustomers(updatedCustomers);
    
    // Auto increment plan subscriber count and record initial transaction
    setPlans(prevPlans => syncPlanSubscribers(updatedCustomers, prevPlans));

    // Register initial billing invoice
    const plan = plans.find(p => p.id === newCustomer.planId);
    if (plan) {
      const newInvoice: Transaction = {
        id: `INV-202310-0${Math.floor(Math.random() * 90) + 10}`,
        date: "28 Okt 2023",
        description: `Tagihan Registrasi Awal - ${newCustomer.name}`,
        category: TransactionCategory.BERLANGGANAN,
        amount: plan.price,
        status: newCustomer.status === CustomerStatus.AKTIF ? TransactionStatus.LUNAS : TransactionStatus.TERTUNDA
      };
      setTransactions(prev => [newInvoice, ...prev]);
    }
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    const updatedCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
    setCustomers(updatedCustomers);
    setPlans(prevPlans => syncPlanSubscribers(updatedCustomers, prevPlans));
  };

  const handleDeleteCustomer = (customerId: string) => {
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    setCustomers(updatedCustomers);
    setPlans(prevPlans => syncPlanSubscribers(updatedCustomers, prevPlans));
  };

  // INTERNET PLANS OPERATIONS
  const handleAddPlan = (newPlan: InternetPlan) => {
    setPlans([newPlan, ...plans]);
  };

  const handleUpdatePlan = (updatedPlan: InternetPlan) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
  };

  // ROUTER NODES OPERATIONS
  const handleAddRouter = (newRouter: RouterNode) => {
    setRouters([...routers, newRouter]);
  };

  const handleUpdateRouter = (updatedRouter: RouterNode) => {
    setRouters(routers.map(r => r.id === updatedRouter.id ? updatedRouter : r));
  };

  const handleDeleteRouter = (routerId: string) => {
    setRouters(routers.filter(r => r.id !== routerId));
  };

  // TRANSACTION LEDGER OPERATIONS
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  // Conditional rendering for active main screen
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview 
            customers={customers} 
            routers={routers} 
            plans={plans} 
            onNavigate={setActiveTab} 
            subPlan={subPlan}
            subExpiryDate={subExpiryDate}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        );
      case "pelanggan":
        return (
          <CustomersView
            customers={customers}
            plans={plans}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            searchQuery={searchQuery}
            showAddModal={showAddCustomerModal}
            onCloseAddModal={() => setShowAddCustomerModal(!showAddCustomerModal)}
          />
        );
      case "paket":
        return (
          <PlansView
            plans={plans}
            onAddPlan={handleAddPlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
            showAddModal={showAddPlanModal}
            onCloseAddModal={() => setShowAddPlanModal(!showAddPlanModal)}
          />
        );
      case "transaksi":
      case "laporan":
        return (
          <ReportsView
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            searchQuery={searchQuery}
          />
        );
      case "router":
        return (
          <RoutersView
            routers={routers}
            onAddRouter={handleAddRouter}
            onUpdateRouter={handleUpdateRouter}
            onDeleteRouter={handleDeleteRouter}
            searchQuery={searchQuery}
            showAddForm={showAddRouterModal}
            onCloseAddForm={() => setShowAddRouterModal(!showAddRouterModal)}
          />
        );
      case "pengaturan":
        return (
          <SettingsView 
            ispName={ispName}
            setIspName={setIspName}
            ispTagline={ispTagline}
            setIspTagline={setIspTagline}
            ispLogoIcon={ispLogoIcon}
            setIspLogoIcon={setIspLogoIcon}
            ispColor={ispColor}
            setIspColor={setIspColor}
          />
        );
      case "help":
        return <HelpView />;
      default:
        return (
          <DashboardOverview 
            customers={customers} 
            routers={routers} 
            plans={plans} 
            onNavigate={setActiveTab} 
            subPlan={subPlan}
            subExpiryDate={subExpiryDate}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        );
    }
  };

  // Render Login Screen if not authenticated
  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLoginSuccess={handleLoginSuccess} 
        ispName={ispName}
        ispTagline={ispTagline}
        ispLogoIcon={ispLogoIcon}
        ispColor={ispColor}
      />
    );
  }

  return (
    <div className="flex bg-[#050505] min-h-screen text-white selection:bg-[#C5A059] selection:text-black">
      
      {/* Fixed Left Sidebar Column */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery(""); // clear search on tab shift
        }}
        onAddCustomerClick={() => {
          setActiveTab("pelanggan");
          setShowAddCustomerModal(true);
        }}
        onLogout={handleLogout}
        ispName={ispName}
        ispTagline={ispTagline}
        ispLogoIcon={ispLogoIcon}
        ispColor={ispColor}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        subPlan={subPlan}
        subExpiryDate={subExpiryDate}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Global Navigation Header */}
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onDownloadReport={handleDownloadReport}
          onAddPackageClick={() => {
            setActiveTab("paket");
            setShowAddPlanModal(true);
          }}
          onAddRouterClick={() => {
            setActiveTab("router");
            setShowAddRouterModal(true);
          }}
          userEmail={userEmail}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Inner Panel Body */}
        <main className="flex-grow p-4 sm:p-8 max-w-[1440px] w-full mx-auto overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Subscription Upgrade/Renewal Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl bg-[#0C0C0C] border border-white/5 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Upgrade & Perpanjang Lisensi
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-3">Layanan Billing RT/RW Net</h3>
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                Tingkatkan sistem tagihan Anda untuk membuka integrasi penuh, kelola multi-router tanpa batasan, dan dapatkan support prioritas.
              </p>
            </div>

            {/* Current Package Box */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-semibold">Paket Saat Ini</span>
                <div className="text-sm font-bold text-white mt-0.5 uppercase">
                  {subPlan === "trial" ? "Trial 7 Hari" : subPlan === "bulanan" ? "Paket Bulanan Premium" : "Paket Tahunan Enterprise"}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase font-semibold">Masa Berlaku</span>
                <div className="text-sm font-medium text-white/80 mt-0.5">
                  s/d <span className="text-white font-bold">{subExpiryDate}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase font-semibold">Status</span>
                <div className="text-xs mt-0.5 font-bold flex items-center gap-1 text-emerald-400 uppercase">
                  <ShieldCheck className="w-4 h-4 shrink-0 animate-pulse" /> {subStatus}
                </div>
              </div>
            </div>

            {/* Plans List inside modal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* TRIAL */}
              <div className="bg-black/40 border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-full">Uji Coba</span>
                  <h4 className="text-base font-bold text-white mt-3 uppercase">Trial 7 Hari</h4>
                  <p className="text-[11px] text-white/40 mt-1">Gunakan trial gratis untuk pengetesan awal.</p>
                  
                  <div className="my-5">
                    <span className="text-2xl font-extrabold text-white">Rp 0</span>
                    <span className="text-[10px] text-white/40 ml-1">/ 7 Hari</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-white/70">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/40" />
                      <span>1 Router MikroTik</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/40" />
                      <span>Maks 20 Pelanggan</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/40" />
                      <span>WA Billing Manual</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeSubscription("trial")}
                  disabled={subPlan === "trial"}
                  className="w-full mt-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs disabled:opacity-30 cursor-pointer"
                >
                  {subPlan === "trial" ? "Aktif" : "Kembali ke Trial"}
                </button>
              </div>

              {/* BULANAN */}
              <div className="bg-black/40 border border-[#C5A059]/30 p-5 rounded-2xl flex flex-col justify-between relative shadow-lg">
                <span className="absolute -top-2.5 right-4 text-[8px] font-extrabold uppercase tracking-widest bg-[#C5A059] text-black px-2.5 py-1 rounded-full">Terpopuler</span>
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full">Rekomendasi</span>
                  <h4 className="text-base font-bold text-white mt-3 uppercase">Paket Bulanan</h4>
                  <p className="text-[11px] text-white/40 mt-1">Lengkap, otomatis & fleksibel untuk RT/RW Net.</p>
                  
                  <div className="my-5">
                    <span className="text-2xl font-extrabold text-white">Rp 149.000</span>
                    <span className="text-[10px] text-white/40 ml-1">/ Bulan</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-white/70">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C5A059]" />
                      <span>Hingga 5 Router MikroTik</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C5A059]" />
                      <span>Unlimited Pelanggan PPPoE</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C5A059]" />
                      <span>WhatsApp Gateway Otomatis</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C5A059]" />
                      <span>Isolir Otomatis Pelanggan</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeSubscription("bulanan")}
                  className="w-full mt-6 bg-[#C5A059] hover:bg-[#D4B069] text-black font-extrabold py-2 rounded-xl text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer"
                >
                  {subPlan === "bulanan" ? "Perpanjang Layanan" : "Pilih Paket Bulanan"}
                </button>
              </div>

              {/* TAHUNAN */}
              <div className="bg-black/40 border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Hemat 33%</span>
                  <h4 className="text-base font-bold text-white mt-3 uppercase">Paket Tahunan</h4>
                  <p className="text-[11px] text-white/40 mt-1">Investasi cerdas jangka panjang & backup selamanya.</p>
                  
                  <div className="my-5">
                    <span className="text-2xl font-extrabold text-white">Rp 1.190.000</span>
                    <span className="text-[10px] text-white/40 ml-1">/ Tahun</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-white/70">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
                      <span>Unlimited Router & Server</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
                      <span>Unlimited Pelanggan Aktif</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
                      <span>Support Prioritas WA 24/7</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
                      <span>Free Konsultasi Jaringan</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeSubscription("tahunan")}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer"
                >
                  {subPlan === "tahunan" ? "Perpanjang Layanan" : "Pilih Paket Tahunan"}
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/30 justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Pembayaran diproses dengan enkripsi SSL 256-bit aman. Transfer Bank & QRIS otomatis diverifikasi instan.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
