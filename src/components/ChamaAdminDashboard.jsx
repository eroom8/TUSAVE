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
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  UserPlus, 
  Download, 
  BarChart3,
  Calendar,
  Activity,
  Shield,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

const ChamaAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [chamaMembers, setChamaMembers] = useState([]);
  const [chamaContributions, setChamaContributions] = useState([]);
  const [chamaSummary, setChamaSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Dynamic styles based on theme
  const backgroundGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-emerald-900/20'
    : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50';

  const cardBackground = theme === 'dark' 
    ? 'bg-gray-800/80 border-gray-700 backdrop-blur-sm'
    : 'bg-white/80 border-blue-200 backdrop-blur-sm';

  const mobileHeaderBg = theme === 'dark'
    ? 'bg-gray-800/90 border-gray-700'
    : 'bg-white/90 border-blue-200';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const descriptionColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-blue-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-50';

  useEffect(() => {
    fetchChamaData();
  }, []);

  const fetchChamaData = async () => {
    setLoading(true);
    try {
      const [dashboard, members, contributions, summary, activity] = await Promise.all([
        chamaAdminAPI.getDashboard(),
        memberAPI.getChamaMembers(),
        chamaAdminAPI.getContributions(user?.chamaGroup?._id),
        memberAPI.getChamaSummary(),
        chamaAdminAPI.getRecentActivity(user?.chamaGroup?._id)
      ]);
      
      setDashboardData(dashboard.data);
      setChamaMembers(members.data || []);
      setChamaContributions(contributions.data || []);
      setChamaSummary(summary.data);
      setRecentActivity(activity.data || []);
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

  const handleDownloadReport = async (type) => {
    try {
      const response = await chamaAdminAPI.downloadReport(user?.chamaGroup?._id, type);
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user?.chamaGroup?.name}_${type}_report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'members',
      name: 'Members',
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'contributions',
      name: 'Contributions',
      icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: <Download className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  const quickActions = [
    {
      name: 'Add New Member',
      description: 'Invite new member',
      icon: <UserPlus className="w-5 h-5" />,
      action: () => setActiveTab('members'),
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50',
      textColor: theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
    },
    {
      name: 'View Reports',
      description: 'Download statements',
      icon: <Download className="w-5 h-5" />,
      action: () => setActiveTab('reports'),
      gradient: 'from-green-500 to-emerald-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-green-50',
      textColor: theme === 'dark' ? 'text-green-300' : 'text-green-700'
    },
    {
      name: 'Send Reminders',
      description: 'Notify members',
      icon: <Bell className="w-5 h-5" />,
      action: () => alert('Coming soon!'),
      gradient: 'from-purple-500 to-indigo-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50',
      textColor: theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
    },
    {
      name: 'Group Settings',
      description: 'Update group info',
      icon: <Settings className="w-5 h-5" />,
      action: () => alert('Coming soon!'),
      gradient: 'from-orange-500 to-amber-600',
      bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50',
      textColor: theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
    },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen w-full ${backgroundGradient} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`font-medium ${textColor}`}>Loading admin dashboard...</p>
          <p className={`${descriptionColor} text-sm mt-2`}>Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, description, icon, trend, gradient }) => (
    <Card className={`${cardBackground} shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-medium mb-1 truncate ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{title}</p>
            <p className={`text-lg sm:text-2xl font-bold truncate ${textColor}`}>{value}</p>
            <p className={`text-xs mt-1 truncate ${theme === 'dark' ? 'text-blue-300' : 'text-blue-500'}`}>{description}</p>
            {trend && (
              <p className={`text-xs font-medium mt-1 ${trend.color}`}>
                {trend.value} {trend.label}
              </p>
            )}
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-white ml-3 flex-shrink-0`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity, index }) => (
    <div key={index} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-white/50 border-blue-100 hover:bg-white'} transition-colors duration-200`}>
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
          <Activity className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-semibold text-sm sm:text-base truncate ${textColor}`}>{activity.action}</p>
          <p className={`text-xs truncate ${descriptionColor}`}>
            {new Date(activity.timestamp).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
            By: {activity.userName}
          </p>
        </div>
      </div>
      <div className="text-right ml-2 flex-shrink-0">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          activity.type === 'contribution' 
            ? theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
            : theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
        }`}>
          {activity.type}
        </span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="Group Members"
                value={chamaMembers.length}
                description="Total active members"
                icon={<Users className="w-4 h-4 sm:w-6 sm:h-6" />}
                gradient="from-blue-500 to-cyan-600"
                trend={{ value: '+2', label: 'this month', color: 'text-green-600' }}
              />
              <StatCard
                title="Total Savings"
                value={`KSh ${(chamaSummary?.totalSavings || 0).toLocaleString()}`}
                description="Group total savings"
                icon={<DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />}
                gradient="from-green-500 to-emerald-600"
              />
              <StatCard
                title="Monthly Target"
                value={`KSh ${(chamaSummary?.monthlyTarget || 0).toLocaleString()}`}
                description="Monthly contribution goal"
                icon={<Target className="w-4 h-4 sm:w-6 sm:h-6" />}
                gradient="from-purple-500 to-indigo-600"
              />
              <StatCard
                title="Completion Rate"
                value={`${(chamaSummary?.completionRate || 0)}%`}
                description="This month's progress"
                icon={<TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />}
                gradient="from-orange-500 to-amber-600"
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
                    <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Manage your Chama group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 transform hover:scale-105 group ${action.bgColor} ${theme === 'dark' ? 'border-gray-600' : 'border-blue-200'}`}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
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

                {/* Recent Activity */}
                <Card className={cardBackground}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Recent Activity</CardTitle>
                        <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Latest group activities</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        className={`text-xs sm:text-sm ${theme === 'dark' ? 'border-gray-600 text-blue-300 hover:bg-gray-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 sm:space-y-3">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                          <ActivityItem key={index} activity={activity} />
                        ))
                      ) : (
                        <div className="text-center py-8 sm:py-12">
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                            <Activity className={`w-8 h-8 sm:w-10 sm:h-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-400'}`} />
                          </div>
                          <p className={`font-medium text-sm sm:text-base ${descriptionColor}`}>No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Admin Info */}
                <Card className={cardBackground}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Admin Profile</CardTitle>
                    <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Your administrator information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold text-sm sm:text-lg truncate ${textColor}`}>{user?.name}</h3>
                        <p className={`text-xs sm:text-sm truncate ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>{user?.phone}</p>
                        <div className="flex items-center mt-1">
                          <Shield className="w-3 h-3 mr-1 text-blue-500" />
                          <span className={`text-xs font-medium rounded-full capitalize ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                            Group Administrator
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      {user?.chamaGroup?.createdAt && (
                        <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-blue-100'}`}>
                          <span className={descriptionColor}>Group Created</span>
                          <span className={`font-medium text-right ${textColor}`}>
                            {new Date(user.chamaGroup.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-blue-100'}`}>
                        <span className={descriptionColor}>Monthly Target</span>
                        <span className="font-medium text-green-600">
                          KSh {user?.chamaGroup?.monthlyContribution?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Group Info Card */}
                <Card className={cardBackground}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Group Information</CardTitle>
                    <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>Chama details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span className={`text-sm ${descriptionColor}`}>Meeting Day:</span>
                        <span className="ml-2 font-medium text-sm ${textColor}">Every Tuesday</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span className={`text-sm ${descriptionColor}`}>Active Members:</span>
                        <span className="ml-2 font-medium text-sm ${textColor}">{chamaMembers.length}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                        <span className={`text-sm ${descriptionColor}`}>Total Savings:</span>
                        <span className="ml-2 font-medium text-sm text-green-600">
                          KSh {(chamaSummary?.totalSavings || 0).toLocaleString()}
                        </span>
                      </div>
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
            {/* Add New Member */}
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Add New Member</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  Add a new member to your chama group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="md:col-span-2">
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
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member to Chama
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Group Members</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  {chamaMembers.length} members in your chama
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chamaMembers.map((member) => (
                    <div key={member._id} className={`p-3 sm:p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-white/50 border-blue-100 hover:bg-white'} transition-colors duration-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {member.name?.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`font-semibold text-sm sm:text-base truncate ${textColor}`}>{member.name}</h4>
                            <p className={`text-xs sm:text-sm truncate ${descriptionColor}`}>{member.phone}</p>
                            <p className={`text-xs truncate ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                              {member.email || 'No email provided'}
                            </p>
                            <p className={`text-xs font-medium mt-1 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                              Member since: {new Date(member.joinDate || member.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className={`text-xs ${theme === 'dark' ? 'border-red-800 text-red-400 hover:bg-red-900/50 hover:border-red-700' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
                            onClick={() => handleRemoveMember(member._id)}
                          >
                            Remove
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className={`text-xs ${theme === 'dark' ? 'border-gray-600 text-blue-300 hover:bg-gray-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'contributions':
        return (
          <div className="space-y-6">
            <Card className={cardBackground}>
              <CardHeader>
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Contributions Overview</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  All contributions in your chama group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                  <Card className={theme === 'dark' ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                          KSh {chamaContributions.reduce((sum, c) => sum + (c.amount || 0), 0).toLocaleString()}
                        </p>
                        <p className={`text-xs sm:text-sm ${descriptionColor}`}>Total Contributions</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={theme === 'dark' ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                          {chamaContributions.length}
                        </p>
                        <p className={`text-xs sm:text-sm ${descriptionColor}`}>Total Transactions</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  {chamaContributions.length > 0 ? (
                    chamaContributions.map((contribution) => (
                      <div key={contribution._id} className={`p-3 sm:p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-white/50 border-green-100 hover:bg-white'} transition-colors duration-200`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {contribution.user?.name?.charAt(0) || 'M'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className={`font-semibold text-sm sm:text-base truncate ${textColor}`}>
                                {contribution.user?.name || 'Member'}
                              </h4>
                              <p className={`text-xs sm:text-sm truncate ${descriptionColor}`}>
                                {new Date(contribution.createdAt).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className={`text-xs font-mono truncate ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                                Receipt: {contribution.mpesaReceiptNumber}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-2 flex-shrink-0">
                            <p className={`text-lg sm:text-xl font-bold whitespace-nowrap ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
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
                    <div className="text-center py-8 sm:py-12">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'}`}>
                        <DollarSign className={`w-8 h-8 sm:w-10 sm:h-10 ${theme === 'dark' ? 'text-green-400' : 'text-green-400'}`} />
                      </div>
                      <p className={`font-medium text-sm sm:text-base ${descriptionColor}`}>No contributions yet</p>
                      <p className={`text-xs sm:text-sm mt-1 ${descriptionColor}`}>Members haven't made any contributions yet</p>
                    </div>
                  )}
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
                <CardTitle className={`text-lg sm:text-xl font-bold ${textColor}`}>Generate Reports</CardTitle>
                <CardDescription className={`text-sm sm:text-base ${descriptionColor}`}>
                  Download detailed chama group reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDownloadReport('monthly')}
                    className={`p-4 sm:p-6 rounded-xl border transition-all duration-200 transform hover:scale-105 group ${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                        <Download className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'} mb-1`}>
                        Monthly Statement
                      </h3>
                      <p className={`text-xs sm:text-sm ${descriptionColor}`}>Detailed monthly report</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleDownloadReport('performance')}
                    className={`p-4 sm:p-6 rounded-xl border transition-all duration-200 transform hover:scale-105 group ${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-green-50 border-green-200 hover:bg-green-100'}`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                        <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-green-300' : 'text-green-700'} mb-1`}>
                        Performance Report
                      </h3>
                      <p className={`text-xs sm:text-sm ${descriptionColor}`}>Group performance analytics</p>
                    </div>
                  </button>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h4 className={`font-semibold text-base sm:text-lg mb-4 ${textColor}`}>Quick Stats</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                      <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                        {chamaContributions.length}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Total Transactions</p>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
                      <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                        KSh {chamaContributions.reduce((sum, c) => sum + (c.amount || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                      <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                        {chamaMembers.length}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Active Members</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card className={cardBackground}>
            <CardContent className="p-6">
              <div className="text-center">
                <Settings className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Group Settings</h3>
                <p className={descriptionColor}>Group settings will be available soon</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className={`min-h-screen w-full ${backgroundGradient} transition-colors duration-300`}>
      {/* Mobile Header */}
      <div className={`lg:hidden sticky top-0 z-40 backdrop-blur-sm border-b ${mobileHeaderBg}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                ChamaPro Admin
              </h1>
              <p className="text-xs text-gray-500 truncate">{user?.chamaGroup?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              onClick={() => setActiveTab('members')}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 min-h-screen p-6">
          <Card className={`shadow-xl h-full ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-blue-200'}`}>
            <CardContent className="p-6 h-full flex flex-col">
              {/* Logo and Theme Toggle */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    ChamaPro
                  </h1>
                  <p className={`text-sm mt-1 font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                    Admin Portal
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{user?.chamaGroup?.name}</p>
                </div>
                <ThemeToggle />
              </div>

              {/* Admin Info */}
              <div className={`flex items-center space-x-3 p-3 rounded-lg mb-6 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-sm font-semibold truncate ${textColor}`}>{user?.name}</h3>
                  <p className="text-xs truncate text-gray-500">Group Administrator</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 flex-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200'
                        : `${textColor} ${hoverBg} hover:shadow-md`
                    }`}
                  >
                    <div className={`${activeTab === item.id ? 'text-white' : theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions & Logout */}
              <div className={`space-y-4 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-blue-100'}`}>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-10"
                    onClick={() => setActiveTab('members')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                  <Button
                    variant="outline"
                    className={`text-sm h-10 ${theme === 'dark' ? 'border-gray-600 text-blue-300 hover:bg-gray-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Reports
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  className={`w-full h-10 ${theme === 'dark' ? 'border-red-800 text-red-400 hover:bg-red-900/50 hover:border-red-700' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
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
            <div className={`absolute left-0 top-0 h-full w-64 backdrop-blur-sm border-r overflow-y-auto ${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-blue-200'}`}>
              <Card className="h-full border-0 shadow-none bg-transparent">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Logo */}
                  <div className="text-center mb-6">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      ChamaPro Admin
                    </h1>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user?.chamaGroup?.name}</p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2 flex-1">
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200'
                            : `${textColor} ${hoverBg} hover:shadow-md`
                        }`}
                      >
                        <div className={`${activeTab === item.id ? 'text-white' : theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Logout */}
                  <Button
                    variant="outline"
                    className={`w-full h-10 mt-6 text-xs ${theme === 'dark' ? 'border-red-800 text-red-400 hover:bg-red-900/50 hover:border-red-700' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
                    onClick={logout}
                  >
                    <LogOut className="w-3 h-3 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header - Desktop */}
            <div className="hidden lg:block mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    {navigationItems.find(item => item.id === activeTab)?.name || 'Admin Dashboard'}
                  </h1>
                  <p className={`mt-2 text-sm sm:text-base lg:text-lg ${descriptionColor}`}>
                    Welcome back, <span className={`font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>{user?.name}</span>! { 
                      activeTab === 'dashboard' ? "Here's your Chama overview." :
                      activeTab === 'members' ? "Manage your Chama members." :
                      activeTab === 'reports' ? "Generate detailed reports." :
                      "Administer your Chama group."
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

export default ChamaAdminDashboard;