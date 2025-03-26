
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface GridColumn {
  id: string;
  header: string;
  accessor: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  cellClassName?: string;
}

export interface GridAction {
  id: string;
  label?: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
  className?: string;
}

interface DynamicGridProps {
  columns: GridColumn[];
  data: any[];
  onAdd?: () => void;
  addButtonLabel?: string;
  actions?: GridAction[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string;
}

const DynamicGrid: React.FC<DynamicGridProps> = ({
  columns,
  data,
  onAdd,
  addButtonLabel = "Add New",
  actions = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
  className = "",
  rowClassName = "",
}) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(item => 
    Object.values(item).some(
      value => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data based on sort field and direction
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown size={16} className="text-muted-foreground opacity-50" />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className={`bg-white border border-border rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {onAdd && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAdd}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center font-medium shadow-sm"
          >
            <PlusCircle size={16} className="mr-2" />
            {addButtonLabel}
          </motion.button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.id} 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {column.sortable !== false ? (
                    <button 
                      onClick={() => handleSort(column.accessor)}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <span>{column.header}</span>
                      <SortIcon field={column.accessor} />
                    </button>
                  ) : (
                    <span>{column.header}</span>
                  )}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {sortedData.map((row, rowIndex) => (
                <motion.tr 
                  key={row.id || `row-${rowIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`hover:bg-muted/30 transition-colors ${rowClassName}`}
                >
                  {columns.map(column => (
                    <td 
                      key={`${row.id || rowIndex}-${column.id}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${column.cellClassName || ''}`}
                    >
                      {column.render 
                        ? column.render(row[column.accessor], row)
                        : row[column.accessor]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end items-center space-x-2">
                        {actions.map(action => (
                          <motion.button
                            key={action.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => action.onClick(row)}
                            className={`p-1 rounded-md transition-colors ${action.className || ''}`}
                            title={action.label}
                          >
                            {action.icon}
                          </motion.button>
                        ))}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
            {sortedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-10 text-center text-muted-foreground">
                  {searchTerm ? `No results match "${searchTerm}"` : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-muted/30 px-6 py-3 flex justify-between items-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{sortedData.length}</span> of{' '}
          <span className="font-medium">{data.length}</span> items
        </p>
      </div>
    </div>
  );
};

export default DynamicGrid;
