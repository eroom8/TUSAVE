import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { chamaAdminAPI, memberAPI } from '@/services/api';
import ThemeToggle from './ThemeToggle';

const ChamaAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [chamaMembers, setChamaMembers] = useState([]);
  const [chamaContributions, setChamaContributions] = useState([]);
  const [chamaSummary, setChamaSummary] = useState(null);
  
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const backgroundGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-emerald-900/20'
    : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50';

  const cardBackground = theme === 'dark' 
    ? 'bg-gray-800/80 border-gray-700 backdrop-blur-sm'
    : 'bg-white/80 border-blue-200 backdrop-blur-sm';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const descriptionColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  useEffect(() => {
    fetchChamaData();
  }, []);

  const fetchChamaData = async () => {
    setLoading(true);
    try {
      const [dashboard, members, contributions, summary] = await Promise.all([
        chamaAdminAPI.getDashboard(),
        memberAPI.getChamaMembers(),
        chamaAdminAPI.getContributions(user?.chamaGroup?._id),
        memberAPI.getChamaSummary()
      ]);
      
      setDashboardData(dashboard.data);
      setChamaMembers(members.data || []);
      setChamaContributions(contributions.data || []);
      setChamaSummary(summary.data);
    } catch (error) {
      console.error('Error fetching chama admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await chamaAdminAPI.addMember(user?.chamaGroup?._id, newMember);
      if (response.success) {
        alert('Member added successfully!');
        setNewMember({ name: '', phone: '', email: '' });
        fetchChamaData();
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const response = await chamaAdminAPI.removeMember(user?.chamaGroup?._id, memberId);
        if (response.success) {
          alert('Member removed successfully!');
          fetchChamaData();
        }
      } catch (error) {
        console.error('Error removing member:', error);
        alert('Failed to remove member');
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen w-full ${backgroundGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`font-medium ${textColor}`}>Loading chama admin dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, description, icon, color }) => (
    <Card className={`${cardBackground} shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium mb-1 truncate ${color}`}>{title}</p>
            <p className={`text-2xl font-bold truncate ${textColor}`}>{value}</p>
            <p className={`text-xs mt-1 truncate ${descriptionColor}`}>{description}</p>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-br ${color === 'text-blue-600' ? 'from-blue-500 to-cyan-600' : color === 'text-green-600' ? 'from-green-500 to-emerald-600' : 'from-purple-500 to-indigo-600'} rounded-xl flex items-center justify-center text-white ml-3 flex-shrink-0`}>
            <span className="text-base">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen w-full ${backgroundGradient} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-blue-200'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                ChamaPro Admin - {user?.chamaGroup?.name}
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                Group Administrator Panel
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <span className={`text-sm ${descriptionColor}`}>Welcome, {user?.name}</span>
            <Button 
              variant="outline" 
              className={`${theme === 'dark' ? 'border-red-800 text-red-400 hover:bg-red-900/50 hover:border-red-700' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="members">Member Management</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  title="Group Members"
                  value={chamaMembers.length}
                  description="Total members"
                  icon="👥"
                  color="text-blue-600"
                />
                <StatCard
                  title="Total Savings"
                  value={`KSh ${(chamaSummary?.totalSavings || 0).toLocaleString()}`}
                  description="Group savings"
                  icon="💰"
                  color="text-green-600"
                />
                <StatCard
                  title="Monthly Target"
                  value={`KSh ${(chamaSummary?.monthlyTarget || 0).toLocaleString()}`}
                  description="Monthly contributions"
                  icon="🎯"
                  color="text-purple-600"
                />
                <StatCard
                  title="Completion Rate"
                  value={`${(chamaSummary?.completionRate || 0)}%`}
                  description="This month"
                  icon="📈"
                  color="text-orange-600"
                />
              </div>

              {/* Group Information */}
              <Card className={cardBackground}>
                <CardHeader>
                  <CardTitle className={textColor}>Group Information</CardTitle>
                  <CardDescription className={descriptionColor}>Chama group details and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Group Name</p>
                      <p className="font-medium text-gray-900">{user?.chamaGroup?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Contribution</p>
                      <p className="font-medium text-gray-900">KSh {user?.chamaGroup?.monthlyContribution?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Group Admin</p>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Established</p>
                      <p className="font-medium text-gray-900">
                        {new Date(user?.chamaGroup?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Member Management Tab */}
            <TabsContent value="members" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add New Member */}
                <Card className={cardBackground}>
                  <CardHeader>
                    <CardTitle className={textColor}>Add New Member</CardTitle>
                    <CardDescription className={descriptionColor}>Add a new member to your chama group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddMember} className="space-y-4">
                      <div>
                        <Label htmlFor="member-name" className={textColor}>Full Name</Label>
                        <Input
                          id="member-name"
                          value={newMember.name}
                          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                          placeholder="John Doe"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-phone" className={textColor}>Phone Number</Label>
                        <Input
                          id="member-phone"
                          value={newMember.phone}
                          onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                          placeholder="254712345678"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-email" className={textColor}>Email (Optional)</Label>
                        <Input
                          id="member-email"
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                          placeholder="john@example.com"
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Add Member to Chama
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Members List */}
                <Card className={cardBackground}>
                  <CardHeader>
                    <CardTitle className={textColor}>Group Members</CardTitle>
                    <CardDescription className={descriptionColor}>
                      {chamaMembers.length} members in your chama
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {chamaMembers.map((member) => (
                        <div key={member._id} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-blue-100'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {member.name?.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                                <p className="text-sm text-gray-500">{member.phone}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => handleRemoveMember(member._id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contributions Tab */}
            <TabsContent value="contributions" className="space-y-6">
              <Card className={cardBackground}>
                <CardHeader>
                  <CardTitle className={textColor}>Recent Contributions</CardTitle>
                  <CardDescription className={descriptionColor}>
                    All contributions in your chama group
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chamaContributions.length > 0 ? (
                      chamaContributions.map((contribution) => (
                        <div key={contribution._id} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-blue-100'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{contribution.user?.name}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(contribution.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400">Receipt: {contribution.mpesaReceiptNumber}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                KSh {contribution.amount?.toLocaleString()}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                              }`}>
                                ✓ Completed
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className={descriptionColor}>No contributions yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card className={cardBackground}>
                <CardHeader>
                  <CardTitle className={textColor}>Generate Reports</CardTitle>
                  <CardDescription className={descriptionColor}>
                    Download chama group reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button className="h-20 bg-blue-600 hover:bg-blue-700 text-white">
                      <div className="text-center">
                        <div className="text-2xl mb-1">📄</div>
                        <div className="text-sm">Monthly Statement</div>
                      </div>
                    </Button>
                    <Button className="h-20 bg-green-600 hover:bg-green-700 text-white">
                      <div className="text-center">
                        <div className="text-2xl mb-1">📊</div>
                        <div className="text-sm">Performance Report</div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {chamaContributions.length}
                        </p>
                        <p className="text-sm text-gray-600">Total Transactions</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          KSh {chamaContributions.reduce((sum, c) => sum + (c.amount || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total Amount</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ChamaAdminDashboard;