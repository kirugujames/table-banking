// Mock data utilities for SACCO Management System

export const generateMemberId = (id: number) => `MEM-${String(id).padStart(5, '0')}`;
export const generateLoanId = (id: number) => `LN-${String(id).padStart(3, '0')}`;
export const generateTransactionId = (id: number) => `TXN-${String(id).padStart(5, '0')}`;
export const generateExpenseId = (id: number) => `EXP-${String(id).padStart(3, '0')}`;

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

// Sample member names for mock data
export const sampleMemberNames = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Brown',
  'David Wilson',
  'Jennifer Lee',
  'Robert Taylor',
  'Alice Martinez',
  'Chris Anderson',
  'Patricia Brown',
  'Daniel Kim',
];

// Loan purposes
export const loanPurposes = [
  'Business Expansion',
  'Education',
  'Personal',
  'Home Improvement',
  'Emergency',
  'Medical',
  'Agriculture',
  'Vehicle Purchase',
];

// Transaction types
export const transactionTypes = [
  'Savings Deposit',
  'Loan Repayment',
  'Withdrawal',
  'Welfare Contribution',
  'Loan Disbursement',
  'Share Purchase',
  'Dividend Payment',
];

// Status types
export type MemberStatus = 'active' | 'inactive' | 'probation';
export type LoanStatus = 'draft' | 'pending' | 'approved' | 'disbursed' | 'active' | 'defaulted' | 'completed';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// Calculate loan payment
export const calculateLoanPayment = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return payment;
};

// Calculate total interest
export const calculateTotalInterest = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyPayment = calculateLoanPayment(principal, annualRate, months);
  const totalPayment = monthlyPayment * months;
  return totalPayment - principal;
};

// Generate initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Color palette
export const colors = {
  primary: '#2563EB',
  secondary: '#10B981',
  accent: '#F59E0B',
  success: '#059669',
  danger: '#DC2626',
  warning: '#EA580C',
  info: '#0891b2',
  purple: '#8B5CF6',
  pink: '#EC4899',
};

// Export all utilities
export default {
  generateMemberId,
  generateLoanId,
  generateTransactionId,
  generateExpenseId,
  formatCurrency,
  formatDate,
  formatDateTime,
  sampleMemberNames,
  loanPurposes,
  transactionTypes,
  calculateLoanPayment,
  calculateTotalInterest,
  getInitials,
  colors,
};
