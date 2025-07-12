// lib/supabase/core/types.ts
import type { 
  Classes, 
  Users, 
  Children, 
  Notifications, 
  Announcements, 
  Events, 
  CurriculumAssignments 
} from '@/lib/supabase/_generated/generated-types';

// Use generated types
export type User = Users;
export type Child = Children;
export type Class = Classes;
export type Notification = Notifications;
export type Announcement = Announcements;
export type Event = Events;

// Custom types that extend generated types
export type CurriculumAssignmentRow = CurriculumAssignments;

export interface CurriculumAssignmentWithClass extends CurriculumAssignmentRow {
  class?: Classes;
}

// Re-export for backward compatibility
export type {
  Classes,
  Users,
  Children,
  Notifications,
  Announcements,
  Events,
  CurriculumAssignments
} from '@/lib/supabase/_generated/generated-types';

// RELATION TYPES — AUTO-GENERATED BELOW
import type { Database } from '../_generated/database.types';
