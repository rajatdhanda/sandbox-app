import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
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

export interface DailyLog {
  id: string;
  child_id: string;
  teacher_id: string;
  log_date: string;
  activity_type: string;
  mood?: string;
  description: string;
  skill_tags?: string[];
  duration_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  child?: Child;
  teacher?: User;
}

export interface Photo {
  id: string;
  child_id: string;
  teacher_id: string;
  image_url: string;
  caption?: string;
  activity_type?: string;
  photo_date: string;
  is_shared_with_parents: boolean;
  album_name?: string;
  created_at: string;
  updated_at: string;
  child?: Child;
  teacher?: User;
}

export interface ConfigField {
  id: string;
  category: string;
  label: string;
  value: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  child_id?: string;
  subject?: string;
  content: string;
  message_type: 'general' | 'urgent' | 'announcement' | 'reminder';
  is_read: boolean;
  parent_message_id?: string;
  created_at: string;
  updated_at: string;
  sender?: User;
  recipient?: User;
  child?: Child;
}

export interface Worksheet {
  id: string;
  child_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  worksheet_type: string;
  skill_areas?: string[];
  completion_status: 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  score?: number;
  max_score?: number;
  notes?: string;
  due_date?: string;
  completed_date?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  child?: Child;
  teacher?: User;
}

export interface Attendance {
  id: string;
  child_id: string;
  attendance_date: string;
  check_in_time?: string;
  check_out_time?: string;
  checked_in_by?: string;
  checked_out_by?: string;
  status: 'present' | 'absent' | 'late' | 'early_pickup';
  notes?: string;
  created_at: string;
  updated_at: string;
  child?: Child;
}

// Helper functions for data fetching
export const getConfigFields = async (category: string): Promise<ConfigField[]> => {
  const { data, error } = await supabase
    .from('config_fields')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data || [];
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const getChildrenForParent = async (parentId: string): Promise<Child[]> => {
  const { data, error } = await supabase
    .from('children')
    .select(`
      *,
      class:classes(*)
    `)
    .in('id', 
      supabase
        .from('parent_child_relationships')
        .select('child_id')
        .eq('parent_id', parentId)
    );

  if (error) throw error;
  return data || [];
};

export const getChildrenForTeacher = async (teacherId: string): Promise<Child[]> => {
  const { data, error } = await supabase
    .from('children')
    .select(`
      *,
      class:classes(*)
    `)
    .in('class_id',
      supabase
        .from('class_assignments')
        .select('class_id')
        .eq('teacher_id', teacherId)
    );

  if (error) throw error;
  return data || [];
};

export const getDailyLogsForChild = async (childId: string, date?: string): Promise<DailyLog[]> => {
  let query = supabase
    .from('daily_logs')
    .select(`
      *,
      child:children(*),
      teacher:users(*)
    `)
    .eq('child_id', childId);

  if (date) {
    query = query.eq('log_date', date);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getPhotosForChild = async (childId: string): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select(`
      *,
      child:children(*),
      teacher:users(*)
    `)
    .eq('child_id', childId)
    .eq('is_shared_with_parents', true)
    .order('photo_date', { ascending: false });

  if (error) throw error;
  return data || [];
};