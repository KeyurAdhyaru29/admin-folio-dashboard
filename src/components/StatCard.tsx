
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change: number;
  changeText: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeText,
  changeType,
  color,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const steps = 20;
    const stepTime = animationDuration / steps;
    const increment = value / steps;
    let currentValue = 0;
    let timerId = 0;

    const updateValue = () => {
      currentValue += increment;
      if (currentValue > value) {
        currentValue = value;
        clearInterval(timerId);
      }
      setDisplayValue(Math.floor(currentValue));
    };

    timerId = window.setInterval(updateValue, stepTime);
    return () => clearInterval(timerId);
  }, [value]);

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-border"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">{displayValue.toLocaleString()}</p>
          </div>
          <div className={`mt-2 flex items-center text-sm ${
            changeType === 'increase' ? 'text-green-600' : 
            changeType === 'decrease' ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            <span className="mr-1">
              {changeType === 'increase' ? '↑' : 
               changeType === 'decrease' ? '↓' : '→'}
            </span>
            <span>{change}%</span>
            <span className="ml-1 text-muted-foreground">{changeText}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
