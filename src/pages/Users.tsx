
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import UserForm from '../components/UserForm';
import PageTransition from '../components/PageTransition';
import { toast } from "sonner";
import { Edit, Trash2, LayoutDashboard, Users as UsersIcon, Settings, Layers, BarChart4 } from 'lucide-react';
import DynamicGrid, { GridColumn, GridAction } from '../components/DynamicGrid';
import DynamicSidebar from '../components/DynamicSidebar';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

// Initial mock data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    status: 'active',
    joinDate: '2023-02-20',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'user',
    status: 'inactive',
    joinDate: '2023-03-10',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2023-04-05',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'manager',
    status: 'active',
    joinDate: '2023-05-12',
  },
];

const UsersPage: React.FC = () => {
  const { requireAuth } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Define menu items
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, text: 'Dashboard', to: '/dashboard' },
    { id: 'users', icon: UsersIcon, text: 'Users', to: '/users' },
    { id: 'master', icon: Layers, text: 'Master', to: '/master' },
    { id: 'reports', icon: BarChart4, text: 'Reports', to: '/reports' },
    { id: 'settings', icon: Settings, text: 'Settings', to: '/settings' },
  ];

  const handleAddUser = () => {
    setCurrentUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast.success("User deleted successfully");
  };

  const handleSaveUser = (userData: Omit<User, 'id'> & { id?: string }) => {
    if (userData.id) {
      // Edit existing user
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userData.id ? { ...userData, id: user.id } as User : user
        )
      );
      toast.success("User updated successfully");
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: String(Math.floor(Math.random() * 10000)),
      } as User;
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      toast.success("User added successfully");
    }
    setIsFormOpen(false);
  };

  // Define grid columns
  const columns: GridColumn[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value: 'active' | 'inactive') => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      accessor: 'joinDate',
      sortable: true,
    },
  ];

  // Define grid actions
  const actions: GridAction[] = [
    {
      id: 'edit',
      icon: <Edit size={16} />,
      onClick: (user: User) => handleEditUser(user),
      className: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
    },
    {
      id: 'delete',
      icon: <Trash2 size={16} />,
      onClick: (user: User) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          handleDeleteUser(user.id);
        }
      },
      className: 'text-red-600 hover:text-red-800 hover:bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <DynamicSidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader pageTitle="User Management" />
        <PageTransition>
          <main className="flex-1 overflow-y-auto p-6">
            <DynamicGrid
              columns={columns}
              data={users}
              actions={actions}
              onAdd={handleAddUser}
              addButtonLabel="Add User"
              searchPlaceholder="Search users..."
              emptyMessage="No users found"
            />
            
            <UserForm
              user={currentUser}
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSave={handleSaveUser}
            />
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default UsersPage;
