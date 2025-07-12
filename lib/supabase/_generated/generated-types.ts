// AUTO-GENERATED FILE — DO NOT EDIT
// This file is generated from schema-edits.json with dynamic relationships
// Run schema/generators/generate-types-from-edits.mts to regenerate

// Base type for notifications
export interface Notifications {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  action_url: string;
  related_id: string;
  related_type: string;
  created_at: string;
  expires_at: string;
}

// Base type for photos
export interface Photos {
  id: string;
  child_id: string;
  teacher_id: string;
  image_url: string;
  caption: string;
  activity_type: string;
  photo_date: string;
  is_shared_with_parents: boolean;
  album_name: string;
  created_at: string;
  updated_at: string;
  album_id: string;
}

// Base type for classes
export interface Classes {
  id: string;
  name: string;
  age_group: string;
  capacity: number;
  schedule_start: any;
  schedule_end: any;
  description: string;
  color_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Base type for children
export interface Children {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  class_id: string;
  medical_notes: string;
  allergies: string;
  emergency_contact: string;
  emergency_phone: string;
  pickup_authorized_users: any;
  enrollment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Base type for parent_child_relationships
export interface ParentChildRelationships {
  id: string;
  parent_id: string;
  child_id: string;
  relationship_type: string;
  is_primary: boolean;
  created_at: string;
}

// Base type for class_assignments
export interface ClassAssignments {
  id: string;
  teacher_id: string;
  class_id: string;
  is_primary: boolean;
  assigned_date: string;
  created_at: string;
}

// Base type for config_fields
export interface ConfigFields {
  id: string;
  category: string;
  label: string;
  value: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Base type for daily_logs
export interface DailyLogs {
  id: string;
  child_id: string;
  teacher_id: string;
  log_date: string;
  activity_type: string;
  mood: string;
  description: string;
  skill_tags: any;
  duration_minutes: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Base type for worksheets
export interface Worksheets {
  id: string;
  child_id: string;
  teacher_id: string;
  title: string;
  description: string;
  worksheet_type: string;
  skill_areas: any;
  completion_status: string;
  score: number;
  max_score: number;
  notes: string;
  due_date: string;
  completed_date: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

// Base type for users
export interface Users {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Base type for attendance
export interface Attendance {
  id: string;
  child_id: string;
  attendance_date: string;
  check_in_time: string;
  check_out_time: string;
  checked_in_by: string;
  checked_out_by: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Base type for milestones
export interface Milestones {
  id: string;
  child_id: string;
  teacher_id: string;
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  is_shared_with_parents: boolean;
  photos: any;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Base type for announcements
export interface Announcements {
  id: string;
  author_id: string;
  title: string;
  content: string;
  type: string;
  target_audience: any;
  is_published: boolean;
  publish_date: string;
  expires_at: string;
  attachments: any;
  created_at: string;
  updated_at: string;
}

// Base type for events
export interface Events {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  organizer_id: string;
  class_ids: any;
  is_all_classes: boolean;
  requires_permission: boolean;
  max_participants: number;
  current_participants: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Base type for messages
export interface Messages {
  id: string;
  sender_id: string;
  recipient_id: string;
  child_id: string;
  subject: string;
  content: string;
  message_type: string;
  is_read: boolean;
  parent_message_id: string;
  created_at: string;
  updated_at: string;
  thread_id: string;
}

// Base type for message_threads
export interface MessageThreads {
  id: string;
  subject: string;
  participants: any;
  last_message_at: string;
  is_archived: boolean;
  thread_type: string;
  created_at: string;
}

// Base type for photo_albums
export interface PhotoAlbums {
  id: string;
  name: string;
  description: string;
  class_id: string;
  teacher_id: string;
  cover_photo_url: string;
  is_shared_with_parents: boolean;
  created_at: string;
  updated_at: string;
}

// Base type for student_progress
export interface StudentProgress {
  id: string;
  child_id: string;
  teacher_id: string;
  subject_area: string;
  skill_name: string;
  current_level: string;
  target_level: string;
  progress_percentage: number;
  assessment_date: string;
  notes: string;
  next_steps: string;
  created_at: string;
  updated_at: string;
}

// Base type for curriculum
export interface Curriculum {
  id: string;
  name: string;
  description: string;
  age_group: string;
  subject_area: string;
  difficulty_level: string;
  duration_weeks: number;
  learning_objectives: any;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Base type for photo_tags
export interface PhotoTags {
  id: string;
  photo_id: string;
  tag_name: string;
  tag_type: string;
  created_by: string;
  created_at: string;
}

// Base type for system_logs
export interface SystemLogs {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  severity: string;
  created_at: string;
}

// Base type for attendance_records
export interface AttendanceRecords {
  id: string;
  child_id: string;
  class_id: string;
  attendance_date: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  checked_in_by: string;
  checked_out_by: string;
  notes: string;
  parent_notified: boolean;
  created_at: string;
  updated_at: string;
}

// Base type for reports
export interface Reports {
  id: string;
  title: string;
  report_type: string;
  description: string;
  parameters: any;
  generated_by: string;
  file_url: string;
  status: string;
  date_range_start: string;
  date_range_end: string;
  created_at: string;
  completed_at: string;
}

// Base type for curriculum_assignments
export interface CurriculumAssignments {
  id: string;
  curriculum_id: string;
  class_id: string;
  assigned_by: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  notes: string;
  created_at: string;
}

// Base type for curriculum_items
export interface CurriculumItems {
  id: string;
  curriculum_id: string;
  title: string;
  description: string;
  activity_type: string;
  materials_needed: any;
  instructions: string;
  learning_goals: any;
  assessment_criteria: string;
  week_number: number;
  day_number: number;
  time_slot_id: string;
  estimated_duration: number;
  difficulty_level: string;
  skills_developed: any;
  preparation_notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Base type for time_slots
export interface TimeSlots {
  id: string;
  name: string;
  start_time: any;
  end_time: any;
  duration_minutes: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// Base type for curriculum_templates
export interface CurriculumTemplates {
  id: string;
  name: string;
  description: string;
  age_group: string;
  subject_area: string;
  difficulty_level: string;
  total_weeks: number;
  learning_objectives: any;
  materials_list: any;
  assessment_criteria: string;
  created_by: string;
  import_source: string;
  import_reference: string;
  is_template: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Base type for curriculum_executions
export interface CurriculumExecutions {
  id: string;
  curriculum_item_id: string;
  class_id: string;
  teacher_id: string;
  execution_date: string;
  actual_start_time: string;
  actual_end_time: string;
  actual_duration: number;
  completion_status: string;
  modifications_made: string;
  student_engagement: string;
  materials_used: any;
  challenges_faced: string;
  notes: string;
  photos: any;
  next_steps: string;
  created_at: string;
  updated_at: string;
}

// Base type for curriculum_imports
export interface CurriculumImports {
  id: string;
  import_type: string;
  source_url: string;
  source_name: string;
  imported_by: string;
  curriculum_template_id: string;
  import_status: string;
  records_imported: number;
  errors_encountered: any;
  import_log: any;
  created_at: string;
  completed_at: string;
}

// Types with dynamic relationships
export interface NotificationsWithRelations extends Notifications {
  user?: Users;
}

export interface PhotosWithRelations extends Photos {
  child?: Children;
  photo_tags?: PhotoTags[];
}

export interface ClassesWithRelations extends Classes {
  childrens?: Children[];
  class_assignments?: ClassAssignments[];
  photo_albums?: PhotoAlbums[];
  attendance_records?: AttendanceRecords[];
  curriculum_assignments?: CurriculumAssignments[];
  curriculum_executions?: CurriculumExecutions[];
}

export interface ChildrenWithRelations extends Children {
  class?: Classes;
  parent_child_relationships?: ParentChildRelationships[];
  daily_logs?: DailyLogs[];
  worksheets?: Worksheets[];
  attendances?: Attendance[];
  milestones?: Milestones[];
  messages?: Messages[];
  student_progress?: StudentProgress[];
  attendance_records?: AttendanceRecords[];
}

export interface ParentChildRelationshipsWithRelations extends ParentChildRelationships {
  child?: Children;
}

export interface ClassAssignmentsWithRelations extends ClassAssignments {
  class?: Classes;
}

export interface DailyLogsWithRelations extends DailyLogs {
  child?: Children;
}

export interface WorksheetsWithRelations extends Worksheets {
  child?: Children;
}

export interface UsersWithRelations extends Users {
  system_logs?: SystemLogs[];
}

export interface AttendanceWithRelations extends Attendance {
  child?: Children;
}

export interface MilestonesWithRelations extends Milestones {
  child?: Children;
}

export interface MessagesWithRelations extends Messages {
  child?: Children;
}

export interface PhotoAlbumsWithRelations extends PhotoAlbums {
  class?: Classes;
}

export interface StudentProgressWithRelations extends StudentProgress {
  child?: Children;
}

export interface CurriculumWithRelations extends Curriculum {
  curriculum_assignments?: CurriculumAssignments[];
  curriculum_items?: CurriculumItems[];
}

export interface PhotoTagsWithRelations extends PhotoTags {
  photo?: Photos;
}

export interface SystemLogsWithRelations extends SystemLogs {
  user?: Users;
}

export interface AttendanceRecordsWithRelations extends AttendanceRecords {
  child?: Children;
  class?: Classes;
}

export interface CurriculumAssignmentsWithRelations extends CurriculumAssignments {
  curriculum?: Curriculum;
  class?: Classes;
}

export interface CurriculumItemsWithRelations extends CurriculumItems {
  curriculum?: Curriculum;
  time_slot?: TimeSlots;
  curriculum_executions?: CurriculumExecutions[];
}

export interface CurriculumTemplatesWithRelations extends CurriculumTemplates {
  curriculum_imports?: CurriculumImports[];
}

export interface CurriculumExecutionsWithRelations extends CurriculumExecutions {
  curriculum_item?: CurriculumItems;
  class?: Classes;
}

export interface CurriculumImportsWithRelations extends CurriculumImports {
  curriculum_template?: CurriculumTemplates;
}

// Query helpers for relationships
export const QueryWithRelations = {
  notifications: `*, user:users(*)`,
  photos: `*, child:children(*), photo_tags:photo_tags(*)`,
  classes: `*, childrens:children(*), class_assignments:class_assignments(*), photo_albums:photo_albums(*), attendance_records:attendance_records(*), curriculum_assignments:curriculum_assignments(*), curriculum_executions:curriculum_executions(*)`,
  children: `*, class:classes(*), parent_child_relationships:parent_child_relationships(*), daily_logs:daily_logs(*), worksheets:worksheets(*), attendances:attendance(*), milestones:milestones(*), messages:messages(*), student_progress:student_progress(*), attendance_records:attendance_records(*)`,
  parent_child_relationships: `*, child:children(*)`,
  class_assignments: `*, class:classes(*)`,
  daily_logs: `*, child:children(*)`,
  worksheets: `*, child:children(*)`,
  users: `*, system_logs:system_logs(*)`,
  attendance: `*, child:children(*)`,
  milestones: `*, child:children(*)`,
  messages: `*, child:children(*)`,
  photo_albums: `*, class:classes(*)`,
  student_progress: `*, child:children(*)`,
  curriculum: `*, curriculum_assignments:curriculum_assignments(*), curriculum_items:curriculum_items(*)`,
  photo_tags: `*, photo:photos(*)`,
  system_logs: `*, user:users(*)`,
  attendance_records: `*, child:children(*), class:classes(*)`,
  curriculum_assignments: `*, curriculum:curriculum(*), class:classes(*)`,
  curriculum_items: `*, curriculum:curriculum(*), time_slot:time_slots(*), curriculum_executions:curriculum_executions(*)`,
  curriculum_templates: `*, curriculum_imports:curriculum_imports(*)`,
  curriculum_executions: `*, curriculum_item:curriculum_items(*), class:classes(*)`,
  curriculum_imports: `*, curriculum_template:curriculum_templates(*)`,
} as const;

// Dynamic relationship query builder
export function buildRelationQuery(tableName: string, includeRelations: string[] = []): string {
  const baseQuery = '*';
  const allRelations = QueryWithRelations[tableName as keyof typeof QueryWithRelations];
  
  if (!allRelations || includeRelations.length === 0) {
    return baseQuery;
  }
  
  return allRelations;
}

// Helper type for selecting with relations
export type TableWithRelations<T extends keyof typeof QueryWithRelations> = 
  T extends 'users' ? UsersWithRelations :
  T extends 'children' ? ChildrenWithRelations :
  T extends 'classes' ? ClassesWithRelations :
  T extends 'announcements' ? AnnouncementsWithRelations :
  T extends 'notifications' ? NotificationsWithRelations :
  any; // Fallback for other tables

