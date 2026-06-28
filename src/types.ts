export enum CustomerStatus {
  AKTIF = "Aktif",
  ISOLIR = "Isolir",
  NONAKTIF = "Nonaktif"
}

export enum MikrotikStatus {
  CONNECTED = "Connected",
  OFFLINE = "Offline"
}

export enum TransactionStatus {
  LUNAS = "Lunas",
  SELESAI = "Selesai",
  TERTUNDA = "Tertunda",
  JATUH_TEMPO = "Jatuh Tempo"
}

export enum TransactionCategory {
  BERLANGGANAN = "Berlangganan",
  PEMELIHARAAN = "Pemeliharaan",
  INSTALASI = "Instalasi"
}

export interface Customer {
  id: string; // CUST-XXXXX
  name: string;
  address: string;
  planId: string;
  status: CustomerStatus;
  mikrotikStatus: MikrotikStatus;
  server: string; // e.g. "Mikrotik 01"
  dueDate: string; // e.g. "15 Okt 2023" or "-"
  phone: string;
  ipAddress: string;
  connectionType?: "PPPoE" | "Static IP";
  pppoeUser?: string;
  pppoePass?: string;
}

export interface InternetPlan {
  id: string;
  name: string;
  speedMbps: number;
  price: number; // in Rp
  activeSubscribers: number;
  description: string;
}

export interface Transaction {
  id: string; // INV-XXXXXX or PO-XXXXXX
  date: string; // e.g. "24 Okt 2023"
  description: string;
  category: TransactionCategory;
  amount: number; // positive for income, negative for expense
  status: TransactionStatus;
}

export interface RouterNode {
  id: string;
  name: string;
  ipAddress: string;
  status: "Online" | "Offline";
  uptime: string;
  activeUsers: number;
  cpuLoad: number;
  maxCpu: number;
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  history: { download: number[]; upload: number[] };
}

export interface SystemStats {
  totalIncome: number;
  pendingReceivable: number;
  operationalCost: number;
}
