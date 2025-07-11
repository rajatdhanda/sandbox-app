/*
  # Fix classes RLS policies and add missing features

  1. Classes Table Policies
    - Fix admin policies to allow class creation
    - Add proper role checking

  2. New Tables
    - `curriculum` - Course curriculum management
    - `curriculum_items` - Individual curriculum items
    - `photo_tags` - Photo tagging system
    - `system_logs` - Real system activity logs

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each role
*/

-- Fix classes table policies
DROP POLICY IF EXISTS "Admins can manage all classes" ON classes;
DROP POLICY IF EXISTS "Admins can manage classes" ON classes;

CREATE POLICY "Admins can manage all classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
      AND users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
      AND users.is_active = true
    )
  );

-- Create curriculum table
CREATE TABLE IF NOT EXISTS curriculum (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  age_group text NOT NULL,
  subject_area text NOT NULL,
  difficulty_level text DEFAULT 'beginner',
  duration_weeks integer DEFAULT 4,
  learning_objectives text[],
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create curriculum items table
CREATE TABLE IF NOT EXISTS curriculum_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id uuid REFERENCES curriculum(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  activity_type text NOT NULL,
  materials_needed text[],
  instructions text,
  learning_goals text[],
  assessment_criteria text,
  week_number integer,
  day_number integer,
  estimated_duration integer, -- in minutes
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photo tags table
CREATE TABLE IF NOT EXISTS photo_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid REFERENCES photos(id) ON DELETE CASCADE,
  tag_name text NOT NULL,
  tag_type text DEFAULT 'activity', -- activity, skill, mood, location
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create system logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  severity text DEFAULT 'info', -- info, warning, error, critical
  created_at timestamptz DEFAULT now()
);

-- Create attendance records table (enhanced)
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id),
  attendance_date date DEFAULT CURRENT_DATE,
  check_in_time timestamptz,
  check_out_time timestamptz,
  status text DEFAULT 'present', -- present, absent, late, early_pickup, sick
  checked_in_by uuid REFERENCES users(id),
  checked_out_by uuid REFERENCES users(id),
  notes text,
  parent_notified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, attendance_date)
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  report_type text NOT NULL, -- attendance, progress, financial, activity
  description text,
  parameters jsonb,
  generated_by uuid REFERENCES users(id),
  file_url text,
  status text DEFAULT 'pending', -- pending, generating, completed, failed
  date_range_start date,
  date_range_end date,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Curriculum policies
CREATE POLICY "Admins can manage curriculum"
  ON curriculum FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Teachers can read curriculum"
  ON curriculum FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('teacher', 'admin')));

-- Curriculum items policies
CREATE POLICY "Admins can manage curriculum items"
  ON curriculum_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Teachers can read curriculum items"
  ON curriculum_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('teacher', 'admin')));

-- Photo tags policies
CREATE POLICY "Teachers can manage photo tags"
  ON photo_tags FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('teacher', 'admin')));

CREATE POLICY "Parents can read photo tags for their children's photos"
  ON photo_tags FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM photos p
      JOIN parent_child_relationships pcr ON pcr.child_id = p.child_id
      WHERE p.id = photo_tags.photo_id 
      AND pcr.parent_id = auth.uid()
      AND p.is_shared_with_parents = true
    )
  );

-- System logs policies
CREATE POLICY "Admins can read all system logs"
  ON system_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "System can insert logs"
  ON system_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- Attendance records policies
CREATE POLICY "Teachers can manage attendance for their classes"
  ON attendance_records FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_assignments ca
      JOIN users u ON ca.teacher_id = u.id
      WHERE ca.class_id = attendance_records.class_id
      AND u.id = auth.uid()
      AND u.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Parents can read their children's attendance"
  ON attendance_records FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.child_id = attendance_records.child_id
      AND pcr.parent_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all attendance"
  ON attendance_records FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Reports policies
CREATE POLICY "Admins can manage all reports"
  ON reports FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Teachers can read reports"
  ON reports FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('teacher', 'admin')));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_curriculum_age_group ON curriculum(age_group);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_curriculum_id ON curriculum_items(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_photo_tags_photo_id ON photo_tags(photo_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_records_child_id ON attendance_records(child_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);

-- Insert sample curriculum data
INSERT INTO curriculum (name, description, age_group, subject_area, learning_objectives, created_by) VALUES
('Early Math Concepts', 'Introduction to numbers, counting, and basic math', '3-4 years', 'Mathematics', ARRAY['Count to 10', 'Recognize numbers 1-5', 'Basic addition'], 
 (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Language Development', 'Building vocabulary and communication skills', '3-4 years', 'Language Arts', ARRAY['Expand vocabulary', 'Form simple sentences', 'Listen actively'],
 (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Creative Arts', 'Exploring creativity through various art forms', '3-4 years', 'Arts', ARRAY['Express creativity', 'Develop fine motor skills', 'Color recognition'],
 (SELECT id FROM users WHERE role = 'admin' LIMIT 1));

-- Insert sample curriculum items
INSERT INTO curriculum_items (curriculum_id, title, description, activity_type, materials_needed, week_number, day_number, estimated_duration) VALUES
((SELECT id FROM curriculum WHERE name = 'Early Math Concepts' LIMIT 1), 'Counting Bears', 'Use counting bears to learn numbers 1-5', 'hands-on', ARRAY['Counting bears', 'Number cards'], 1, 1, 30),
((SELECT id FROM curriculum WHERE name = 'Language Development' LIMIT 1), 'Story Time', 'Interactive reading session', 'group', ARRAY['Picture books', 'Cushions'], 1, 1, 20),
((SELECT id FROM curriculum WHERE name = 'Creative Arts' LIMIT 1), 'Finger Painting', 'Explore colors through finger painting', 'creative', ARRAY['Finger paints', 'Paper', 'Aprons'], 1, 2, 45);

-- Insert sample system logs
INSERT INTO system_logs (user_id, action, table_name, severity) VALUES
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'Database migration completed', 'system', 'info'),
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'Sample data inserted', 'curriculum', 'info'),
((SELECT id FROM users WHERE role = 'teacher' LIMIT 1), 'User logged in', 'users', 'info');

-- Insert sample attendance records
INSERT INTO attendance_records (child_id, class_id, attendance_date, check_in_time, status, checked_in_by) VALUES
((SELECT id FROM children LIMIT 1), (SELECT id FROM classes LIMIT 1), CURRENT_DATE, now() - interval '2 hours', 'present', (SELECT id FROM users WHERE role = 'teacher' LIMIT 1)),
((SELECT id FROM children OFFSET 1 LIMIT 1), (SELECT id FROM classes LIMIT 1), CURRENT_DATE, now() - interval '1.5 hours', 'late', (SELECT id FROM users WHERE role = 'teacher' LIMIT 1));