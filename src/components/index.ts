// UI Components
export * from './ui';

// Layout components (keep as-is - good structure)
export { default as MainLayout } from './layout/MainLayout/MainLayout';
export { default as Navbar } from './layout/Navbar/Navbar';
export { default as Sidebar } from './layout/Sidebar/Sidebar';
export { default as BottomNavigation } from './layout/BottomNavigation/BottomNavigation';
export { default as MobileSidebar } from './layout/MobileSidebar/MobileSidebar';

// Page Components (flat structure)
export { default as DashboardPage } from './DashboardPage';
export { default as TransactionsPage } from './TransactionsPage';
export { default as ReportsPage } from './ReportsPage';
export { default as GoalsPage } from './GoalsPage';

// Feature Components (flat structure)
export { default as Auth } from './Auth';
export { default as StatsCards } from './StatsCards';
export { default as RecentTransactions } from './RecentTransactions';
export { default as ExpenseChart } from './ExpenseChart';
export { default as GoalsWidget } from './GoalsWidget';
export { default as TransactionForm } from './TransactionForm';

// Transaction components (keep existing structure)
export { default as TransactionList } from './transaction-components/TransactionList/TransactionList'; 