// Transaction types
export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// Goal types
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  category: 'savings' | 'investment' | 'emergency' | 'purchase' | 'vacation' | 'other';
  deadline?: string;
  archived?: boolean;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense' | 'both';
  created_at: string;
}

// Filter types for transactions
export interface TransactionFilter {
  type: 'all' | 'income' | 'expense';
  category: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  amountFrom: string;
  amountTo: string;
}

// Finance context types
export interface FinanceContextType {
  transactions: Transaction[];
  goals: Goal[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getBalance: () => number;
  getIncome: () => number;
  getExpenses: () => number;
  getTransactionsByCategory: () => Record<string, number>;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

// Analytics types
export interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  avgTransactionAmount: number;
  avgIncomeAmount: number;
  avgExpenseAmount: number;
  healthScore: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

// Chart data types
export interface MonthlyData {
  months: string[];
  incomeData: number[];
  expenseData: number[];
  balanceData: number[];
}

// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Component prop types
export interface GoalFormData {
  title: string;
  target_amount: string;
  current_amount: number;
  category: Goal['category'];
  deadline: string;
}

export interface TransactionFormData {
  type: Transaction['type'];
  amount: string;
  description: string;
  category: string;
  date: string;
} 