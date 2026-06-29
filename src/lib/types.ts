// Shared domain types. These mirror the columns in supabase/schema.sql.

export type PropertyType =
  | 'house'
  | 'apartment'
  | 'land'
  | 'commercial'
  | 'office'
  | 'townhouse';

export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'draft' | 'published' | 'archived';

export interface Property {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  property_type: PropertyType;
  listing_type: ListingType;
  status: PropertyStatus;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  address: string | null;
  city: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  national_id: string | null;
  notes: string | null;
  created_at: string;
}

export type LeaseStatus = 'pending' | 'active' | 'ended' | 'terminated';

export interface Lease {
  id: string;
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string | null;
  rent_amount: number;
  currency: string;
  deposit: number;
  status: LeaseStatus;
  created_at: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'closed';

export interface Enquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  property: string | null;
  status: EnquiryStatus;
  created_at: string;
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved' | 'cancelled';

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id: string | null;
  title: string;
  description: string | null;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  created_at: string;
  updated_at: string;
}
