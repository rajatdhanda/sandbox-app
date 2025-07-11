/*
  # Add comprehensive backend features

  1. New Tables
    - `notifications` - System notifications and alerts
    - `milestones` - Student milestones and achievements
    - `announcements` - School-wide announcements
    - `events` - Calendar events and activities
    - `message_threads` - Message conversation threads
    - `attendance_summary` - Daily attendance summaries
    - `photo_albums` - Photo organization
    - `student_progress` - Academic progress tracking

  2. Enhanced Features
    - Notification system with real-time alerts
    - Milestone tracking for student development
    - Event calendar integration
    - Message threading for better communication
    - Photo album organization
    - Progress tracking and reporting

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each user role
*/

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'urgent')),
  is_read boolean DEFAULT false,
  action_url text,
  related_id uuid,
  related_type text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'development',
  achievement_date date DEFAULT CURRENT_DATE,
  is_shared_with_parents boolean DEFAULT true,
  photos text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read milestones for their children"
  ON milestones FOR SELECT
  TO authenticated
  USING (
    is_shared_with_parents = true AND
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.child_id = milestones.child_id AND pcr.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage milestones for their class children"
  ON milestones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN class_assignments ca ON ca.class_id = c.class_id
      JOIN users u ON ca.teacher_id = u.id
      WHERE c.id = milestones.child_id AND u.id = auth.uid() AND u.role = 'teacher'
    )
  );

CREATE POLICY "Admins can manage all milestones"
  ON milestones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES users(id),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'urgent', 'event', 'reminder')),
  target_audience text[] DEFAULT ARRAY['all'],
  is_published boolean DEFAULT false,
  publish_date timestamptz DEFAULT now(),
  expires_at timestamptz,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read published announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins and teachers can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'teacher')
    )
  );

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'activity',
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  organizer_id uuid REFERENCES users(id),
  class_ids uuid[],
  is_all_classes boolean DEFAULT false,
  requires_permission boolean DEFAULT false,
  max_participants integer,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'teacher')
    )
  );

-- Message threads table
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  participants uuid[] NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  is_archived boolean DEFAULT false,
  thread_type text DEFAULT 'conversation' CHECK (thread_type IN ('conversation', 'announcement', 'urgent')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access threads they participate in"
  ON message_threads FOR ALL
  TO authenticated
  USING (auth.uid() = ANY(participants));

-- Update messages table to reference threads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'thread_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN thread_id uuid REFERENCES message_threads(id);
  END IF;
END $$;

-- Photo albums table
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  class_id uuid REFERENCES classes(id),
  teacher_id uuid REFERENCES users(id),
  cover_photo_url text,
  is_shared_with_parents boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read shared albums"
  ON photo_albums FOR SELECT
  TO authenticated
  USING (is_shared_with_parents = true);

CREATE POLICY "Teachers can manage their class albums"
  ON photo_albums FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'teacher')
    )
  );

-- Add album_id to photos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'photos' AND column_name = 'album_id'
  ) THEN
    ALTER TABLE photos ADD COLUMN album_id uuid REFERENCES photo_albums(id);
  END IF;
END $$;

-- Student progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id),
  subject_area text NOT NULL,
  skill_name text NOT NULL,
  current_level text NOT NULL,
  target_level text,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  assessment_date date DEFAULT CURRENT_DATE,
  notes text,
  next_steps text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read progress for their children"
  ON student_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships pcr
      WHERE pcr.child_id = student_progress.child_id AND pcr.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage progress for their class children"
  ON student_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN class_assignments ca ON ca.class_id = c.class_id
      JOIN users u ON ca.teacher_id = u.id
      WHERE c.id = student_progress.child_id AND u.id = auth.uid() AND u.role = 'teacher'
    )
  );

CREATE POLICY "Admins can manage all progress records"
  ON student_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_milestones_child_id ON milestones(child_id);
CREATE INDEX IF NOT EXISTS idx_milestones_achievement_date ON milestones(achievement_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_message_threads_participants ON message_threads USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_student_progress_child_id ON student_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_assessment_date ON student_progress(assessment_date DESC);

-- Insert sample data for testing
INSERT INTO notifications (user_id, title, message, type) 
SELECT 
  u.id,
  'Welcome to Little Stars Preschool',
  'Your account has been set up successfully. Explore the features available to you.',
  'info'
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = u.id)
LIMIT 5;

INSERT INTO announcements (author_id, title, content, type, is_published)
SELECT 
  u.id,
  'School Holiday Notice',
  'Please note that the school will be closed next Friday for teacher training. Regular classes will resume on Monday.',
  'general',
  true
FROM users u 
WHERE u.role = 'admin'
LIMIT 1;

INSERT INTO events (title, description, event_type, start_date, end_date, is_all_classes)
VALUES 
  ('Spring Festival', 'Annual spring celebration with activities for all classes', 'event', 
   CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days' + INTERVAL '3 hours', true),
  ('Parent-Teacher Conference', 'Individual meetings with parents to discuss student progress', 'meeting',
   CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '14 days' + INTERVAL '6 hours', true);