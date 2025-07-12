// lib/supabase/compatibility.ts
// Compatibility layer to help with gradual migration

// Re-export generated types with old names for backward compatibility
export type {
  Users as User,
  Classes as Class,
  Children as Child,
  Announcements as Announcement,
  Photos as Photo,
  Notifications as Notification,
} from './_generated/generated-types';

// Re-export all generated types with new names too
export * from './_generated/generated-types';

// Re-export generated clients
export * from './_generated/clients/users';
export * from './_generated/clients/classes';
export * from './_generated/clients/children';
export * from './_generated/clients/announcements';
export * from './_generated/clients/photos';
export * from './_generated/clients/notifications';

// Legacy compatibility - deprecated but helps during migration
export const getUsers = async () => {
  const { usersClient } = await import('./_generated/clients/users');
  return usersClient().select('*');
};

export const getClasses = async () => {
  const { classesClient } = await import('./_generated/clients/classes');
  return classesClient().select('*');
};