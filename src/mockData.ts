import { 
  Customer, 
  CustomerStatus, 
  MikrotikStatus, 
  InternetPlan, 
  Transaction, 
  TransactionStatus, 
  TransactionCategory, 
  RouterNode 
} from "./types";

export const initialPlans: InternetPlan[] = [
  {
    id: "plan-basic",
    name: "Home Basic 20Mbps",
    speedMbps: 20,
    price: 200000,
    activeSubscribers: 54,
    description: "Koneksi stabil hemat untuk browsing, musik, dan streaming SD."
  },
  {
    id: "plan-pro",
    name: "Home Pro 50Mbps",
    speedMbps: 50,
    price: 350000,
    activeSubscribers: 1102,
    description: "Favorit keluarga! Cocok untuk streaming 4K, WFH, dan gaming lancar."
  },
  {
    id: "plan-biz",
    name: "Biz Lite 100Mbps",
    speedMbps: 100,
    price: 850000,
    activeSubscribers: 84,
    description: "Bandwidth besar simetris dengan garansi uptime prima untuk kebutuhan kantor."
  }
];

export const initialCustomers: Customer[] = [
  {
    id: "CUST-10928",
    name: "Budi Santoso",
    address: "Jl. Melati No. 45, Kebon Jeruk, Jakarta Barat",
    planId: "plan-pro",
    status: CustomerStatus.AKTIF,
    mikrotikStatus: MikrotikStatus.CONNECTED,
    server: "Mikrotik 01 - Pusat",
    dueDate: "15 Okt 2023",
    phone: "081234567890",
    ipAddress: "192.168.1.15"
  },
  {
    id: "CUST-10933",
    name: "Anita Wijaya",
    address: "Perumahan Asri Blok C No. 12, Serpong, Tangerang",
    planId: "plan-basic",
    status: CustomerStatus.ISOLIR,
    mikrotikStatus: MikrotikStatus.CONNECTED,
    server: "Mikrotik 01 - Pusat",
    dueDate: "01 Okt 2023",
    phone: "089876543210",
    ipAddress: "192.168.1.42"
  },
  {
    id: "CUST-10850",
    name: "Deni Pratama",
    address: "Ruko Indah Blok F No. 8, Cikarang, Bekasi",
    planId: "plan-biz",
    status: CustomerStatus.NONAKTIF,
    mikrotikStatus: MikrotikStatus.OFFLINE,
    server: "Mikrotik 02 - Cabang Selatan",
    dueDate: "-",
    phone: "085611223344",
    ipAddress: "10.0.0.51"
  },
  {
    id: "CUST-10940",
    name: "Rian Hidayat",
    address: "Jl. Kemang Raya No. 18A, Jakarta Selatan",
    planId: "plan-pro",
    status: CustomerStatus.AKTIF,
    mikrotikStatus: MikrotikStatus.CONNECTED,
    server: "Mikrotik 01 - Pusat",
    dueDate: "18 Okt 2023",
    phone: "082155443322",
    ipAddress: "192.168.1.118"
  },
  {
    id: "CUST-10955",
    name: "Shinta Amelia",
    address: "Apartemen Mediterania Tower B Lt. 10, Jakarta Utara",
    planId: "plan-basic",
    status: CustomerStatus.AKTIF,
    mikrotikStatus: MikrotikStatus.CONNECTED,
    server: "Mikrotik 01 - Pusat",
    dueDate: "20 Okt 2023",
    phone: "081377889900",
    ipAddress: "192.168.1.205"
  },
  {
    id: "CUST-10960",
    name: "PT. Maju Jaya (Andri)",
    address: "Kawasan Industri Gading, Blok H-4, Kelapa Gading",
    planId: "plan-biz",
    status: CustomerStatus.AKTIF,
    mikrotikStatus: MikrotikStatus.CONNECTED,
    server: "Mikrotik 01 - Pusat",
    dueDate: "22 Okt 2023",
    phone: "081199001122",
    ipAddress: "192.168.1.250"
  },
  {
    id: "CUST-10968",
    name: "Eko Prasetyo",
    address: "Jl. Dago Elok No. 9, Bandung",
    planId: "plan-pro",
    status: CustomerStatus.ISOLIR,
    mikrotikStatus: MikrotikStatus.OFFLINE,
    server: "Mikrotik 02 - Cabang Selatan",
    dueDate: "05 Okt 2023",
    phone: "087812349876",
    ipAddress: "10.0.0.82"
  },
  {
    id: "CUST-10972",
    name: "Siti Rahmawati",
    address: "Cluster Lavender No. A15, Depok",
    planId: "plan-basic",
    status: CustomerStatus.AKTIF,
    mikrotikStatus: MikrotikStatus.CONNECTED,
    server: "Mikrotik 01 - Pusat",
    dueDate: "25 Okt 2023",
    phone: "085244556677",
    ipAddress: "192.168.1.91"
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: "INV-202310-001",
    date: "24 Okt 2023",
    description: "Tagihan Internet Bpk. Andi",
    category: TransactionCategory.BERLANGGANAN,
    amount: 350000,
    status: TransactionStatus.LUNAS
  },
  {
    id: "PO-202310-045",
    date: "23 Okt 2023",
    description: "Pembelian Kabel FO 2 Roll",
    category: TransactionCategory.PEMELIHARAAN,
    amount: -1250000,
    status: TransactionStatus.SELESAI
  },
  {
    id: "INV-202310-002",
    date: "22 Okt 2023",
    description: "Instalasi Baru Perum. Asri Blok C",
    category: TransactionCategory.INSTALASI,
    amount: 750000,
    status: TransactionStatus.TERTUNDA
  },
  {
    id: "INV-202310-003",
    date: "22 Okt 2023",
    description: "Tagihan Internet PT. Maju Jaya",
    category: TransactionCategory.BERLANGGANAN,
    amount: 2500000,
    status: TransactionStatus.LUNAS
  },
  {
    id: "INV-EXT-089",
    date: "21 Okt 2023",
    description: "Sewa Server Cloud Bulanan",
    category: TransactionCategory.PEMELIHARAAN,
    amount: -4500000,
    status: TransactionStatus.JATUH_TEMPO
  },
  {
    id: "INV-202310-004",
    date: "20 Okt 2023",
    description: "Tagihan Internet Ibu Shinta Amelia",
    category: TransactionCategory.BERLANGGANAN,
    amount: 200000,
    status: TransactionStatus.LUNAS
  },
  {
    id: "INV-202310-005",
    date: "19 Okt 2023",
    description: "Instalasi Pelanggan Baru Bpk. Rian Hidayat",
    category: TransactionCategory.INSTALASI,
    amount: 500000,
    status: TransactionStatus.SELESAI
  },
  {
    id: "PO-202310-046",
    date: "18 Okt 2023",
    description: "Honor Teknisi Lapangan Perbaikan Splicing",
    category: TransactionCategory.PEMELIHARAAN,
    amount: -850000,
    status: TransactionStatus.SELESAI
  }
];

export const initialRouters: RouterNode[] = [
  {
    id: "rt-01",
    name: "Mikrotik 01 - Pusat",
    ipAddress: "192.168.1.1",
    status: "Online",
    uptime: "14d 2h 45m",
    activeUsers: 342,
    cpuLoad: 24,
    maxCpu: 100,
    downloadSpeed: 45,
    uploadSpeed: 12,
    history: {
      download: [12, 18, 25, 20, 32, 28, 41, 45, 38, 42, 45, 43, 39, 45],
      upload: [4, 6, 8, 5, 11, 9, 10, 12, 8, 11, 12, 10, 9, 12]
    }
  },
  {
    id: "rt-02",
    name: "Mikrotik 02 - Cabang Selatan",
    ipAddress: "10.0.0.1",
    status: "Offline",
    uptime: "-",
    activeUsers: 0,
    cpuLoad: 0,
    maxCpu: 100,
    downloadSpeed: 0,
    uploadSpeed: 0,
    history: {
      download: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      upload: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
];
