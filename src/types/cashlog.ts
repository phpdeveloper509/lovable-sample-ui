export type ShiftType = 'morning' | 'evening' | 'night';
export type PaymentMode = 'cash' | 'pos' | 'direct';
export type EntryType = 'normal' | 'expense';
export type ShiftStatus = 'open' | 'closed' | 'pending' | 'approved' | 'rejected';
export type MatchStatus = 'matched' | 'mismatched';

export interface CashEntry {
  id: string;
  shiftId: string;
  date: string;
  invoiceNo?: string;
  customerName?: string;
  particulars: string;
  amount: number;
  isRefund: boolean;
  paymentMode: PaymentMode;
  entryType: EntryType;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface ShiftClosing {
  id: string;
  shiftType: ShiftType;
  date: string;
  openingBalance: number;
  totalCollections: number;
  totalRefunds: number;
  totalPOS: number;
  totalDirect: number;
  totalExpenses: number;
  systemClosingBalance: number;
  physicalCash?: number;
  difference?: number;
  matchStatus?: MatchStatus;
  status: ShiftStatus;
  closedBy?: string;
  closedAt?: string;
  remarks?: string;
}

export interface CashHandover {
  id: string;
  shiftId: string;
  fromUser: string;
  toUser: string;
  handoverAmount: number;
  signatureImage?: string;
  photoImage?: string;
  timestamp: string;
  confirmed: boolean;
}

export interface AccountantVerification {
  id: string;
  shiftId: string;
  verifiedBy: string;
  verifiedAt: string;
  status: 'approved' | 'rejected';
  remarks?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'reception' | 'accountant' | 'admin';
  avatar?: string;
}

export interface DailySummary {
  date: string;
  opening: number;
  totalCollections: number;
  totalPOS: number;
  totalDirect: number;
  totalRefunds: number;
  totalExpenses: number;
  closing: number;
  shifts: ShiftClosing[];
}
