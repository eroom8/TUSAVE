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




const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [chamaMembersOpen, setChamaMembersOpen] = useState(false);
  
  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [statementsOpen, setStatementsOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

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
    // Refresh dashboard data after successful payment initiation
    setTimeout(() => {
      fetchDashboardData();
    }, 3000);
  };

// Add to the navigationItems array
const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'members',
    name: 'Chama Members',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'transactions',
    name: 'Transactions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
  {
    id: 'reports',
    name: 'Reports & Statements',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

  const quickActions = [
    {
      name: 'Make Contribution',
      description: 'Add funds to your Chama account',
      icon: '💰',
      action: () => setPaymentModalOpen(true),
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      name: 'View Statements',
      description: 'Download monthly statements',
      icon: '📄',
      action: () => setStatementsOpen(true),
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      name: 'Transaction History',
      description: 'View all your transactions',
      icon: '📊',
      action: () => setTransactionHistoryOpen(true),
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      name: 'Profile Settings',
      description: 'Update your account information',
      icon: '👤',
      action: () => setProfileSettingsOpen(true),
      color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#edffe8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2c6e49] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2c6e49]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { summary, recentTransactions = [] } = dashboardData || {};

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-[#a3d9a5]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1e4f34]">Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#2c6e49]">
                    KSh {summary?.totalContributions?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-[#4c956c]">
                    Lifetime contributions
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#a3d9a5]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1e4f34]">Monthly Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#2c6e49]">
                    KSh {summary?.monthlyContributions?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-[#4c956c]">
                    This month's total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#a3d9a5]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1e4f34]">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#2c6e49]">
                    {summary?.totalTransactions || '0'}
                  </div>
                  <p className="text-xs text-[#4c956c]">
                    All-time transactions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <Card className="border-[#a3d9a5]">
                  <CardHeader>
                    <CardTitle className="text-[#1e4f34]">Quick Actions</CardTitle>
                    <CardDescription className="text-[#4c956c]">Manage your Chama activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {quickActions.map((action, index) => (
                        <Button 
                          key={index}
                          className="h-16 bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                          onClick={action.action}
                        >
                          {action.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="border-[#a3d9a5]">
                  <CardHeader>
                    <CardTitle className="text-[#1e4f34]">Recent Transactions</CardTitle>
                    <CardDescription className="text-[#4c956c]">Your latest Chama activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction, index) => (
                          <div key={index} className="flex items-center justify-between border-b border-[#d8ffd0] pb-3">
                            <div>
                              <p className="font-medium text-[#1e4f34]">Contribution</p>
                              <p className="text-sm text-[#4c956c]">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-[#4c956c]">
                                Receipt: {transaction.mpesaReceiptNumber}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-[#2c6e49]">
                                KSh {transaction.amount?.toLocaleString()}
                              </p>
                              <p className="text-sm text-green-500">Completed</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-[#edffe8] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#4c956c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <p className="text-[#4c956c]">No transactions yet</p>
                          <p className="text-sm text-[#4c956c] mt-1">Make your first contribution to get started</p>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
                      onClick={() => setTransactionHistoryOpen(true)}
                    >
                      View All Transactions
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* User Info */}
                <Card className="border-[#a3d9a5]">
                  <CardHeader>
                    <CardTitle className="text-[#1e4f34]">My Profile</CardTitle>
                    <CardDescription className="text-[#4c956c]">Account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-[#4c956c]">Name</p>
                        <p className="font-medium text-[#1e4f34]">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#4c956c]">Phone</p>
                        <p className="font-medium text-[#1e4f34]">{user?.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#4c956c]">Role</p>
                        <p className="font-medium text-[#1e4f34] capitalize">{user?.role}</p>
                      </div>
                      {dashboardData?.user?.joinedDate && (
                        <div>
                          <p className="text-sm text-[#4c956c]">Member Since</p>
                          <p className="font-medium text-[#1e4f34]">
                            {new Date(dashboardData.user.joinedDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Last Payment */}
                {summary?.lastPayment && (
                  <Card className="border-[#a3d9a5]">
                    <CardHeader>
                      <CardTitle className="text-[#1e4f34]">Last Payment</CardTitle>
                      <CardDescription className="text-[#4c956c]">Most recent contribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-[#2c6e49] mb-2">
                          KSh {summary.lastPayment.amount?.toLocaleString()}
                        </div>
                        <p className="text-[#4c956c] mb-2">
                          {new Date(summary.lastPayment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-[#4c956c]">
                          Receipt: {summary.lastPayment.mpesaReceiptNumber}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Contribution */}
                <Card className="border-[#a3d9a5]">
                  <CardHeader>
                    <CardTitle className="text-[#1e4f34]">Quick Contribution</CardTitle>
                    <CardDescription className="text-[#4c956c]">Common contribution amounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {[100, 500, 1000, 2000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
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
        // Add this case to the switch statement in renderContent
case 'members':
  return (
    <div className="space-y-6">
      {/* Members Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#a3d9a5] bg-[#edffe8]">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#2c6e49] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[#2c6e49]">25</p>
              <p className="text-[#4c956c] text-sm">Total Members</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#a3d9a5] bg-[#edffe8]">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4c956c] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[#2c6e49]">23</p>
              <p className="text-[#4c956c] text-sm">Active Members</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#a3d9a5] bg-[#edffe8]">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#2c6e49] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[#2c6e49]">2</p>
              <p className="text-[#4c956c] text-sm">Admins</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#a3d9a5] bg-[#edffe8]">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4c956c] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[#2c6e49]">5</p>
              <p className="text-[#4c956c] text-sm">New This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-[#a3d9a5]">
        <CardHeader>
          <CardTitle className="text-[#1e4f34]">Member Management</CardTitle>
          <CardDescription className="text-[#4c956c]">
            Manage and interact with Chama members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="h-20 bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
              onClick={() => setChamaMembersOpen(true)}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">👥</div>
                <div>View All Members</div>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📞</div>
                <div>Contact Members</div>
              </div>
            </Button>

           
<Button
  variant="outline"
  className="w-full border-[#4c956c] text-[#4c956c] hover:bg-[#4c956c] hover:text-white"
  onClick={() => setChamaMembersOpen(true)}
>
  👥 View Members
</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Members */}
      <Card className="border-[#a3d9a5]">
        <CardHeader>
          <CardTitle className="text-[#1e4f34]">Recent Members</CardTitle>
          <CardDescription className="text-[#4c956c]">
            Newest members who joined the Chama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'David Brown', phone: '254745678901', joinDate: '2024-02-01', role: 'member' },
              { name: 'Grace Kimani', phone: '254756789012', joinDate: '2024-01-28', role: 'member' },
              { name: 'Peter Kamau', phone: '254767890123', joinDate: '2024-01-25', role: 'member' },
            ].map((member, index) => (
              <div key={index} className="flex items-center justify-between border-b border-[#d8ffd0] pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#4c956c] rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[#1e4f34]">{member.name}</p>
                    <p className="text-sm text-[#4c956c]">{member.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#4c956c]">
                    Joined {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                  <span className="text-xs bg-[#edffe8] text-[#2c6e49] px-2 py-1 rounded-full">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
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
            <Card className="border-[#a3d9a5]">
              <CardHeader>
                <CardTitle className="text-[#1e4f34]">Quick Actions</CardTitle>
                <CardDescription className="text-[#4c956c]">
                  Quickly access the most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105 hover:shadow-md ${action.color}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div>
                          <h3 className="font-semibold">{action.name}</h3>
                          <p className="text-sm opacity-80">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-[#a3d9a5] bg-[#edffe8]">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#2c6e49] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#4c956c] text-sm">Total Contributions</p>
                      <p className="text-2xl font-bold text-[#2c6e49]">
                        KSh {summary?.totalContributions?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#a3d9a5] bg-[#edffe8]">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#2c6e49] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#4c956c] text-sm">Total Transactions</p>
                      <p className="text-2xl font-bold text-[#2c6e49]">
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
            <Card className="border-[#a3d9a5]">
              <CardHeader>
                <CardTitle className="text-[#1e4f34]">Transaction Management</CardTitle>
                <CardDescription className="text-[#4c956c]">
                  View and manage all your transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-20 bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                    onClick={() => setTransactionHistoryOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">📊</div>
                      <div>View All Transactions</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-20 border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">💰</div>
                      <div>Make New Contribution</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <Card className="border-[#a3d9a5]">
              <CardHeader>
                <CardTitle className="text-[#1e4f34]">Reports & Statements</CardTitle>
                <CardDescription className="text-[#4c956c]">
                  Access your financial reports and statements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-20 bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                    onClick={() => setStatementsOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">📄</div>
                      <div>Monthly Statements</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-20 border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">📈</div>
                      <div>Annual Report</div>
                    </div>
                  </Button>
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
  <div className="min-h-screen w-full bg-[hsl(110,72%,79%)]">
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

    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white shadow-lg border-b lg:border-r lg:border-b-0 border-[#a3d9a5] lg:min-h-screen">
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-[#a3d9a5]">
          <h1 className="text-xl lg:text-2xl font-bold text-[#2c6e49]">ChamaPro</h1>
          <p className="text-xs lg:text-sm text-[#4c956c] mt-1">Member Portal</p>
        </div>

        {/* User Info */}
        <div className="p-3 lg:p-4 border-b border-[#a3d9a5]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#4c956c] rounded-full flex items-center justify-center text-white font-semibold text-sm lg:text-base">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-[#1e4f34] text-sm">{user?.name}</p>
              <p className="text-xs text-[#4c956c]">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 lg:p-4 space-y-1 lg:space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-[#2c6e49] text-white'
                  : 'text-[#4c956c] hover:bg-[#edffe8] hover:text-[#2c6e49]'
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm lg:text-base">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions Section */}
        <div className="p-3 lg:p-4 border-t border-[#a3d9a5]">
          <h3 className="text-[#1e4f34] font-medium text-xs lg:text-sm mb-2 lg:mb-3">Quick Actions</h3>
          <div className="space-y-1 lg:space-y-2">
            <Button
              className="w-full bg-[#2c6e49] hover:bg-[#1e4f34] text-white text-sm lg:text-base"
              onClick={() => setPaymentModalOpen(true)}
            >
              💰 Make Payment
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white text-sm lg:text-base"
              onClick={() => setTransactionHistoryOpen(true)}
            >
              📊 View History
            </Button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-3 lg:p-4 border-t border-[#a3d9a5]">
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-600 hover:text-white text-sm lg:text-base"
            onClick={logout}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6 xl:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header - Added margin top for spacing */}
          <div className="mt-4 lg:mt-0 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#2c6e49]">
              {navigationItems.find(item => item.id === activeSection)?.name || 'Dashboard'}
            </h1>
            <p className="text-[#4c956c] mt-2 text-sm lg:text-base">
              Welcome back, {user?.name}! Here's your Chama overview.
            </p>
          </div>

          {/* Content - Added top padding for more spacing */}
          <div className="pt-4 lg:pt-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default UserDashboard;