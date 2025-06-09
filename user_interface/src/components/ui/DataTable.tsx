import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table.tsx';
import { cn } from '../../lib/utils';

interface DataTableProps<T> {
  columns: {
    id: string;
    header: React.ReactNode;
    cell: (item: T) => React.ReactNode;
    className?: string;
  }[];
  data: T[];
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  expandedRows?: Record<string, boolean>;
  renderExpandedContent?: (item: T) => React.ReactNode;
  getRowId?: (item: T) => string;
  maxHeight?: string;
}

function DataTable<T>({ 
  columns, 
  data, 
  className,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  expandedRows,
  renderExpandedContent,
  getRowId = (item: any) => item.id,
  maxHeight = "400px"
}: DataTableProps<T>) {
  return (
    <div className={cn(
      "overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700",
      "bg-white dark:bg-gray-800",
      "animate-fade-in",
      className
    )}>
      <div className={cn(`max-h-[${maxHeight}] overflow-auto`)}>
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={cn(
                    "text-[10px] md:text-xs font-medium",
                    "text-gray-500 dark:text-gray-300",
                    "whitespace-nowrap px-2 md:px-4",
                    "border-b border-gray-200 dark:border-gray-700",
                    column.className
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {columns.map((column) => (
                    <TableCell 
                      key={`loading-${index}-${column.id}`} 
                      className={cn("px-2 md:px-4", column.className)}
                    >
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center text-sm text-gray-500 dark:text-gray-400 py-4 md:py-6"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              // Data rows with optional expansion
              data.map((item, index) => {
                const rowId = getRowId(item);
                const isExpanded = expandedRows ? expandedRows[rowId] : false;
                
                return (
                  <React.Fragment key={rowId || index}>
                    <TableRow 
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-gray-700/50", 
                        "border-b border-gray-200 dark:border-gray-700",
                        isExpanded && "bg-gray-50 dark:bg-gray-700/50",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick && onRowClick(item)}
                    >
                      {columns.map((column) => (
                        <TableCell 
                          key={`${index}-${column.id}`} 
                          className={cn(
                            "py-2 md:py-3 px-2 md:px-4",
                            "text-[11px] md:text-xs",
                            "text-gray-900 dark:text-gray-200",
                            column.className
                          )}
                        >
                          {column.cell(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                    
                    {/* Expanded content if available and row is expanded */}
                    {isExpanded && renderExpandedContent && (
                      <TableRow className="bg-gray-50/50 dark:bg-gray-700/25">
                        <TableCell 
                          colSpan={columns.length} 
                          className="p-0 border-b border-gray-200 dark:border-gray-700"
                        >
                          {renderExpandedContent(item)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;
