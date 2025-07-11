import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// ✅ Read from app.json's extra section
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// -----------------------
// Data Models
// -----------------------

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

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'urgent';
  is_read: boolean;
  action_url?: string;
  related_id?: string;
  related_type?: string;
  created_at: string;
  expires_at?: string;
}

export interface Milestone {
  id: string;
  child_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  category: string;
  achievement_date: string;
  is_shared_with_parents: boolean;
  photos?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  child?: Child;
  teacher?: User;
}

export interface Announcement {
  id: string;
  author_id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'reminder';
  target_audience: string[];
  is_published: boolean;
  publish_date: string;
  expires_at?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  location?: string;
  organizer_id?: string;
  class_ids?: string[];
  is_all_classes: boolean;
  requires_permission: boolean;
  max_participants?: number;
  current_participants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  organizer?: User;
}

export interface StudentProgress {
  id: string;
  child_id: string;
  teacher_id: string;
  subject_area: string;
  skill_name: string;
  current_level: string;
  target_level?: string;
  progress_percentage: number;
  assessment_date: string;
  notes?: string;
  next_steps?: string;
  created_at: string;
  updated_at: string;
  child?: Child;
  teacher?: User;
}

// -----------------------
// Helper Queries
// -----------------------

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

export const getNotifications = async (userId: string, limit: number = 10): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const getMilestones = async (childId: string): Promise<Milestone[]> => {
  const { data, error } = await supabase
    .from('milestones')
    .select(`
      *,
      child:children(*),
      teacher:users(*)
    `)
    .eq('child_id', childId)
    .eq('is_shared_with_parents', true)
    .order('achievement_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAnnouncements = async (limit: number = 5): Promise<Announcement[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select(`
      *,
      author:users(*)
    `)
    .eq('is_published', true)
    .order('publish_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getUpcomingEvents = async (limit: number = 5): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:users(*)
    `)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getStudentProgress = async (childId: string): Promise<StudentProgress[]> => {
  const { data, error } = await supabase
    .from('student_progress')
    .select(`
      *,
      child:children(*),
      teacher:users(*)
    `)
    .eq('child_id', childId)
    .order('assessment_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTodaysAttendance = async (classId?: string): Promise<Attendance[]> => {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      child:children(*, class:classes(*))
    `)
    .eq('attendance_date', new Date().toISOString().split('T')[0]);

  if (classId) {
    query = query.eq('child.class_id', classId);
  }

  const { data, error } = await query.order('check_in_time', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const getRecentMessages = async (userId: string, limit: number = 5): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!sender_id(*),
      recipient:users!recipient_id(*),
      child:children(*)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getCurrentUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
  const { data: relationData, error: relationError } = await supabase
    .from('parent_child_relationships')
    .select('child_id')
    .eq('parent_id', parentId);

  if (relationError) throw relationError;
  const childIds = relationData.map((r) => r.child_id);

  const { data, error } = await supabase
    .from('children')
    .select(`*, class:classes(*)`)
    .in('id', childIds);

  if (error) throw error;
  return data || [];
};

export const getChildrenForTeacher = async (teacherId: string): Promise<Child[]> => {
  const { data: assignmentData, error: assignmentError } = await supabase
    .from('class_assignments')
    .select('class_id')
    .eq('teacher_id', teacherId);

  if (assignmentError) throw assignmentError;
  const classIds = assignmentData.map((a) => a.class_id);

  const { data, error } = await supabase
    .from('children')
    .select(`*, class:classes(*)`)
    .in('class_id', classIds);

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
