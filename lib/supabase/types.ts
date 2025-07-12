// lib/supabase/types.ts

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'parent' | 'teacher' | 'admin';
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  class_id?: string;
  medical_notes?: string;
  allergies?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  pickup_authorized_users?: string[];
  enrollment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  class?: Class;
}

export interface Class {
  id: string;
  name: string;
  age_group: string;
  capacity: number;
  schedule_start: string;
  schedule_end: string;
  description?: string;
  color_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Export other interfaces (DailyLog, Photo, etc.) in the same way...