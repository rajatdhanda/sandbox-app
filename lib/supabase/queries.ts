// lib/supabase/queries.ts
import { supabase } from './client';
import type {
  ConfigField,
  Notification,
  Milestone,
  Announcement,
  Event,
  StudentProgress,
  Message,
  User,
  Child,
  Attendance,
  DailyLog,
  Photo
} from './types';

// Examples

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

export const getNotifications = async (userId: string, limit = 10): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getAnnouncements = async (limit = 10): Promise<Announcement[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch announcements: ${error.message}`);
  return data || [];
};

export const getUpcomingEvents = async (limit = 5): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString()) // assumes 'date' column
    .order('date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

// Add remaining helper functions the same way...