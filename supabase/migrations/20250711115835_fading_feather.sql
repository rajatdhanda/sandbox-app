/*
  # Complete Preschool Management System

  1. Enhanced Tables
    - Enhanced curriculum with class assignments
    - Photo tagging system
    - Message threading
    - Schedule management
    - Attendance tracking
    - Class-curriculum assignments
    - Enhanced user roles and assignments

  2. Security
    - Comprehensive RLS policies for all tables
    - Role-based access control
    - Data isolation between classes

  3. Sample Data
    - Demo users (teachers, parents, admin)
    - Sample classes with assignments
    - Curriculum with daily/weekly plans
    - Students assigned to classes
    - Sample photos with tags
    - Messages and schedules
*/

-- Enhanced curriculum table with class assignments
CREATE TABLE IF NOT EXISTS class_curriculum_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  curriculum_id uuid REFERENCES curriculum(id) ON DELETE CASCADE,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(class_id, curriculum_id)
);

-- Enhanced photo tags with better categorization
ALTER TABLE photo_tags ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);
ALTER TABLE photo_tags ADD COLUMN IF NOT EXISTS tag_category text DEFAULT 'general';

-- Message threads for better organization
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  participants uuid[] NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  is_archived boolean DEFAULT false,
  thread_type text DEFAULT 'conversation' CHECK (thread_type IN ('conversation', 'announcement', 'urgent')),
  created_at timestamptz DEFAULT now()
);

-- Enhanced messages with threading
ALTER TABLE messages ADD COLUMN IF NOT EXISTS thread_id uuid REFERENCES message_threads(id);

-- Schedule management
CREATE TABLE IF NOT EXISTS class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time time NOT NULL,
  end_time time NOT NULL,
  activity_name text NOT NULL,
  description text,
  curriculum_item_id uuid REFERENCES curriculum_items(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Student tags for flexible categorization
CREATE TABLE IF NOT EXISTS student_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  tag_name text NOT NULL,
  tag_category text DEFAULT 'general',
  tag_value text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Enhanced attendance with more details
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS parent_notified boolean DEFAULT false;
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES classes(id);

-- RLS Policies
ALTER TABLE class_curriculum_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_tags ENABLE ROW LEVEL SECURITY;

-- Class curriculum assignments policies
CREATE POLICY "Admins can manage class curriculum assignments"
  ON class_curriculum_assignments FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Teachers can read their class curriculum"
  ON class_curriculum_assignments FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM class_assignments ca
    JOIN users u ON ca.teacher_id = u.id
    WHERE ca.class_id = class_curriculum_assignments.class_id 
    AND u.id = auth.uid() AND u.role = 'teacher'
  ));

-- Message threads policies
CREATE POLICY "Users can access threads they participate in"
  ON message_threads FOR ALL
  TO authenticated
  USING (auth.uid() = ANY(participants));

-- Class schedules policies
CREATE POLICY "Admins can manage all schedules"
  ON class_schedules FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Teachers can manage their class schedules"
  ON class_schedules FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM class_assignments ca
    JOIN users u ON ca.teacher_id = u.id
    WHERE ca.class_id = class_schedules.class_id 
    AND u.id = auth.uid() AND u.role = 'teacher'
  ));

CREATE POLICY "All users can read active schedules"
  ON class_schedules FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Student tags policies
CREATE POLICY "Admins can manage all student tags"
  ON student_tags FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Teachers can manage tags for their students"
  ON student_tags FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM children c
    JOIN class_assignments ca ON ca.class_id = c.class_id
    JOIN users u ON ca.teacher_id = u.id
    WHERE c.id = student_tags.child_id 
    AND u.id = auth.uid() AND u.role = 'teacher'
  ));

CREATE POLICY "Parents can read their children's tags"
  ON student_tags FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parent_child_relationships pcr
    WHERE pcr.child_id = student_tags.child_id 
    AND pcr.parent_id = auth.uid()
  ));

-- Sample Data for Complete Flow

-- 1. Sample Users (Teachers, Parents, Admin)
INSERT INTO users (id, email, full_name, role, phone, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@littlestars.com', 'Admin User', 'admin', '+1-555-0001', true),
  ('22222222-2222-2222-2222-222222222222', 'sarah.johnson@littlestars.com', 'Sarah Johnson', 'teacher', '+1-555-0002', true),
  ('33333333-3333-3333-3333-333333333333', 'mike.davis@littlestars.com', 'Mike Davis', 'teacher', '+1-555-0003', true),
  ('44444444-4444-4444-4444-444444444444', 'parent1@example.com', 'Jennifer Wilson', 'parent', '+1-555-0004', true),
  ('55555555-5555-5555-5555-555555555555', 'parent2@example.com', 'Robert Martinez', 'parent', '+1-555-0005', true)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- 2. Sample Classes
INSERT INTO classes (id, name, age_group, capacity, schedule_start, schedule_end, color_code, is_active) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sunflower Class', '3-4 years', 20, '08:00', '15:00', '#F59E0B', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Rainbow Class', '4-5 years', 18, '08:30', '15:30', '#8B5CF6', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  age_group = EXCLUDED.age_group;

-- 3. Teacher-Class Assignments
INSERT INTO class_assignments (teacher_id, class_id, is_primary) VALUES
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true),
  ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', true)
ON CONFLICT (teacher_id, class_id) DO NOTHING;

-- 4. Sample Students
INSERT INTO children (id, first_name, last_name, date_of_birth, class_id, is_active) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Emma', 'Wilson', '2020-03-15', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Liam', 'Martinez', '2019-08-22', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Sofia', 'Chen', '2020-01-10', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true)
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  class_id = EXCLUDED.class_id;

-- 5. Parent-Child Relationships
INSERT INTO parent_child_relationships (parent_id, child_id, is_primary) VALUES
  ('44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true),
  ('55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', true)
ON CONFLICT (parent_id, child_id) DO NOTHING;

-- 6. Sample Curriculum
INSERT INTO curriculum (id, name, description, age_group, subject_area, duration_weeks, learning_objectives) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Early Math Concepts', 'Introduction to numbers, counting, and basic math', '3-4 years', 'Mathematics', 4, 
   ARRAY['Count to 10', 'Recognize numbers 1-5', 'Basic addition concepts']),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Creative Arts', 'Exploring creativity through various art mediums', '3-5 years', 'Arts', 6,
   ARRAY['Color recognition', 'Fine motor skills', 'Creative expression'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 7. Curriculum Items (Daily/Weekly Plans)
INSERT INTO curriculum_items (curriculum_id, title, description, activity_type, week_number, day_number, estimated_duration, materials_needed, learning_goals) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Counting Bears', 'Using colorful bears to learn counting', 'hands-on', 1, 1, 30, 
   ARRAY['Counting bears', 'Number cards'], ARRAY['Count to 5', 'One-to-one correspondence']),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Number Recognition', 'Identifying numbers 1-3', 'visual', 1, 2, 25,
   ARRAY['Number flashcards', 'Worksheets'], ARRAY['Recognize numbers 1-3']),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Finger Painting', 'Exploring colors through finger painting', 'creative', 1, 1, 45,
   ARRAY['Finger paints', 'Paper', 'Aprons'], ARRAY['Color mixing', 'Creative expression'])
ON CONFLICT DO NOTHING;

-- 8. Class-Curriculum Assignments
INSERT INTO class_curriculum_assignments (class_id, curriculum_id, start_date) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ffffffff-ffff-ffff-ffff-ffffffffffff', CURRENT_DATE),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'gggggggg-gggg-gggg-gggg-gggggggggggg', CURRENT_DATE),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'gggggggg-gggg-gggg-gggg-gggggggggggg', CURRENT_DATE)
ON CONFLICT (class_id, curriculum_id) DO NOTHING;

-- 9. Sample Photos with Tags
INSERT INTO photos (id, child_id, teacher_id, image_url, caption, activity_type, is_shared_with_parents) VALUES
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 
   'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg', 'Emma creating her masterpiece', 'art', true),
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333',
   'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg', 'Liam playing with counting bears', 'math', true)
ON CONFLICT (id) DO NOTHING;

-- 10. Photo Tags
INSERT INTO photo_tags (photo_id, tag_name, tag_type, created_by) VALUES
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'creative', 'skill', '22222222-2222-2222-2222-222222222222'),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'fine-motor', 'development', '22222222-2222-2222-2222-222222222222'),
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'counting', 'skill', '33333333-3333-3333-3333-333333333333'),
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'math-concepts', 'subject', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- 11. Student Tags
INSERT INTO student_tags (child_id, tag_name, tag_category, tag_value, created_by) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'artistic', 'personality', 'high', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'social', 'behavior', 'excellent', '22222222-2222-2222-2222-222222222222'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'mathematical', 'aptitude', 'strong', '33333333-3333-3333-3333-333333333333'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'quiet', 'personality', 'medium', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- 12. Class Schedules
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, activity_name, description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '09:00', '09:30', 'Circle Time', 'Morning greeting and calendar'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '09:30', '10:30', 'Math Activities', 'Counting and number recognition'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '10:30', '11:30', 'Art Time', 'Creative expression activities'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '09:00', '09:45', 'Morning Meeting', 'Daily planning and sharing'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '09:45', '10:45', 'Creative Arts', 'Painting and crafts')
ON CONFLICT DO NOTHING;

-- 13. Sample Attendance
INSERT INTO attendance_records (child_id, class_id, attendance_date, check_in_time, status, checked_in_by) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 
   CURRENT_TIMESTAMP - INTERVAL '2 hours', 'present', '22222222-2222-2222-2222-222222222222'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE,
   CURRENT_TIMESTAMP - INTERVAL '1.5 hours', 'present', '33333333-3333-3333-3333-333333333333'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE,
   CURRENT_TIMESTAMP - INTERVAL '1 hour', 'late', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (child_id, attendance_date) DO NOTHING;

-- 14. Sample Messages
INSERT INTO message_threads (id, subject, participants) VALUES
  ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'Emma''s Progress Update', 
   ARRAY['22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (sender_id, recipient_id, child_id, subject, content, thread_id) VALUES
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 
   'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Emma''s Progress Update',
   'Emma had a wonderful day today! She showed great creativity in art class and is making excellent progress with counting.',
   'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj')
ON CONFLICT DO NOTHING;

-- 15. Sample Daily Logs
INSERT INTO daily_logs (child_id, teacher_id, activity_type, mood, description, skill_tags, duration_minutes) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 
   'art', 'happy', 'Emma created a beautiful painting using watercolors. She mixed colors independently.', 
   ARRAY['creativity', 'fine-motor', 'color-recognition'], 45),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333',
   'math', 'focused', 'Liam counted to 10 using counting bears and showed understanding of one-to-one correspondence.',
   ARRAY['counting', 'number-recognition', 'math-concepts'], 30)
ON CONFLICT DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_curriculum_assignments_class_id ON class_curriculum_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_participants ON message_threads USING gin(participants);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class_day ON class_schedules(class_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_student_tags_child_id ON student_tags(child_id);
CREATE INDEX IF NOT EXISTS idx_photo_tags_photo_id ON photo_tags(photo_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_records_child_id ON attendance_records(child_id);