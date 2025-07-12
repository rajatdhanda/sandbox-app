// lib/supabase/compatibility.ts - Complete compatibility layer
import { createClient } from '@supabase/supabase-js';

// Create supabase client for server-side operations
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

// Export all client functions for every table
export const usersClient = () => supabase.from('users');
export const childrenClient = () => supabase.from('children');
export const classesClient = () => supabase.from('classes');
export const announcementsClient = () => supabase.from('announcements');
export const notificationsClient = () => supabase.from('notifications');
export const eventsClient = () => supabase.from('events');
export const photosClient = () => supabase.from('photos');
export const messagesClient = () => supabase.from('messages');
export const reportsClient = () => supabase.from('reports');
export const attendanceClient = () => supabase.from('attendance');
export const configFieldsClient = () => supabase.from('config_fields');
export const curriculumAssignmentsClient = () => supabase.from('curriculum_assignments');
export const parentChildRelationshipsClient = () => supabase.from('parent_child_relationships');
export const dailyLogsClient = () => supabase.from('daily_logs');
export const milestonesClient = () => supabase.from('milestones');
export const classAssignmentsClient = () => supabase.from('class_assignments');
export const attendanceRecordsClient = () => supabase.from('attendance_records');
export const studentProgressClient = () => supabase.from('student_progress');
export const photoAlbumsClient = () => supabase.from('photo_albums');
export const photoTagsClient = () => supabase.from('photo_tags');
export const messageThreadsClient = () => supabase.from('message_threads');
export const curriculumClient = () => supabase.from('curriculum');
export const curriculumItemsClient = () => supabase.from('curriculum_items');
export const curriculumTemplatesClient = () => supabase.from('curriculum_templates');
export const curriculumExecutionsClient = () => supabase.from('curriculum_executions');
export const curriculumImportsClient = () => supabase.from('curriculum_imports');
export const timeSlotsClient = () => supabase.from('time_slots');
export const systemLogsClient = () => supabase.from('system_logs');
export const worksheetsClient = () => supabase.from('worksheets');

// Re-export types for convenience
export type {
  Users,
  Children,
  Classes,
  Announcements,
  Notifications,
  Events,
  Photos,
  Messages,
  Reports,
  ChildrenWithRelations,
  ClassesWithRelations,
  UsersWithRelations,
  AnnouncementsWithRelations,
  NotificationsWithRelations,
  EventsWithRelations,
  QueryWithRelations
} from './_generated/generated-types';

// Legacy type aliases for backward compatibility
export type User = Users;
export type Child = Children;
export type Class = Classes;
export type Announcement = Announcements;
export type Notification = Notifications;
export type Event = Events;
export type Photo = Photos;
export type Message = Messages;
export type Report = Reports;