import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/services/api';
import PaymentModal from './PaymentModal';
import TransactionHistory from './TransactionHistory';
import Statements from './Statements';
import ProfileSettings from './ProfileSettings';
import ChamaMembers from './ChamaMembers';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

// Chart component for reports
const MonthlyContributionChart = ({ data }) => {
  const { theme } = useTheme();
  const maxAmount = Math.max(...data.map(item => item.amount), 5000);
  
  const chartBackground = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-800 to-emerald-900/30 border-gray-700'
    : 'bg-gradient-to-br from-white to-emerald-50 border-emerald-200';

  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900';
  const labelColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`w-full h-48 sm:h-64 rounded-lg p-4 sm:p-6 border ${chartBackground}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className={`font-semibold text-sm sm:text-base ${textColor}`}>Monthly Contributions Trend</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full"></div>
          <span className={`text-xs sm:text-sm ${labelColor}`}>Contributions (KSh)</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-24 sm:h-40 space-x-1 sm:space-x-2">
        {data.map((month, index) => (
          <div key={month.month} className="flex flex-col items-center flex-1">
            <div className={`text-xs mb-2 hidden xs:block ${labelColor}`}>{month.month}</div>
            <div className={`text-[10px] mb-2 xs:hidden ${labelColor}`}>{month.month.substring(0, 1)}</div>
            <div
              className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-emerald-400 hover:to-emerald-300 hover:shadow-lg"
              style={{ height: `${(month.amount / maxAmount) * 100}%` }}
            >
              <div className="text-white text-[10px] sm:text-xs font-medium text-center mt-1 hidden sm:block">
                {month.amount > 0 ? `KSh ${month.amount.toLocaleString()}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [chamaMembersOpen, setChamaMembersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [statementsOpen, setStatementsOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  // Dynamic styles based on theme
  const backgroundGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-emerald-900/20 to-teal-900/20'
    : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50';

  const cardBackground = theme === 'dark' 
    ? 'bg-gray-800/80 border-gray-700 backdrop-blur-sm'
    : 'bg-white/80 border-emerald-200 backdrop-blur-sm';

  const mobileHeaderBg = theme === 'dark'
    ? 'bg-gray-800/90 border-gray-700'
    : 'bg-white/90 border-emerald-200';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const descriptionColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-emerald-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-emerald-50';

  // Sample data for demonstration
  const [membersData] = useState([
    { id: 1, name: 'John Doe', phone: '254712345678', joinDate: '2024-01-15', role: 'admin', status: 'active', lastActive: '2024-02-20', totalContributions: 15000 },
    { id: 2, name: 'Jane Smith', phone: '254723456789', joinDate: '2024-01-20', role: 'member', status: 'active', lastActive: '2024-02-19', totalContributions: 12000 },
    { id: 3, name: 'Mike Johnson', phone: '254734567890', joinDate: '2024-01-25', role: 'member', status: 'active', lastActive: '2024-02-18', totalContributions: 8000 },
    { id: 4, name: 'Sarah Williams', phone: '254745678901', joinDate: '2024-02-01', role: 'member', status: 'active', lastActive: '2024-02-20', totalContributions: 5000 },
    { id: 5, name: 'David Brown', phone: '254756789012', joinDate: '2024-01-28', role: 'member', status: 'active', lastActive: '2024-02-17', totalContributions: 3000 },
  ]);

  const [monthlyChartData] = useState([
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 72000 },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getSummary();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setTimeout(() => {
      fetchDashboardData();
    }, 3000);
  };

  const handlePrintPDF = () => {
    // Simulate PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ChamaPro Statement - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #10b981; color: white; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ChamaPro Statement</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="summary">
            <h3>Account Summary</h3>
            <p>Total Balance: KSh ${dashboardData?.summary?.totalContributions?.toLocaleString() || '0'}</p>
            <p>Monthly Contributions: KSh ${dashboardData?.summary?.monthlyContributions?.toLocaleString() || '0'}</p>
            <p>Total Transactions: ${dashboardData?.summary?.totalTransactions || '0'}</p>
          </div>
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(dashboardData?.recentTransactions || []).map(transaction => `
                <tr>
                  <td>${new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td>Contribution - ${transaction.mpesaReceiptNumber}</td>
                  <td>KSh ${transaction.amount?.toLocaleString()}</td>
                  <td>Completed</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">Print</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'members',
      name: 'Members',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'quick-actions',
      name: 'Quick Actions',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'transactions',
      name: 'Transactions',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      name: 'Make Contribution',
      description: 'Add funds to your account',
      icon: '💰',
      action: () => setPaymentModalOpen(true),
      gradient: 'from-green-500 to-emerald-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-green-50',
      textColor: theme === 'dark' ? 'text-green-300' : 'text-green-700'
    },
    {
      name: 'View Statements',
      description: 'Download statements',
      icon: '📄',
      action: () => setStatementsOpen(true),
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50',
      textColor: theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
    },
    {
      name: 'Transaction History',
      description: 'View all transactions',
      icon: '📊',
      action: () => setTransactionHistoryOpen(true),
      gradient: 'from-purple-500 to-indigo-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50',
      textColor: theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
    },
    {
      name: 'Profile Settings',
      description: 'Update account info',
      icon: '👤',
      action: () => setProfileSettingsOpen(true),
      gradient: 'from-orange-500 to-amber-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50',
      textColor: theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
    },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen w-full ${backgroundGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`font-medium ${textColor}`}>Loading your dashboard...</p>
          <p className={`${descriptionColor} text-sm mt-2`}>Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  const { summary, recentTransactions = [] } = dashboardData || {};

  const StatCard = ({ title, value, description, icon, trend }) => (
    <Card className={`${cardBackground} shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-medium mb-1 truncate ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{title}</p>
            <p className={`text-lg sm:text-2xl font-bold truncate ${textColor}`}>{value}</p>
            <p className={`text-xs mt-1 truncate ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-500'}`}>{description}</p>
            {trend && (
              <p className={`text-xs font-medium mt-1 ${trend.color}`}>
                {trend.value} {trend.label}
              </p>
            )}
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white ml-3 flex-shrink-0">
            <span className="text-sm sm:text-base">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TransactionItem = ({ transaction, index }) => (
    <div key={index} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-white/50 border-emerald-100 hover:bg-white'} transition-colors duration-200`}>
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
          <span className={`text-sm sm:text-lg ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>💰</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-semibold text-sm sm:text-base truncate ${textColor}`}>Contribution</p>
          <p className={`text-xs truncate ${descriptionColor}`}>
            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className={`text-xs font-mono truncate ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
            Receipt: {transaction.mpesaReceiptNumber}
          </p>
        </div>
      </div>
      <div className="text-right ml-2 flex-shrink-0">
        <p className={`font-bold text-sm sm:text-lg whitespace-nowrap ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
          KSh {transaction.amount?.toLocaleString()}
        </p>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
          ✓ Completed
        </span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <StatCard
                title="Total Balance"
                value={`KSh ${summary?.totalContributions?.toLocaleString() || '0'}`}
                description="Lifetime contributions"
                icon="💰"
                trend={{ value: '+12%', label: 'this month', color: 'text-green-600' }}
              />
              <StatCard
                title="Monthly Contributions"
                value={`KSh ${summary?.monthlyContributions?.toLocaleString() || '0'}`}
                description="This month's total"
                icon="📈"
              />
              <StatCard
                title="Total Transactions"
                value={summary?.totalTransactions || '0'}
                description="All-time transactions"
                icon="🔄"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6">
                {/* Quick Actions */}
                <Card className={cardBackground}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Quick Actions</CardTitle>
                    <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Manage your Chama activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 transform hover:scale-105 group ${action.bgColor} ${theme === 'dark' ? 'border-gray-600' : 'border-emerald-200'}`}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center text-white text-sm sm:text-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                              {action.icon}
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <h3 className={`font-semibold text-sm sm:text-base ${action.textColor} group-hover:underline truncate`}>
                                {action.name}
                              </h3>
                              <p className={`text-xs mt-1 line-clamp-2 ${descriptionColor}`}>{action.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className={cardBackground}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Recent Transactions</CardTitle>
                        <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Your latest activities</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        className={`text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                        onClick={() => setTransactionHistoryOpen(true)}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 sm:space-y-3">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction, index) => (
                          <TransactionItem key={index} transaction={transaction} />
                        ))
                      ) : (
                        <div className="text-center py-8 sm:py-12">
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                            <svg className={`w-8 h-8 sm:w-10 sm:h-10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <p className={`font-medium text-sm sm:text-base ${descriptionColor}`}>No transactions yet</p>
                          <p className={`text-xs sm:text-sm mt-1 ${descriptionColor}`}>Make your first contribution to get started</p>
                          <Button 
                            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm"
                            onClick={() => setPaymentModalOpen(true)}
                          >
                            Make First Contribution
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* User Info */}
                <Card className={cardBackground}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>My Profile</CardTitle>
                    <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold text-sm sm:text-lg truncate ${textColor}`}>{user?.name}</h3>
                        <p className={`text-xs sm:text-sm truncate ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>{user?.phone}</p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full capitalize ${theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      {dashboardData?.user?.joinedDate && (
                        <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-emerald-100'}`}>
                          <span className={descriptionColor}>Member Since</span>
                          <span className={`font-medium text-right ${textColor}`}>
                            {new Date(dashboardData.user.joinedDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-emerald-100'}`}>
                        <span className={descriptionColor}>Status</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className={`w-full mt-4 text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                      onClick={() => setProfileSettingsOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Contribution */}
                <Card className={cardBackground}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Quick Contribution</CardTitle>
                    <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Common amounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[100, 500, 1000, 2000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className={`h-10 sm:h-12 font-medium text-xs sm:text-sm transition-colors duration-200 ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'}`}
                          onClick={() => setPaymentModalOpen(true)}
                        >
                          KSh {amount}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="space-y-6">
            {/* Members Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                { title: 'Total Members', value: membersData.length, icon: '👥', gradient: 'from-emerald-500 to-green-600' },
                { title: 'Active Members', value: membersData.filter(m => m.status === 'active').length, icon: '👤', gradient: 'from-blue-500 to-cyan-600' },
                { title: 'Admins', value: membersData.filter(m => m.role === 'admin').length, icon: '👑', gradient: 'from-purple-500 to-indigo-600' },
                { title: 'New This Month', value: 2, icon: '🆕', gradient: 'from-orange-500 to-amber-600' },
              ].map((stat, index) => (
                <Card key={index} className={cardBackground}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center">
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                        <span className="text-white text-sm sm:text-base">{stat.icon}</span>
                      </div>
                      <p className={`text-lg sm:text-2xl font-bold ${textColor}`}>{stat.value}</p>
                      <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>{stat.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Member Management</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  Manage Chama members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button 
                    className="h-16 sm:h-20 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setChamaMembersOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1">👥</div>
                      <div className="text-xs sm:text-sm">View All Members</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className={`h-16 sm:h-20 text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                  >
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1">📞</div>
                      <div className="text-xs sm:text-sm">Contact Members</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Members */}
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Recent Members</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  Newest Chama members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {membersData.slice(0, 3).map((member) => (
                    <div key={member.id} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-white/50 border-emerald-100 hover:bg-white'} transition-colors duration-200`}>
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-semibold text-sm sm:text-base truncate ${textColor}`}>{member.name}</p>
                          <p className={`text-xs truncate ${descriptionColor}`}>{member.phone}</p>
                          <p className={`text-xs truncate ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            KSh {member.totalContributions?.toLocaleString()} total
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className={`text-xs whitespace-nowrap ${descriptionColor}`}>
                          {new Date(member.joinDate).toLocaleDateString()}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === 'admin' 
                            ? theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                            : theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className={`w-full mt-4 text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                  onClick={() => setChamaMembersOpen(true)}
                >
                  View All Members
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'quick-actions':
        return (
          <div className="space-y-6">
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Quick Actions</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  Quickly access the most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105 hover:shadow-md ${action.bgColor} ${theme === 'dark' ? 'border-gray-600' : action.textColor.replace('text-', 'border-').replace('-700', '-200')}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div>
                          <h3 className={`font-semibold ${action.textColor}`}>{action.name}</h3>
                          <p className={`text-sm opacity-80 ${descriptionColor}`}>{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${cardBackground} ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>Total Contributions</p>
                      <p className={`text-2xl font-bold ${textColor}`}>
                        KSh {summary?.totalContributions?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardBackground} ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>Total Transactions</p>
                      <p className={`text-2xl font-bold ${textColor}`}>
                        {summary?.totalTransactions || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Transaction Management</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  View and manage all your transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button 
                    className="h-16 sm:h-20 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setTransactionHistoryOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1">📊</div>
                      <div className="text-xs sm:text-sm">View All Transactions</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className={`h-16 sm:h-20 text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1">💰</div>
                      <div className="text-xs sm:text-sm">Make New Contribution</div>
                    </div>
                  </Button>
                </div>

                {/* Recent Transactions List */}
                <div className="mt-6">
                  <h3 className={`text-base sm:text-lg font-semibold mb-4 ${textColor}`}>Recent Transactions</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((transaction, index) => (
                        <TransactionItem key={index} transaction={transaction} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                          <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <p className={`text-sm sm:text-base ${descriptionColor}`}>No transactions yet</p>
                        <p className={`text-xs sm:text-sm mt-1 ${descriptionColor}`}>Make your first contribution</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Reports & Statements</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  Financial reports and statements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button 
                    className="h-16 sm:h-20 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setStatementsOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1">📄</div>
                      <div className="text-xs sm:text-sm">Monthly Statements</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className={`h-16 sm:h-20 text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                    onClick={handlePrintPDF}
                  >
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl mb-1">🖨️</div>
                      <div className="text-xs sm:text-sm">Print PDF Report</div>
                    </div>
                  </Button>
                </div>

                {/* Monthly Contribution Chart */}
                <div className="mt-6">
                  <h3 className={`text-base sm:text-lg font-semibold mb-4 ${textColor}`}>Monthly Contributions</h3>
                  <MonthlyContributionChart data={monthlyChartData} />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
                  <Card className={cardBackground}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="text-center">
                        <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
                          KSh {monthlyChartData.reduce((sum, month) => sum + month.amount, 0).toLocaleString()}
                        </p>
                        <p className={`text-xs sm:text-sm ${descriptionColor}`}>Total This Year</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={cardBackground}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="text-center">
                        <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
                          KSh {Math.max(...monthlyChartData.map(m => m.amount)).toLocaleString()}
                        </p>
                        <p className={`text-xs sm:text-sm ${descriptionColor}`}>Highest Month</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={cardBackground}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="text-center">
                        <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
                          KSh {Math.round(monthlyChartData.reduce((sum, month) => sum + month.amount, 0) / monthlyChartData.length).toLocaleString()}
                        </p>
                        <p className={`text-xs sm:text-sm ${descriptionColor}`}>Monthly Average</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full ${backgroundGradient} transition-colors duration-300`}>
      {/* All Modals */}
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <TransactionHistory
        open={transactionHistoryOpen}
        onOpenChange={setTransactionHistoryOpen}
        user={user}
      />
      
      <Statements
        open={statementsOpen}
        onOpenChange={setStatementsOpen}
        user={user}
      />
      
      <ProfileSettings
        open={profileSettingsOpen}
        onOpenChange={setProfileSettingsOpen}
      />

      <ChamaMembers
        open={chamaMembersOpen}
        onOpenChange={setChamaMembersOpen}
        members={membersData}
      />

      {/* Mobile Header */}
      <div className={`lg:hidden sticky top-0 z-40 backdrop-blur-sm border-b ${mobileHeaderBg}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 text-emerald-300 hover:bg-gray-600' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                ChamaPro
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              onClick={() => setPaymentModalOpen(true)}
            >
              💰 Pay
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 min-h-screen p-6">
          <Card className={`shadow-xl h-full ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-emerald-200'}`}>
            <CardContent className="p-6 h-full flex flex-col">
              {/* Logo and Theme Toggle */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                    ChamaPro
                  </h1>
                  <p className={`text-sm mt-1 font-medium ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>Member Portal</p>
                </div>
                <ThemeToggle />
              </div>

              {/* Navigation */}
              <nav className="space-y-2 flex-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200'
                        : `${textColor} ${hoverBg} hover:shadow-md`
                    }`}
                  >
                    <div className={`${activeSection === item.id ? 'text-white' : theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions & Logout */}
              <div className={`space-y-4 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-emerald-100'}`}>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-10"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    💰 Pay
                  </Button>
                  <Button
                    variant="outline"
                    className={`text-sm h-10 ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                    onClick={() => setTransactionHistoryOpen(true)}
                  >
                    📊 History
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  className={`w-full h-10 ${theme === 'dark' ? 'border-red-800 text-red-400 hover:bg-red-900/50 hover:border-red-700' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
                  onClick={logout}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/20"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className={`absolute left-0 top-0 h-full w-80 backdrop-blur-sm border-r overflow-y-auto ${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-emerald-200'}`}>
              <Card className="h-full border-0 shadow-none bg-transparent">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Logo */}
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                      ChamaPro
                    </h1>
                    <p className={`text-sm mt-1 font-medium ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>Member Portal</p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2 flex-1">
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200'
                            : `${textColor} ${hoverBg} hover:shadow-md`
                        }`}
                      >
                        <div className={`${activeSection === item.id ? 'text-white' : theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Quick Actions & Logout */}
                  <div className={`space-y-4 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-emerald-100'}`}>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9"
                        onClick={() => {
                          setPaymentModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        💰 Pay
                      </Button>
                      <Button
                        variant="outline"
                        className={`text-xs h-9 ${theme === 'dark' ? 'border-gray-600 text-emerald-300 hover:bg-gray-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                        onClick={() => {
                          setTransactionHistoryOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        📊 History
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      className={`w-full h-9 text-xs ${theme === 'dark' ? 'border-red-800 text-red-400 hover:bg-red-900/50 hover:border-red-700' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
                      onClick={logout}
                    >
                      <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                    {navigationItems.find(item => item.id === activeSection)?.name || 'Dashboard'}
                  </h1>
                  <p className={`mt-2 text-sm sm:text-base lg:text-lg ${descriptionColor}`}>
                    Welcome back, <span className={`font-semibold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>{user?.name}</span>! { 
                      activeSection === 'dashboard' ? "Here's your Chama overview." :
                      activeSection === 'members' ? "Manage your Chama members." :
                      activeSection === 'reports' ? "View your financial reports." :
                      "Everything you need in one place."
                    }
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className={`text-xs sm:text-sm ${descriptionColor}`}>Today is</p>
                  <p className={`font-medium text-sm sm:text-base ${textColor}`}>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;