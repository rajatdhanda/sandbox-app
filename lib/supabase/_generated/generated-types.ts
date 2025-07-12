// AUTO-GENERATED FILE — DO NOT EDIT
// This file is generated from schema-edits.json based on current schema state
// Run schema/generate-types-from-edits.mts to regenerate

// Table: notifications
export type Notifications = {
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
};

// Table: photos
export type Photos = {
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
};

// Table: classes
export type Classes = {
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
};

// Table: children
export type Children = {
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
};

// Table: parent_child_relationships
export type ParentChildRelationships = {
  id: string;
  parent_id: string;
  child_id: string;
  relationship_type: string;
  is_primary: boolean;
  created_at: string;
};

// Table: class_assignments
export type ClassAssignments = {
  id: string;
  teacher_id: string;
  class_id: string;
  is_primary: boolean;
  assigned_date: string;
  created_at: string;
};

// Table: config_fields
export type ConfigFields = {
  id: string;
  category: string;
  label: string;
  value: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Table: daily_logs
export type DailyLogs = {
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
};

// Table: worksheets
export type Worksheets = {
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
};

// Table: users
export type Users = {
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
};

// Table: attendance
export type Attendance = {
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
};

// Table: milestones
export type Milestones = {
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
};

// Table: announcements
export type Announcements = {
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
};

// Table: events
export type Events = {
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
};

// Table: messages
export type Messages = {
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
};

// Table: message_threads
export type MessageThreads = {
  id: string;
  subject: string;
  participants: any;
  last_message_at: string;
  is_archived: boolean;
  thread_type: string;
  created_at: string;
};

// Table: photo_albums
export type PhotoAlbums = {
  id: string;
  name: string;
  description: string;
  class_id: string;
  teacher_id: string;
  cover_photo_url: string;
  is_shared_with_parents: boolean;
  created_at: string;
  updated_at: string;
};

// Table: student_progress
export type StudentProgress = {
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
};

// Table: curriculum
export type Curriculum = {
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
};

// Table: photo_tags
export type PhotoTags = {
  id: string;
  photo_id: string;
  tag_name: string;
  tag_type: string;
  created_by: string;
  created_at: string;
};

// Table: system_logs
export type SystemLogs = {
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
};

// Table: attendance_records
export type AttendanceRecords = {
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
};

// Table: reports
export type Reports = {
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
};

// Table: curriculum_assignments
export type CurriculumAssignments = {
  id: string;
  curriculum_id: string;
  class_id: string;
  assigned_by: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  notes: string;
  created_at: string;
};

// Table: curriculum_items
export type CurriculumItems = {
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
};

// Table: time_slots
export type TimeSlots = {
  id: string;
  name: string;
  start_time: any;
  end_time: any;
  duration_minutes: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

// Table: curriculum_templates
export type CurriculumTemplates = {
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
};

// Table: curriculum_executions
export type CurriculumExecutions = {
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
};

// Table: curriculum_imports
export type CurriculumImports = {
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
};

