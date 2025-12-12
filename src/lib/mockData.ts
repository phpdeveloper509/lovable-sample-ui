import { CashEntry, ShiftClosing, CashHandover, User, DailySummary } from '@/types/cashlog';

export const currentUser: User = {
  id: '1',
  name: 'Mohammed',
  role: 'reception',
};

export const users: User[] = [
  { id: '1', name: 'Mohammed', role: 'reception' },
  { id: '2', name: 'Ibrahim', role: 'reception' },
  { id: '3', name: 'Fatima', role: 'reception' },
  { id: '4', name: 'Ahmad', role: 'accountant' },
];

export const mockEntries: CashEntry[] = [
  {
    id: '1',
    shiftId: 'shift-1',
    date: '2025-12-12',
    invoiceNo: 'INV-001',
    customerName: 'Ahmed Ali',
    particulars: 'Lab Test Payment',
    amount: 15000,
    isRefund: false,
    paymentMode: 'cash',
    entryType: 'normal',
    createdBy: 'Mohammed',
    createdAt: '2025-12-12T09:15:00',
  },
  {
    id: '2',
    shiftId: 'shift-1',
    date: '2025-12-12',
    invoiceNo: 'INV-002',
    customerName: 'Samir Khan',
    particulars: 'Consultation Fee',
    amount: 25000,
    isRefund: false,
    paymentMode: 'pos',
    entryType: 'normal',
    createdBy: 'Mohammed',
    createdAt: '2025-12-12T09:45:00',
  },
  {
    id: '3',
    shiftId: 'shift-1',
    date: '2025-12-12',
    invoiceNo: 'INV-003',
    customerName: 'Layla Hassan',
    particulars: 'Refund - Test Cancelled',
    amount: 8000,
    isRefund: true,
    paymentMode: 'cash',
    entryType: 'normal',
    remarks: 'Test cancelled by patient request',
    createdBy: 'Mohammed',
    createdAt: '2025-12-12T10:30:00',
  },
  {
    id: '4',
    shiftId: 'shift-1',
    date: '2025-12-12',
    particulars: 'Parcel Delivery',
    amount: 500,
    isRefund: false,
    paymentMode: 'cash',
    entryType: 'expense',
    createdBy: 'Mohammed',
    createdAt: '2025-12-12T11:00:00',
  },
  {
    id: '5',
    shiftId: 'shift-1',
    date: '2025-12-12',
    invoiceNo: 'INV-004',
    customerName: 'Omar Rashid',
    particulars: 'X-Ray Payment',
    amount: 18000,
    isRefund: false,
    paymentMode: 'direct',
    entryType: 'normal',
    createdBy: 'Mohammed',
    createdAt: '2025-12-12T11:30:00',
  },
];

export const currentShift: ShiftClosing = {
  id: 'shift-1',
  shiftType: 'morning',
  date: '2025-12-12',
  openingBalance: 202424,
  totalCollections: 58000,
  totalRefunds: 8000,
  totalPOS: 25000,
  totalDirect: 18000,
  totalExpenses: 500,
  systemClosingBalance: 251924,
  status: 'open',
};

export const shifts: ShiftClosing[] = [
  {
    id: 'shift-prev-1',
    shiftType: 'morning',
    date: '2025-12-11',
    openingBalance: 180000,
    totalCollections: 45000,
    totalRefunds: 5000,
    totalPOS: 20000,
    totalDirect: 12000,
    totalExpenses: 1200,
    systemClosingBalance: 218800,
    physicalCash: 218800,
    difference: 0,
    matchStatus: 'matched',
    status: 'approved',
    closedBy: 'Mohammed',
    closedAt: '2025-12-11T14:00:00',
  },
  {
    id: 'shift-prev-2',
    shiftType: 'evening',
    date: '2025-12-11',
    openingBalance: 218800,
    totalCollections: 32000,
    totalRefunds: 3000,
    totalPOS: 15000,
    totalDirect: 8000,
    totalExpenses: 800,
    systemClosingBalance: 247000,
    physicalCash: 246500,
    difference: -500,
    matchStatus: 'mismatched',
    status: 'approved',
    closedBy: 'Ibrahim',
    closedAt: '2025-12-11T22:00:00',
    remarks: 'Short by 500 - coin counting error',
  },
  {
    id: 'shift-prev-3',
    shiftType: 'night',
    date: '2025-12-11',
    openingBalance: 246500,
    totalCollections: 12000,
    totalRefunds: 1000,
    totalPOS: 5000,
    totalDirect: 3000,
    totalExpenses: 200,
    systemClosingBalance: 255300,
    physicalCash: 255300,
    difference: 0,
    matchStatus: 'matched',
    status: 'approved',
    closedBy: 'Fatima',
    closedAt: '2025-12-12T06:00:00',
  },
];

export const mockHandovers: CashHandover[] = [
  {
    id: 'ho-1',
    shiftId: 'shift-prev-1',
    fromUser: 'Mohammed',
    toUser: 'Ibrahim',
    handoverAmount: 218800,
    timestamp: '2025-12-11T14:05:00',
    confirmed: true,
  },
  {
    id: 'ho-2',
    shiftId: 'shift-prev-2',
    fromUser: 'Ibrahim',
    toUser: 'Fatima',
    handoverAmount: 246500,
    timestamp: '2025-12-11T22:05:00',
    confirmed: true,
  },
];

export const dailySummary: DailySummary = {
  date: '2025-12-11',
  opening: 180000,
  totalCollections: 89000,
  totalPOS: 40000,
  totalDirect: 23000,
  totalRefunds: 9000,
  totalExpenses: 2200,
  closing: 255300,
  shifts: shifts,
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getShiftLabel = (shift: 'morning' | 'evening' | 'night'): string => {
  const labels = {
    morning: 'Morning Shift',
    evening: 'Evening Shift',
    night: 'Night Shift',
  };
  return labels[shift];
};

export const getShiftTimeRange = (shift: 'morning' | 'evening' | 'night'): string => {
  const ranges = {
    morning: '6:00 AM - 2:00 PM',
    evening: '2:00 PM - 10:00 PM',
    night: '10:00 PM - 6:00 AM',
  };
  return ranges[shift];
};
