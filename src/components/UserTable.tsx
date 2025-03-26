
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, ChevronDown, ChevronUp, MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onAdd: () => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onAdd }) => {
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDeleteConfirm = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      onDelete(userId);
      toast({
        title: "User deleted",
        description: `${userName} has been removed`,
      });
    }
  };

  const SortIcon = ({ field }: { field: keyof User }) => {
    if (sortField !== field) return <ChevronDown size={16} className="text-muted-foreground opacity-50" />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center font-medium shadow-sm"
        >
          <UserPlus size={16} className="mr-2" />
          Add User
        </motion.button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('email')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Email</span>
                  <SortIcon field="email" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('role')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Role</span>
                  <SortIcon field="role" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Status</span>
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('joinDate')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Join Date</span>
                  <SortIcon field="joinDate" />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {sortedUsers.map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(user)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors rounded-md hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteConfirm(user.id, user.name)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors rounded-md hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {sortedUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                  {searchTerm ? 'No users match your search criteria' : 'No users found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-muted/30 px-6 py-3 flex justify-between items-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{sortedUsers.length}</span> of{' '}
          <span className="font-medium">{users.length}</span> users
        </p>
      </div>
    </div>
  );
};

export default UserTable;
