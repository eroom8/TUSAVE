import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { superAdminAPI } from '@/services/api';
import ThemeToggle from './ThemeToggle';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [overviewData, setOverviewData] = useState(null);
  const [chamaGroups, setChamaGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  const [newChamaGroup, setNewChamaGroup] = useState({
    name: '',
    monthlyContribution: 1000,
    description: ''
  });

  const backgroundGradient = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900/20'
    : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50';

  const cardBackground = theme === 'dark' 
    ? 'bg-gray-800/80 border-gray-700 backdrop-blur-sm'
    : 'bg-white/80 border-purple-200 backdrop-blur-sm';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const descriptionColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [overview, groups, users] = await Promise.all([
        superAdminAPI.getOverview(),
        superAdminAPI.getChamaGroups(),
        superAdminAPI.getUsers()
      ]);
      
      setOverviewData(overview.data);
      setChamaGroups(groups.data || []);
      setAllUsers(users.data || []);
    } catch (error) {
      console.error('Error fetching super admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChamaGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminAPI.createChamaGroup(newChamaGroup);
      if (response.success) {
        alert('Chama group created successfully!');
        setNewChamaGroup({ name: '', monthlyContribution: 1000, description: '' });
        fetchOverviewData();
      }
    } catch (error) {
      console.error('Error creating chama group:', error);
      alert('Failed to create chama group');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await superAdminAPI.updateUserRole(userId, { role: newRole });
      if (response.success) {
        alert('User role updated successfully!');
        fetchOverviewData();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen w-full ${backgroundGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`font-medium ${textColor}`}>Loading super admin dashboard...</p>
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
          <div className={`w-12 h-12 bg-gradient-to-br ${color === 'text-purple-600' ? 'from-purple-500 to-indigo-600' : color === 'text-green-600' ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-cyan-600'} rounded-xl flex items-center justify-center text-white ml-3 flex-shrink-0`}>
            <span className="text-base">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen w-full ${backgroundGradient} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-purple-200'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                ChamaPro Super Admin
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                System Administrator Panel
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
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="chama-groups">Chama Groups</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  title="Total Users"
                  value={overviewData?.totalUsers || 0}
                  description="Registered users"
                  icon="👥"
                  color="text-purple-600"
                />
                <StatCard
                  title="Chama Groups"
                  value={overviewData?.totalChamaGroups || 0}
                  description="Active groups"
                  icon="🏢"
                  color="text-green-600"
                />
                <StatCard
                  title="Total Contributions"
                  value={`KSh ${(overviewData?.totalContributions || 0).toLocaleString()}`}
                  description="System-wide"
                  icon="💰"
                  color="text-blue-600"
                />
                <StatCard
                  title="Active Admins"
                  value={overviewData?.activeAdmins || 0}
                  description="Chama + Super admins"
                  icon="👑"
                  color="text-orange-600"
                />
              </div>

              {/* System Health */}
              <Card className={cardBackground}>
                <CardHeader>
                  <CardTitle className={textColor}>System Health</CardTitle>
                  <CardDescription className={descriptionColor}>Current system status and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-600">Database</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Connected to MongoDB</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-600">M-Pesa API</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Payment gateway active</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chama Groups Tab */}
            <TabsContent value="chama-groups" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create New Chama Group */}
                <Card className={cardBackground}>
                  <CardHeader>
                    <CardTitle className={textColor}>Create New Chama Group</CardTitle>
                    <CardDescription className={descriptionColor}>Add a new chama group to the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateChamaGroup} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className={textColor}>Group Name</Label>
                        <Input
                          id="name"
                          value={newChamaGroup.name}
                          onChange={(e) => setNewChamaGroup({...newChamaGroup, name: e.target.value})}
                          placeholder="Tusave Investment Group"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthlyContribution" className={textColor}>Monthly Contribution (KSh)</Label>
                        <Input
                          id="monthlyContribution"
                          type="number"
                          value={newChamaGroup.monthlyContribution}
                          onChange={(e) => setNewChamaGroup({...newChamaGroup, monthlyContribution: parseInt(e.target.value)})}
                          placeholder="1000"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className={textColor}>Description</Label>
                        <Input
                          id="description"
                          value={newChamaGroup.description}
                          onChange={(e) => setNewChamaGroup({...newChamaGroup, description: e.target.value})}
                          placeholder="Group description"
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                        Create Chama Group
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Chama Groups List */}
                <Card className={cardBackground}>
                  <CardHeader>
                    <CardTitle className={textColor}>Existing Chama Groups</CardTitle>
                    <CardDescription className={descriptionColor}>
                      {chamaGroups.length} groups in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {chamaGroups.map((group) => (
                        <div key={group._id} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-purple-100'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{group.name}</h4>
                              <p className="text-sm text-gray-500">KSh {group.monthlyContribution}/month</p>
                              <p className="text-xs text-gray-400">{group.members?.length || 0} members</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive" className="text-xs">
                                Delete
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

            {/* Users Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className={cardBackground}>
                <CardHeader>
                  <CardTitle className={textColor}>User Management</CardTitle>
                  <CardDescription className={descriptionColor}>
                    Manage all users in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className={`text-left py-3 px-4 ${textColor}`}>Name</th>
                          <th className={`text-left py-3 px-4 ${textColor}`}>Phone</th>
                          <th className={`text-left py-3 px-4 ${textColor}`}>Role</th>
                          <th className={`text-left py-3 px-4 ${textColor}`}>Chama</th>
                          <th className={`text-left py-3 px-4 ${textColor}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((userItem) => (
                          <tr key={userItem._id} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <td className="py-3 px-4">{userItem.name}</td>
                            <td className="py-3 px-4">{userItem.phone}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                userItem.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                userItem.role === 'chama_admin' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {userItem.role.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4">{userItem.chamaGroup?.name || 'Unassigned'}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <select
                                  className={`text-xs p-1 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                  value={userItem.role}
                                  onChange={(e) => handleUpdateUserRole(userItem._id, e.target.value)}
                                >
                                  <option value="member">Member</option>
                                  <option value="chama_admin">Chama Admin</option>
                                  <option value="super_admin">Super Admin</option>
                                </select>
                                <Button size="sm" variant="outline" className="text-xs">
                                  Reset Password
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className={cardBackground}>
                <CardHeader>
                  <CardTitle className={textColor}>System Settings</CardTitle>
                  <CardDescription className={descriptionColor}>
                    Configure system-wide settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="system-name" className={textColor}>System Name</Label>
                    <Input id="system-name" defaultValue="ChamaPro" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="max-group-size" className={textColor}>Maximum Group Size</Label>
                    <Input id="max-group-size" type="number" defaultValue="50" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="minimum-contribution" className={textColor}>Minimum Contribution (KSh)</Label>
                    <Input id="minimum-contribution" type="number" defaultValue="100" className="mt-1" />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;