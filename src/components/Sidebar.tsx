
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Layers,
  BarChart4
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  text: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  text, 
  to, 
  isActive, 
  isCollapsed 
}) => {
  return (
    <Link to={to} className="block">
      <motion.div
        className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'hover:bg-accent text-foreground'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="ml-3 font-medium">{text}</span>
        )}
      </motion.div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, text: 'Dashboard', to: '/dashboard' },
    { icon: Users, text: 'Users', to: '/users' },
    { icon: Layers, text: 'Master', to: '/master' },
    { icon: BarChart4, text: 'Reports', to: '/reports' },
    { icon: Settings, text: 'Settings', to: '/settings' },
  ];

  return (
    <motion.div
      layout
      className="h-screen bg-sidebar p-4 border-r border-sidebar-border flex flex-col relative"
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="flex items-center mb-8 mt-2">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xl font-bold flex items-center"
          >
            <span className="text-primary mr-2">Admin</span>
            <span>Panel</span>
          </motion.div>
        )}
      </div>

      <button
        className="absolute -right-3 top-10 bg-background rounded-full p-1 border border-border shadow-sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            text={item.text}
            to={item.to}
            isActive={location.pathname === item.to}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="pt-4 mt-4 border-t border-sidebar-border">
        {!isCollapsed && user && (
          <div className="px-4 py-2 mb-4">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center px-4 py-3 w-full text-destructive hover:bg-accent rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
