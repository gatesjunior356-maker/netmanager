import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { Transaction, TransactionCategory, TransactionStatus } from "../types";

interface ReportsViewProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  searchQuery: string;
}

export default function ReportsView({ transactions, onAddTransaction, searchQuery }: ReportsViewProps) {
  const [period, setPeriod] = useState<"bulan" | "kuartal" | "tahun">("bulan");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // For Adding Custom Transaction
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState<TransactionCategory>(TransactionCategory.BERLANGGANAN);
  const [newAmount, setNewAmount] = useState("");
  const [newStatus, setNewStatus] = useState<TransactionStatus>(TransactionStatus.LUNAS);
  const [isExpense, setIsExpense] = useState(false);

  // Static Monthly Cash Flow Data for the SVG chart
  const cashFlowData = [
    { month: "Mei", pendapatan: 85, pengeluaran: 30 },
    { month: "Jun", pendapatan: 95, pengeluaran: 25 },
    { month: "Jul", pendapatan: 110, pengeluaran: 45 },
    { month: "Agu", pendapatan: 115, pengeluaran: 35 },
    { month: "Sep", pendapatan: 120, pengeluaran: 40 },
    { month: "Okt", pendapatan: 124.5, pengeluaran: 32.4 }, // Oktober 2023 matching screenshot
  ];

  // Calculations based on actual transactions state
  const totalIncome = transactions
    .filter(t => t.amount > 0 && (t.status === TransactionStatus.LUNAS || t.status === TransactionStatus.SELESAI))
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingReceivable = transactions
    .filter(t => t.amount > 0 && t.status === TransactionStatus.TERTUNDA)
    .reduce((sum, t) => sum + t.amount, 0);

  const operationalCost = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // KPI constants formatted
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num).replace("Rp", "Rp ");
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    // Search query matching
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;

    // Status filter
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination constants
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const amountNum = parseFloat(newAmount) * (isExpense ? -1 : 1);
    const newTx: Transaction = {
      id: isExpense ? `PO-202310-0${Math.floor(Math.random() * 90) + 10}` : `INV-202310-0${Math.floor(Math.random() * 90) + 10}`,
      date: "28 Okt 2023",
      description: newDesc,
      category: newCat,
      amount: amountNum,
      status: newStatus
    };

    onAddTransaction(newTx);
    setNewDesc("");
    setNewAmount("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Header section with toggle periods */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Laporan Keuangan</h1>
          <p className="text-sm text-slate-400 mt-1">
            Ringkasan performa finansial bulan ini ({period === "bulan" ? "Oktober 2023" : period === "kuartal" ? "Kuartal IV" : "Tahun 2023"})
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="bg-[#121B2D] p-1 rounded-xl border border-slate-800 flex">
          <button
            onClick={() => setPeriod("bulan")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              period === "bulan" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setPeriod("kuartal")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              period === "kuartal" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Kuartal
          </button>
          <button
            onClick={() => setPeriod("tahun")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              period === "tahun" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tahun
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TOTAL PENDAPATAN */}
        <div className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-6 flex justify-between items-center relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Total Pendapatan
            </span>
            <div className="text-2xl font-black text-[#10B981] font-mono leading-none">
              {formatIDR(period === "bulan" ? 124500000 : period === "kuartal" ? 362400000 : totalIncome)}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#10B981] text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.5%</span>
              <span className="text-slate-400 font-normal">vs bulan lalu</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-[#10B981]">
            <DollarSign className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* PIUTANG TERTUNDA */}
        <div className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-6 flex justify-between items-center relative overflow-hidden group hover:border-red-500/30 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Piutang Tertunda
            </span>
            <div className="text-2xl font-black text-red-500 font-mono leading-none">
              {formatIDR(period === "bulan" ? 182500000 : period === "kuartal" ? 21500000 : pendingReceivable)}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>45 Pelanggan</span>
              <span className="text-slate-400 font-normal">belum bayar</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* BIAYA OPERASIONAL */}
        <div className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-6 flex justify-between items-center relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Biaya Operasional
            </span>
            <div className="text-2xl font-black text-slate-300 font-mono leading-none">
              {formatIDR(period === "bulan" ? 32400000 : period === "kuartal" ? 89000000 : operationalCost)}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-2.4%</span>
              <span className="text-slate-400 font-normal">vs bulan lalu</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
            <Layers className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

      </div>

      {/* Main Grid Content: Arus Kas Chart & Riwayat Transaksi Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cash Flow Chart Column (Arus Kas - 6 Bulan) */}
        <div className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                Arus Kas (6 Bulan)
              </h3>
              <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                  Pendapatan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />
                  Pengeluaran
                </span>
              </div>
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="relative h-64 flex items-end justify-between px-2 pt-6">
              {/* Grid Y Axis Helper lines */}
              <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col justify-between pointer-events-none text-[10px] text-slate-600 font-mono">
                <div className="border-t border-slate-800/80 w-full pt-1 flex justify-between">
                  <span>150j</span>
                </div>
                <div className="border-t border-slate-800/80 w-full pt-1 flex justify-between">
                  <span>100j</span>
                </div>
                <div className="border-t border-slate-800/80 w-full pt-1 flex justify-between">
                  <span>50j</span>
                </div>
                <div className="w-full border-t border-slate-700 mt-auto" />
              </div>

              {/* Render Bars side by side for each month */}
              <div className="w-full h-full flex items-end justify-around relative z-10">
                {cashFlowData.map((data, idx) => {
                  // Max value in chart scale is 150 (million)
                  const pHeightPercent = (data.pendapatan / 150) * 85; // capped below 100%
                  const exHeightPercent = (data.pengeluaran / 150) * 85;

                  const isHovered = hoveredMonth === data.month;

                  return (
                    <div 
                      key={idx} 
                      className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      onMouseEnter={() => setHoveredMonth(data.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      {/* Interactive Tooltip popup */}
                      {isHovered && (
                        <div className="absolute -top-4 bg-slate-900 border border-slate-800 text-[10px] text-slate-200 p-2 rounded-lg shadow-xl z-20 w-28 text-center">
                          <p className="font-bold border-b border-slate-800 pb-0.5 mb-1 text-slate-300">{data.month}</p>
                          <p className="text-emerald-400 font-mono">In: +{data.pendapatan}jt</p>
                          <p className="text-red-400 font-mono">Out: -{data.pengeluaran}jt</p>
                        </div>
                      )}

                      {/* Bar Group Wrapper */}
                      <div className="flex items-end gap-1 px-1">
                        {/* Pendapatan Bar (Green) */}
                        <div 
                          className="w-4 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-300 hover:brightness-110"
                          style={{ height: `${pHeightPercent}%`, minHeight: "6px" }}
                        />
                        {/* Pengeluaran Bar (Red) */}
                        <div 
                          className="w-4 bg-gradient-to-t from-red-600 to-red-400 rounded-t-sm transition-all duration-300 hover:brightness-110"
                          style={{ height: `${exHeightPercent}%`, minHeight: "4px" }}
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-[11px] font-bold text-slate-400 mt-2 font-mono">
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Rasio Efisiensi Operasional</span>
            <span className="font-bold text-emerald-400 font-mono">73.9% Sehat</span>
          </div>
        </div>

        {/* Transaction History Column */}
        <div className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-6 lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Table Header and Quick Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                Riwayat Transaksi
              </h3>

              <div className="flex flex-wrap gap-2">
                {/* Category selector */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-[#121B2D] border border-slate-800 hover:border-slate-700 text-xs text-slate-300 py-1.5 pl-3 pr-8 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value={TransactionCategory.BERLANGGANAN}>Berlangganan</option>
                    <option value={TransactionCategory.PEMELIHARAAN}>Pemeliharaan</option>
                    <option value={TransactionCategory.INSTALASI}>Instalasi</option>
                  </select>
                  <Filter className="w-3 h-3 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                </div>

                {/* Add transaction trigger */}
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all border border-blue-500/10"
                >
                  <Plus className="w-3 h-3" />
                  <span>Buat Transaksi</span>
                </button>
              </div>
            </div>

            {/* Quick Add Form Overlay */}
            {showAddForm && (
              <form onSubmit={handleAddTransaction} className="bg-[#0C1220] p-4 rounded-xl border border-blue-500/20 mb-6 space-y-3.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Tambah Transaksi Baru</span>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >
                    Batal
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Deskripsi</label>
                    <input
                      type="text"
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="e.g. Tagihan Internet PT. Maju"
                      className="w-full bg-[#121B2D] border border-slate-800 rounded-lg p-2 text-slate-200 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Kategori</label>
                    <select
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value as TransactionCategory)}
                      className="w-full bg-[#121B2D] border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                    >
                      <option value={TransactionCategory.BERLANGGANAN}>Berlangganan</option>
                      <option value={TransactionCategory.PEMELIHARAAN}>Pemeliharaan</option>
                      <option value={TransactionCategory.INSTALASI}>Instalasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Jumlah Nominal (Rp)</label>
                    <input
                      type="number"
                      required
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="e.g. 350000"
                      className="w-full bg-[#121B2D] border border-slate-800 rounded-lg p-2 text-slate-200 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Jenis Arus Kas</label>
                    <div className="flex items-center gap-4 py-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="tx_flow"
                          checked={!isExpense}
                          onChange={() => {
                            setIsExpense(false);
                            setNewStatus(TransactionStatus.LUNAS);
                          }}
                        />
                        <span>Pemasukan</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="tx_flow"
                          checked={isExpense}
                          onChange={() => {
                            setIsExpense(true);
                            setNewStatus(TransactionStatus.SELESAI);
                          }}
                        />
                        <span>Pengeluaran</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-4 rounded-lg text-xs"
                  >
                    Simpan Transaksi
                  </button>
                </div>
              </form>
            )}

            {/* High Density Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pt-1">Tanggal</th>
                    <th className="pb-3 pt-1">Deskripsi</th>
                    <th className="pb-3 pt-1 text-center">Kategori</th>
                    <th className="pb-3 pt-1 text-right">Jumlah (Rp)</th>
                    <th className="pb-3 pt-1 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                        Tidak ada transaksi yang cocok dengan pencarian / filter Anda.
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((tx) => {
                      const isIncome = tx.amount > 0;
                      
                      // Theme style colors matching screenshot status badge exactly
                      let statusBadge = "bg-emerald-500/10 text-emerald-400";
                      if (tx.status === TransactionStatus.TERTUNDA) {
                        statusBadge = "bg-amber-500/10 text-amber-400";
                      } else if (tx.status === TransactionStatus.JATUH_TEMPO) {
                        statusBadge = "bg-red-500/10 text-red-400";
                      } else if (tx.status === TransactionStatus.SELESAI) {
                        statusBadge = "bg-slate-500/10 text-slate-300";
                      }

                      // Kategori color codes
                      let catBadge = "bg-blue-500/10 text-blue-400 border border-blue-500/10";
                      if (tx.category === TransactionCategory.PEMELIHARAAN) {
                        catBadge = "bg-amber-500/10 text-amber-500 border border-amber-500/10";
                      } else if (tx.category === TransactionCategory.INSTALASI) {
                        catBadge = "bg-purple-500/10 text-purple-400 border border-purple-500/10";
                      }

                      return (
                        <tr key={tx.id} className="text-xs hover:bg-slate-800/20 group transition-all">
                          <td className="py-4 text-slate-400 font-mono leading-tight whitespace-nowrap pr-2">
                            {tx.date}
                          </td>
                          <td className="py-4 pr-3 max-w-[180px]">
                            <div className="font-bold text-slate-200 group-hover:text-white truncate">
                              {tx.description}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                              {tx.id}
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${catBadge}`}>
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-4 text-right font-black font-mono">
                            <span className={isIncome ? "text-[#10B981]" : "text-red-500"}>
                              {isIncome ? "+ " : "- "}
                              {Math.abs(tx.amount).toLocaleString("id-ID")}
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${statusBadge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                tx.status === TransactionStatus.LUNAS || tx.status === TransactionStatus.SELESAI ? 'bg-emerald-500' :
                                tx.status === TransactionStatus.TERTUNDA ? 'bg-amber-500' : 'bg-red-500'
                              }`} />
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t border-slate-800/80 gap-3 text-xs text-slate-400">
            <span>
              Menampilkan {filteredTransactions.length > 0 ? indexOfFirstItem + 1 : 0}-
              {Math.min(indexOfLastItem, filteredTransactions.length)} dari {filteredTransactions.length} data
            </span>

            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 bg-[#121B2D] border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-[#121B2D]"
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
                className="p-1.5 bg-[#121B2D] border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-[#121B2D]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
