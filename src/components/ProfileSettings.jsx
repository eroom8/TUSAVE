import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const ProfileSettings = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information' },
    { id: 'password', name: 'Change Password' },
    { id: 'preferences', name: 'Preferences' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#2c6e49] text-xl">Profile Settings</DialogTitle>
          <DialogDescription className="text-[#4c956c]">
            Manage your account information and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Tab Navigation */}
          <div className="border-b border-[#a3d9a5]">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#2c6e49] text-[#2c6e49]'
                      : 'border-transparent text-[#4c956c] hover:text-[#2c6e49] hover:border-[#a3d9a5]'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-[#1e4f34]">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="mt-1 border-[#a3d9a5] focus:border-[#2c6e49]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#1e4f34]">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="mt-1 border-[#a3d9a5] focus:border-[#2c6e49]"
                        disabled
                      />
                      <p className="text-xs text-[#4c956c] mt-1">
                        Phone number cannot be changed for security reasons
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#1e4f34]">Role</Label>
                      <p className="mt-1 text-[#4c956c] capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-[#1e4f34]">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="mt-1 border-[#a3d9a5] focus:border-[#2c6e49]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-[#1e4f34]">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="mt-1 border-[#a3d9a5] focus:border-[#2c6e49]"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-[#1e4f34]">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="mt-1 border-[#a3d9a5] focus:border-[#2c6e49]"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-[#2c6e49] hover:bg-[#1e4f34] text-white"
                    disabled={loading}
                  >
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <Card className="border-[#a3d9a5]">
                  <CardHeader>
                    <CardTitle className="text-[#1e4f34] text-base">Notifications</CardTitle>
                    <CardDescription className="text-[#4c956c]">
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1e4f34]">SMS Notifications</p>
                        <p className="text-sm text-[#4c956c]">Receive transaction alerts via SMS</p>
                      </div>
                      <Button variant="outline" className="border-[#2c6e49] text-[#2c6e49]">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1e4f34]">Monthly Statements</p>
                        <p className="text-sm text-[#4c956c]">Email monthly contribution statements</p>
                      </div>
                      <Button variant="outline" className="border-[#2c6e49] text-[#2c6e49]">
                        Enable
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#a3d9a5]">
                  <CardHeader>
                    <CardTitle className="text-[#1e4f34] text-base">Account Security</CardTitle>
                    <CardDescription className="text-[#4c956c]">
                      Additional security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white">
                      Enable Two-Factor Authentication
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;