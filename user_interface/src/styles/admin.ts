import { cn } from '../lib/utils';

export const adminStyles = {
  // Layout styles
  pageContainer: "p-4",
  headerContainer: "flex justify-between items-center mb-4",
  mainContainer: "bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700",
  contentContainer: "p-6",
  
  // Typography
  headerTitle: "text-2xl font-bold text-gray-900 dark:text-white",
  headerSubtitle: "text-sm text-gray-500 dark:text-gray-400 mt-1",
  modalTitle: "text-xl font-bold mb-4 text-gray-900 dark:text-white",
  modalText: "text-gray-700 dark:text-gray-300 mb-4",

  // Search components
  searchContainer: "relative mb-6",
  searchIcon: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400",
  searchInput: cn(
    "w-[300px] pl-9",
    "border-gray-300 dark:border-gray-600",
    "bg-white dark:bg-gray-700",
    "text-gray-900 dark:text-white",
    "focus:border-blue-500 focus:ring-blue-500"
  ),
  clearButton: cn(
    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8",
    "text-gray-500 hover:text-gray-700",
    "dark:text-gray-400 dark:hover:text-gray-200"
  ),

  // Button styles
  buttonIcon: "h-4 w-4 mr-2",
  primaryButton: "bg-blue-500 text-white hover:bg-blue-600 flex items-center",
  secondaryButton: cn(
    "bg-white dark:bg-gray-800",
    "text-gray-700 dark:text-gray-300",
    "border-gray-300 dark:border-gray-600",
    "hover:bg-gray-50 dark:hover:bg-gray-700"
  ),
  dangerButton: "px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600",
  cancelButton: cn(
    "px-4 py-2 text-sm font-medium",
    "text-gray-700 dark:text-gray-300",
    "bg-gray-100 dark:bg-gray-700",
    "rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
  ),

  // Modal styles
  modalOverlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center",
  modalContainer: "bg-white dark:bg-gray-800 p-6 rounded-lg w-[500px]",
  modalActions: "flex justify-end space-x-2",

  // Table styles
  tableContainer: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
  tableHeader: "bg-gray-50 dark:bg-gray-700/50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tableCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200",

  // Flex utilities
  flexBetween: "flex justify-between items-center",
  flexCenter: "flex items-center",
  flexGap2: "flex gap-2",

  // Common utilities
  roundedLg: "rounded-lg",
  shadow: "shadow-md",
  border: "border border-gray-200 dark:border-gray-700"
} as const;

// Action button combinations
export const actionButtons = {
  edit: cn(
    "text-blue-600 hover:text-blue-900",
    "dark:text-blue-400 dark:hover:text-blue-300"
  ),
  delete: cn(
    "text-red-600 hover:text-red-900",
    "dark:text-red-400 dark:hover:text-red-300"
  ),
  view: cn(
    "text-gray-600 hover:text-gray-900",
    "dark:text-gray-400 dark:hover:text-gray-300"
  )
} as const; 