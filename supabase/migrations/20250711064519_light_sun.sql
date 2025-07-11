/*
  # Preschool Management System Database Schema

  1. New Tables
    - `users` - All system users (parents, teachers, admins)
    - `children` - Student profiles linked to parents
    - `classes` - Class information with teacher assignments
    - `daily_logs` - Daily activity and mood tracking
    - `photos` - Photo management with child associations
    - `worksheets` - Educational worksheets and assessments
    - `messages` - Communication between users
    - `config_fields` - Dynamic configuration for dropdowns
    - `class_assignments` - Many-to-many relationship for teacher-class assignments
    - `parent_child_relationships` - Many-to-many relationship for parent-child associations

  2. Security
    - Enable RLS on all tables
    - Role-based policies for parents, teachers, and admins
    - Data isolation based on user roles and relationships

  3. Features
    - Normalized relational structure
    - Dynamic configuration fields
    - Multi-child support per parent
    - Class-based teacher assignments
    - Comprehensive audit trail
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (parents, teachers, admins)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('parent', 'teacher', 'admin')),
  phone text,
  address text,
  emergency_contact text,
  emergency_phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  age_group text NOT NULL,
  capacity integer NOT NULL DEFAULT 20,
  schedule_start time NOT NULL,
  schedule_end time NOT NULL,
  description text,
  color_code text DEFAULT '#8B5CF6',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  class_id uuid REFERENCES classes(id),
  medical_notes text,
  allergies text,
  emergency_contact text,
  emergency_phone text,
  pickup_authorized_users text[], -- Array of authorized pickup person names
  enrollment_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Parent-Child relationships (many-to-many)
CREATE TABLE IF NOT EXISTS parent_child_relationships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  relationship_type text DEFAULT 'parent', -- 'parent', 'guardian', 'emergency_contact'
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Class assignments for teachers (many-to-many)
CREATE TABLE IF NOT EXISTS class_assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  assigned_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, class_id)
);

-- Config fields for dynamic dropdowns
CREATE TABLE IF NOT EXISTS config_fields (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text NOT NULL, -- 'mood', 'skill_tag', 'activity_type', 'meal_type', etc.
  label text NOT NULL,
  value text NOT NULL, -- Internal value for the field
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, value)
);

-- Daily logs for activities and observations
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id),
  log_date date DEFAULT CURRENT_DATE,
  activity_type text NOT NULL, -- References config_fields
  mood text, -- References config_fields
  description text NOT NULL,
  skill_tags text[], -- Array of skill tags from config_fields
  duration_minutes integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id),
  image_url text NOT NULL,
  caption text,
  activity_type text, -- References config_fields
  photo_date date DEFAULT CURRENT_DATE,
  is_shared_with_parents boolean DEFAULT true,
  album_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Worksheets and assessments
CREATE TABLE IF NOT EXISTS worksheets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  worksheet_type text, -- References config_fields
  skill_areas text[], -- Array of skill areas from config_fields
  completion_status text DEFAULT 'assigned', -- 'assigned', 'in_progress', 'completed', 'reviewed'
  score integer,
  max_score integer,
  notes text,
  due_date date,
  completed_date date,
  file_url text, -- URL to worksheet file/image
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages between users
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id), -- Optional: message about specific child
  subject text,
  content text NOT NULL,
  message_type text DEFAULT 'general', -- 'general', 'urgent', 'announcement', 'reminder'
  is_read boolean DEFAULT false,
  parent_message_id uuid REFERENCES messages(id), -- For threading
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance tracking
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  attendance_date date DEFAULT CURRENT_DATE,
  check_in_time timestamptz,
  check_out_time timestamptz,
  checked_in_by uuid REFERENCES users(id),
  checked_out_by uuid REFERENCES users(id),
  status text DEFAULT 'present', -- 'present', 'absent', 'late', 'early_pickup'
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, attendance_date)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Children
CREATE POLICY "Parents can read their children"
  ON children FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.child_id = children.id AND pcr.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can read children in their classes"
  ON children FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_assignments ca
      JOIN users u ON ca.teacher_id = u.id
      WHERE ca.class_id = children.class_id 
      AND u.id = auth.uid() 
      AND u.role = 'teacher'
    )
  );

CREATE POLICY "Admins can manage all children"
  ON children FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Daily Logs
CREATE POLICY "Parents can read logs for their children"
  ON daily_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.child_id = daily_logs.child_id AND pcr.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage logs for their class children"
  ON daily_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN class_assignments ca ON ca.class_id = c.class_id
      JOIN users u ON ca.teacher_id = u.id
      WHERE c.id = daily_logs.child_id 
      AND u.id = auth.uid() 
      AND u.role = 'teacher'
    )
  );

CREATE POLICY "Admins can manage all daily logs"
  ON daily_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Photos
CREATE POLICY "Parents can read photos of their children"
  ON photos FOR SELECT
  TO authenticated
  USING (
    is_shared_with_parents = true AND
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.child_id = photos.child_id AND pcr.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage photos for their class children"
  ON photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN class_assignments ca ON ca.class_id = c.class_id
      JOIN users u ON ca.teacher_id = u.id
      WHERE c.id = photos.child_id 
      AND u.id = auth.uid() 
      AND u.role = 'teacher'
    )
  );

CREATE POLICY "Admins can manage all photos"
  ON photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Messages
CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admins can read all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Config Fields
CREATE POLICY "All authenticated users can read config fields"
  ON config_fields FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage config fields"
  ON config_fields FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample config fields
INSERT INTO config_fields (category, label, value, sort_order) VALUES
  ('mood', 'Happy', 'happy', 1),
  ('mood', 'Excited', 'excited', 2),
  ('mood', 'Calm', 'calm', 3),
  ('mood', 'Tired', 'tired', 4),
  ('mood', 'Upset', 'upset', 5),
  ('mood', 'Anxious', 'anxious', 6),
  
  ('activity_type', 'Art & Craft', 'art_craft', 1),
  ('activity_type', 'Circle Time', 'circle_time', 2),
  ('activity_type', 'Outdoor Play', 'outdoor_play', 3),
  ('activity_type', 'Story Time', 'story_time', 4),
  ('activity_type', 'Music & Movement', 'music_movement', 5),
  ('activity_type', 'Snack Time', 'snack_time', 6),
  ('activity_type', 'Quiet Time', 'quiet_time', 7),
  ('activity_type', 'Science Exploration', 'science', 8),
  
  ('skill_tag', 'Fine Motor Skills', 'fine_motor', 1),
  ('skill_tag', 'Gross Motor Skills', 'gross_motor', 2),
  ('skill_tag', 'Language Development', 'language', 3),
  ('skill_tag', 'Social Skills', 'social', 4),
  ('skill_tag', 'Emotional Development', 'emotional', 5),
  ('skill_tag', 'Cognitive Skills', 'cognitive', 6),
  ('skill_tag', 'Creativity', 'creativity', 7),
  ('skill_tag', 'Problem Solving', 'problem_solving', 8),
  
  ('worksheet_type', 'Math Practice', 'math', 1),
  ('worksheet_type', 'Letter Recognition', 'letters', 2),
  ('worksheet_type', 'Coloring Activity', 'coloring', 3),
  ('worksheet_type', 'Tracing Practice', 'tracing', 4),
  ('worksheet_type', 'Matching Game', 'matching', 5),
  ('worksheet_type', 'Assessment', 'assessment', 6);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_children_class_id ON children(class_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_child_id ON daily_logs(child_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_photos_child_id ON photos(child_id);
CREATE INDEX IF NOT EXISTS idx_photos_date ON photos(photo_date);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_attendance_child_date ON attendance(child_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_config_fields_category ON config_fields(category, is_active);