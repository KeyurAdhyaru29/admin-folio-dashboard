
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, Search } from 'lucide-react';

interface DashboardHeaderProps {
  pageTitle: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ pageTitle }) => {
  const { user } = useAuth();

  return (
    <header className="py-4 px-6 flex justify-between items-center border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
