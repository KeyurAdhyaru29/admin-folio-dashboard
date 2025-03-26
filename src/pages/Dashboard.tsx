
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardHeader from '../components/DashboardHeader';
import PageTransition from '../components/PageTransition';
import DynamicSidebar from '../components/DynamicSidebar';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Layers, 
  BarChart4, 
  ShoppingCart, 
  DollarSign, 
  BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

const Dashboard: React.FC = () => {
  const { requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Sample data for charts
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
  ];

  const trafficData = [
    { name: 'Mon', desktop: 4000, mobile: 2400, tablet: 1200 },
    { name: 'Tue', desktop: 3000, mobile: 1398, tablet: 900 },
    { name: 'Wed', desktop: 2000, mobile: 3800, tablet: 1300 },
    { name: 'Thu', desktop: 2780, mobile: 3908, tablet: 1400 },
    { name: 'Fri', desktop: 1890, mobile: 4800, tablet: 1500 },
    { name: 'Sat', desktop: 2390, mobile: 3800, tablet: 1000 },
    { name: 'Sun', desktop: 3490, mobile: 4300, tablet: 1100 },
  ];

  // Define menu items
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, text: 'Dashboard', to: '/dashboard' },
    { id: 'users', icon: Users, text: 'Users', to: '/users' },
    { id: 'master', icon: Layers, text: 'Master', to: '/master' },
    { id: 'reports', icon: BarChart4, text: 'Reports', to: '/reports' },
    { id: 'settings', icon: Settings, text: 'Settings', to: '/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <DynamicSidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader pageTitle="Dashboard" />
        <PageTransition>
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users"
                value={2536}
                icon={Users}
                change={12}
                changeText="from last month"
                changeType="increase"
                color="bg-blue-500"
              />
              <StatCard 
                title="New Orders"
                value={846}
                icon={ShoppingCart}
                change={5}
                changeText="from last month"
                changeType="increase"
                color="bg-green-500"
              />
              <StatCard 
                title="Revenue"
                value={42500}
                icon={DollarSign}
                change={2}
                changeText="from last month"
                changeType="decrease"
                color="bg-purple-500"
              />
              <StatCard 
                title="Conversion Rate"
                value={15}
                icon={BarChart2}
                change={3}
                changeText="from last month"
                changeType="increase"
                color="bg-amber-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="bg-white p-5 rounded-xl border border-border shadow-sm"
              >
                <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="bg-white p-5 rounded-xl border border-border shadow-sm"
              >
                <h3 className="text-lg font-medium mb-4">Traffic by Device</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="desktop" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="mobile" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tablet" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="bg-white p-5 rounded-xl border border-border shadow-sm mt-6"
            >
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">New user registered</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">John Smith</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">2 min ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Order #1242 placed</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Emily Johnson</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">15 min ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Processing
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Payment received</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Michael Brown</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">1 hour ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Refund requested</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Sarah Davis</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">3 hours ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">New product added</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Admin</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">5 hours ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Dashboard;
