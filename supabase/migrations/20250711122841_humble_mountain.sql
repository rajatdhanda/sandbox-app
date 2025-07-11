/*
  # Enhanced Curriculum Management System

  1. New Tables
    - `curriculum_templates` - Master curriculum templates
    - `curriculum_assignments` - Assign curriculum to classes
    - `curriculum_executions` - Track actual execution by teachers
    - `curriculum_imports` - Track Google Sheets imports
    - `time_slots` - Define time buckets for activities

  2. Enhanced Features
    - Google Sheets integration tracking
    - Time-based activity scheduling
    - Admin planning vs teacher execution
    - Class group assignments
    - Progress tracking

  3. Security
    - RLS policies for all new tables
    - Role-based access control
*/

-- Time slots for scheduling activities
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration_minutes integer NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enhanced curriculum templates
CREATE TABLE IF NOT EXISTS curriculum_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  age_group text NOT NULL,
  subject_area text NOT NULL,
  difficulty_level text DEFAULT 'beginner',
  total_weeks integer DEFAULT 4,
  learning_objectives text[],
  materials_list text[],
  assessment_criteria text,
  created_by uuid REFERENCES users(id),
  import_source text, -- 'manual', 'google_sheets', 'csv'
  import_reference text, -- Google Sheets URL or file reference
  is_template boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Curriculum assignments to classes
CREATE TABLE IF NOT EXISTS curriculum_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id uuid REFERENCES curriculum_templates(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES users(id),
  start_date date NOT NULL,
  end_date date,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(curriculum_id, class_id, start_date)
);

-- Enhanced curriculum items with time slots
DROP TABLE IF EXISTS curriculum_items CASCADE;
CREATE TABLE curriculum_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id uuid REFERENCES curriculum_templates(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  activity_type text NOT NULL,
  materials_needed text[],
  instructions text,
  learning_goals text[],
  assessment_criteria text,
  week_number integer NOT NULL,
  day_number integer NOT NULL,
  time_slot_id uuid REFERENCES time_slots(id),
  estimated_duration integer DEFAULT 30, -- minutes
  difficulty_level text DEFAULT 'beginner',
  skills_developed text[],
  preparation_notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Track curriculum execution by teachers
CREATE TABLE IF NOT EXISTS curriculum_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_item_id uuid REFERENCES curriculum_items(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id),
  execution_date date NOT NULL,
  actual_start_time timestamptz,
  actual_end_time timestamptz,
  actual_duration integer, -- minutes
  completion_status text DEFAULT 'planned' CHECK (completion_status IN ('planned', 'in_progress', 'completed', 'skipped', 'modified')),
  modifications_made text,
  student_engagement text, -- 'low', 'medium', 'high'
  materials_used text[],
  challenges_faced text,
  notes text,
  photos text[], -- URLs to photos
  next_steps text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(curriculum_item_id, class_id, execution_date)
);

-- Track Google Sheets imports
CREATE TABLE IF NOT EXISTS curriculum_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_type text NOT NULL, -- 'google_sheets', 'csv', 'excel'
  source_url text,
  source_name text,
  imported_by uuid REFERENCES users(id),
  curriculum_template_id uuid REFERENCES curriculum_templates(id),
  import_status text DEFAULT 'pending' CHECK (import_status IN ('pending', 'processing', 'completed', 'failed')),
  records_imported integer DEFAULT 0,
  errors_encountered text[],
  import_log jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Insert default time slots
INSERT INTO time_slots (name, start_time, end_time, duration_minutes, sort_order) VALUES
('Morning Circle', '08:00', '08:30', 30, 1),
('Free Play', '08:30', '09:15', 45, 2),
('Snack Time', '09:15', '09:30', 15, 3),
('Learning Activity 1', '09:30', '10:15', 45, 4),
('Outdoor Play', '10:15', '11:00', 45, 5),
('Learning Activity 2', '11:00', '11:45', 45, 6),
('Lunch', '11:45', '12:30', 45, 7),
('Quiet Time/Rest', '12:30', '13:15', 45, 8),
('Art & Creativity', '13:15', '14:00', 45, 9),
('Story Time', '14:00', '14:30', 30, 10),
('Closing Circle', '14:30', '15:00', 30, 11)
ON CONFLICT DO NOTHING;

-- Sample curriculum template
INSERT INTO curriculum_templates (
  name, 
  description, 
  age_group, 
  subject_area, 
  total_weeks,
  learning_objectives,
  materials_list,
  created_by
) VALUES (
  'Early Math Concepts',
  'Introduction to numbers, counting, and basic math concepts for preschoolers',
  '3-4 years',
  'Mathematics',
  4,
  ARRAY['Count to 10', 'Recognize numbers 1-5', 'Understand more/less concepts', 'Basic shape recognition'],
  ARRAY['Counting bears', 'Number cards', 'Shape blocks', 'Math manipulatives'],
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
) ON CONFLICT DO NOTHING;

-- Sample curriculum items with time slots
INSERT INTO curriculum_items (
  curriculum_id,
  title,
  description,
  activity_type,
  materials_needed,
  learning_goals,
  week_number,
  day_number,
  time_slot_id,
  estimated_duration,
  skills_developed
) VALUES 
(
  (SELECT id FROM curriculum_templates WHERE name = 'Early Math Concepts' LIMIT 1),
  'Counting Bears Fun',
  'Use colorful counting bears to practice counting 1-5',
  'hands-on',
  ARRAY['Counting bears', 'Small bowls', 'Number cards'],
  ARRAY['Count objects 1-5', 'One-to-one correspondence'],
  1,
  1,
  (SELECT id FROM time_slots WHERE name = 'Learning Activity 1' LIMIT 1),
  45,
  ARRAY['counting', 'fine motor', 'number recognition']
),
(
  (SELECT id FROM curriculum_templates WHERE name = 'Early Math Concepts' LIMIT 1),
  'Shape Hunt Adventure',
  'Find and identify shapes around the classroom',
  'exploration',
  ARRAY['Shape cards', 'Magnifying glasses', 'Shape stickers'],
  ARRAY['Identify basic shapes', 'Spatial awareness'],
  1,
  2,
  (SELECT id FROM time_slots WHERE name = 'Learning Activity 2' LIMIT 1),
  45,
  ARRAY['shape recognition', 'observation', 'vocabulary']
) ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_imports ENABLE ROW LEVEL SECURITY;

-- Time slots policies
CREATE POLICY "All authenticated users can read time slots"
  ON time_slots FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage time slots"
  ON time_slots FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Curriculum templates policies
CREATE POLICY "All authenticated users can read active curriculum templates"
  ON curriculum_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins and teachers can manage curriculum templates"
  ON curriculum_templates FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'teacher')
  ));

-- Curriculum assignments policies
CREATE POLICY "Teachers can read assignments for their classes"
  ON curriculum_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_assignments ca
      JOIN users u ON ca.teacher_id = u.id
      WHERE ca.class_id = curriculum_assignments.class_id 
      AND u.id = auth.uid() 
      AND u.role = 'teacher'
    )
    OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage curriculum assignments"
  ON curriculum_assignments FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Curriculum executions policies
CREATE POLICY "Teachers can manage executions for their classes"
  ON curriculum_executions FOR ALL
  TO authenticated
  USING (
    teacher_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM class_assignments ca
      JOIN users u ON ca.teacher_id = u.id
      WHERE ca.class_id = curriculum_executions.class_id 
      AND u.id = auth.uid() 
      AND u.role = 'teacher'
    )
    OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Curriculum imports policies
CREATE POLICY "Admins and teachers can manage imports"
  ON curriculum_imports FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'teacher')
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_curriculum_items_curriculum_week_day ON curriculum_items(curriculum_id, week_number, day_number);
CREATE INDEX IF NOT EXISTS idx_curriculum_executions_class_date ON curriculum_executions(class_id, execution_date);
CREATE INDEX IF NOT EXISTS idx_curriculum_assignments_class ON curriculum_assignments(class_id, is_active);
CREATE INDEX IF NOT EXISTS idx_time_slots_active ON time_slots(is_active, sort_order);