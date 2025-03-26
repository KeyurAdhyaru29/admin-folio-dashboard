
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import UserTable, { User } from '../components/UserTable';
import UserForm from '../components/UserForm';
import PageTransition from '../components/PageTransition';
import { toast } from "sonner";

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

const Users: React.FC = () => {
  const { requireAuth } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

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

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader pageTitle="User Management" />
        <PageTransition>
          <main className="flex-1 overflow-y-auto p-6">
            <UserTable
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onAdd={handleAddUser}
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

export default Users;
