export type UserRole = 'admin' | 'barber' | 'attendant';

export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'other';

export type StockMovementType = 'purchase' | 'sale' | 'adjustment' | 'return';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  business_hours: {
    [key: string]: { open: string | null; close: string | null };
  };
  default_appointment_duration: number;
  low_stock_threshold: number;
  currency: string;
  timezone: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  birth_date: string | null;
  is_vip: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  sku: string | null;
  category: string | null;
  price: number;
  cost: number | null;
  stock_quantity: number;
  low_stock_alert: number;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: string;
  user_id: string;
  tenant_id: string;
  specialty: string | null;
  commission_rate: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  client_id: string;
  barber_id: string;
  service_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes: string | null;
  reminder_sent: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  barber?: Barber;
  service?: Service;
}

export interface Sale {
  id: string;
  tenant_id: string;
  client_id: string | null;
  appointment_id: string | null;
  sale_date: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  notes: string | null;
  receipt_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  items?: SaleItem[];
  payments?: Payment[];
}

export interface SaleItem {
  id: string;
  tenant_id: string;
  sale_id: string;
  service_id: string | null;
  product_id: string | null;
  barber_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  service?: Service;
  product?: Product;
  barber?: Barber;
}

export interface Payment {
  id: string;
  tenant_id: string;
  sale_id: string;
  payment_method: PaymentMethod;
  amount: number;
  payment_date: string;
  created_at: string;
}

export interface StockMovement {
  id: string;
  tenant_id: string;
  product_id: string;
  movement_type: StockMovementType;
  quantity: number;
  reference_id: string | null;
  reference_type: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  product?: Product;
}

export interface DailyRevenue {
  tenant_id: string;
  sale_date: string;
  total_sales: number;
  total_revenue: number;
  avg_ticket: number;
  total_discounts: number;
}

export interface WeeklyMetrics {
  week_start: string;
  total_sales: number;
  total_revenue: number;
  avg_ticket: number;
  total_appointments: number;
}
