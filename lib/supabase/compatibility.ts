// lib/supabase/compatibility.ts
// Compatibility layer to help with gradual migration

// Re-export generated types with old names for backward compatibility
export type {
  Users as User,
  Classes as Class,
  Children as Child,
  Announcements as Announcement,
  Notifications as Notification,
  Events as Event
} from './_generated/generated-types';

// Re-export all generated types with new names too
export * from './_generated/generated-types';

// Import clients using direct imports to avoid circular dependencies
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Export client functions directly
export const usersClient = () => supabase.from('users');
export const classesClient = () => supabase.from('classes');
export const childrenClient = () => supabase.from('children');
export const announcementsClient = () => supabase.from('announcements');
export const notificationsClient = () => supabase.from('notifications');
export const eventsClient = () => supabase.from('events');

// Legacy helper functions
export const getUsers = async () => {
  return usersClient().select('*');
};

export const getClasses = async () => {
  return classesClient().select('*');
};