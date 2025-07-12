// lib/supabase/types.ts


import type { Database } from './generated-types';
import type { Class } from './types';

export type CurriculumAssignmentRow = Database['public']['Tables']['curriculum_assignments']['Row'];

export interface CurriculumAssignmentWithClass extends CurriculumAssignmentRow {
  class?: Class;
}

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
  parent_child_relationships?: ParentChildRelationship[];
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

export type Notification = {
  id: string;
  user_id: string;
  message: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
  is_read: boolean;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: 'event' | 'general' | 'success' | 'error';
  publish_date: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_date: string;
  end_date: string;
  location: string;
};


// Export other interfaces (DailyLog, Photo, etc.) in the same way...