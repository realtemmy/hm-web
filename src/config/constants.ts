// Application constants
export const APP_NAME = 'Housing Management System'
export const APP_SHORT_NAME = 'HMS'

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy'
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm'
export const TIME_FORMAT = 'HH:mm'

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hms_auth_token',
  REFRESH_TOKEN: 'hms_refresh_token',
  USER: 'hms_user',
  THEME: 'hms_theme',
} as const

// API timeout
export const API_TIMEOUT = 30000 // 30 seconds

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

// Debounce delay for search inputs
export const SEARCH_DEBOUNCE_MS = 300

// Property types
export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'HOSTEL', label: 'Hostel' },
] as const

// Unit statuses
export const UNIT_STATUSES = [
  { value: 'AVAILABLE', label: 'Available', variant: 'success' },
  { value: 'OCCUPIED', label: 'Occupied', variant: 'default' },
  { value: 'MAINTENANCE', label: 'Under Maintenance', variant: 'warning' },
  { value: 'RESERVED', label: 'Reserved', variant: 'secondary' },
] as const

// Lease statuses
export const LEASE_STATUSES = [
  { value: 'PENDING', label: 'Pending Approval', variant: 'warning' },
  { value: 'ACTIVE', label: 'Active', variant: 'success' },
  { value: 'EXPIRED', label: 'Expired', variant: 'destructive' },
  { value: 'TERMINATED', label: 'Terminated', variant: 'secondary' },
] as const

// Payment statuses
export const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', variant: 'warning' },
  { value: 'COMPLETED', label: 'Completed', variant: 'success' },
  { value: 'FAILED', label: 'Failed', variant: 'destructive' },
  { value: 'REFUNDED', label: 'Refunded', variant: 'secondary' },
] as const

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Debit/Credit Card' },
  { value: 'paystack', label: 'Paystack' },
  { value: 'flutterwave', label: 'Flutterwave' },
] as const

// Maintenance statuses
export const MAINTENANCE_STATUSES = [
  { value: 'OPEN', label: 'Open', variant: 'destructive' },
  { value: 'IN_PROGRESS', label: 'In Progress', variant: 'warning' },
  { value: 'RESOLVED', label: 'Resolved', variant: 'success' },
  { value: 'CANCELLED', label: 'Cancelled', variant: 'secondary' },
] as const

// Maintenance priorities (1-5 scale)
export const MAINTENANCE_PRIORITIES = [
  { value: 1, label: 'Low', variant: 'secondary' },
  { value: 2, label: 'Normal', variant: 'default' },
  { value: 3, label: 'Medium', variant: 'default' },
  { value: 4, label: 'High', variant: 'warning' },
  { value: 5, label: 'Urgent', variant: 'destructive' },
] as const

// User roles
export const USER_ROLES = [
  { value: 'ADMIN', label: 'Landlord/Property Owner' },
  { value: 'USER', label: 'Tenant' },
] as const

// Nigerian states
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'FCT (Abuja)',
] as const

// Currency
export const CURRENCY = {
  CODE: 'NGN',
  SYMBOL: '₦',
  NAME: 'Nigerian Naira',
} as const
