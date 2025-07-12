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

// Add remaining helper functions the same way...