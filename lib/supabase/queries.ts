// lib/supabase/queries.ts
import { 
  usersClient, 
  classesClient, 
  childrenClient, 
  announcementsClient, 
  notificationsClient 
} from './compatibility';

import type {
  Notifications,
  Announcements,
  Events,
  Users,
  Children
} from './_generated/generated-types';

// Use the compatibility layer types for parameters that haven't been migrated yet
type ConfigField = any; // TODO: Replace with generated type
type Milestone = any; // TODO: Replace with generated type  
type StudentProgress = any; // TODO: Replace with generated type
type Message = any; // TODO: Replace with generated type
type Attendance = any; // TODO: Replace with generated type
type DailyLog = any; // TODO: Replace with generated type
type Photo = any; // TODO: Replace with generated type

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

export const getNotifications = async (userId: string, limit = 10): Promise<Notifications[]> => {
  const { data, error } = await notificationsClient()
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getAnnouncements = async (limit = 10): Promise<Announcements[]> => {
  const { data, error } = await announcementsClient()
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch announcements: ${error.message}`);
  return data || [];
};

export const getUpcomingEvents = async (limit = 5): Promise<Events[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
};