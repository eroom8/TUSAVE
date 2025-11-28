import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { adminAPI } from '@/services/api';

const ChamaMembers = ({ open, onOpenChange, user }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // For regular users, we'll use the admin endpoint but you might want to create a members endpoint
      const response = await adminAPI.getUsers();
      if (response.success) {
        setMembers(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      // Fallback mock data for demonstration
      setMembers([
        {
          _id: '1',
          name: 'John Doe',
          phone: '254706361004',
          role: 'member',
          isActive: true,
          createdAt: '2024-01-15T10:30:00.000Z'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          phone: '254712345678',
          role: 'member',
          isActive: true,
          createdAt: '2024-01-20T14:25:00.000Z'
        },
        {
          _id: '3',
          name: 'Mike Johnson',
          phone: '254723456789',
          role: 'member',
          isActive: true,
          createdAt: '2024-01-25T09:15:00.000Z'
        },
        {
          _id: '4',
          name: 'Sarah Wilson',
          phone: '254734567890',
          role: 'admin',
          isActive: true,
          createdAt: '2024-01-10T08:45:00.000Z'
        },
        {
          _id: '5',
          name: 'David Brown',
          phone: '254745678901',
          role: 'member',
          isActive: true,
          createdAt: '2024-02-01T11:20:00.000Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      member: 'bg-[#edffe8] text-[#2c6e49] border-[#a3d9a5]',
      treasurer: 'bg-blue-100 text-blue-700 border-blue-200',
      secretary: 'bg-purple-100 text-purple-700 border-purple-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${roleStyles[role] || roleStyles.member}`}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
        isActive 
          ? 'bg-green-100 text-green-700 border-green-200' 
          : 'bg-gray-100 text-gray-700 border-gray-200'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#2c6e49] text-xl">Chama Members</DialogTitle>
          <DialogDescription className="text-[#4c956c]">
            View all members of our Chama community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search and Stats */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search members by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-[#a3d9a5] focus:border-[#2c6e49]"
              />
            </div>
            <div className="text-sm text-[#4c956c]">
              {filteredMembers.length} of {members.length} members
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#2c6e49] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member._id} className="border-[#a3d9a5] hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-[#4c956c] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-[#1e4f34] truncate">
                              {member.name}
                            </h3>
                            {getRoleBadge(member.role)}
                          </div>
                          <p className="text-sm text-[#4c956c] mb-1">
                            {member.phone}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(member.isActive)}
                            <span className="text-xs text-[#4c956c]">
                              Joined {formatDate(member.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-3 pt-3 border-t border-[#d8ffd0]">
                      <Button
                        variant="outline"
                        className="flex-1 text-xs border-[#2c6e49] text-[#2c6e49] hover:bg-[#2c6e49] hover:text-white"
                        size="sm"
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-xs border-[#4c956c] text-[#4c956c] hover:bg-[#4c956c] hover:text-white"
                        size="sm"
                      >
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#edffe8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4c956c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-[#4c956c] text-lg">No members found</p>
              <p className="text-sm text-[#4c956c] mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'No members available at the moment'}
              </p>
            </div>
          )}

          {/* Summary Stats */}
          {!loading && members.length > 0 && (
            <Card className="border-[#a3d9a5] bg-[#edffe8]">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#2c6e49]">{members.length}</p>
                    <p className="text-xs text-[#4c956c]">Total Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2c6e49]">
                      {members.filter(m => m.role === 'admin').length}
                    </p>
                    <p className="text-xs text-[#4c956c]">Admins</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2c6e49]">
                      {members.filter(m => m.role === 'member').length}
                    </p>
                    <p className="text-xs text-[#4c956c]">Regular Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2c6e49]">
                      {members.filter(m => m.isActive).length}
                    </p>
                    <p className="text-xs text-[#4c956c]">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChamaMembers;