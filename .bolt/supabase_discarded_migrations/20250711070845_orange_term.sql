/*
  # Create Demo Users and Test Data

  1. Demo Users
    - Admin: admin@example.com
    - Teacher: teacher1@example.com  
    - Parent: parent1@example.com

  2. Test Data
    - 2-3 test children
    - 1-2 test classes
    - Sample relationships

  3. Security
    - All demo users have simple passwords for testing
    - Proper role assignments
*/

-- Insert demo users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'teacher1@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'parent1@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  );

-- Insert user profiles
INSERT INTO users (id, email, full_name, role, phone, address, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'System Administrator', 'admin', '555-0001', '123 Admin St', true),
  ('22222222-2222-2222-2222-222222222222', 'teacher1@example.com', 'Ms. Sarah Johnson', 'teacher', '555-0002', '456 Teacher Ave', true),
  ('33333333-3333-3333-3333-333333333333', 'parent1@example.com', 'John Smith', 'parent', '555-0003', '789 Parent Blvd', true);

-- Insert test classes
INSERT INTO classes (id, name, age_group, capacity, schedule_start, schedule_end, description, color_code) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sunflower Class', '3-4 years', 20, '08:00:00', '15:00:00', 'A bright and cheerful class for 3-4 year olds', '#F59E0B'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Rainbow Class', '2-3 years', 18, '08:30:00', '15:30:00', 'A colorful learning environment for toddlers', '#8B5CF6');

-- Assign teacher to classes
INSERT INTO class_assignments (teacher_id, class_id, is_primary) VALUES
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true),
  ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', false);

-- Insert test children
INSERT INTO children (id, first_name, last_name, date_of_birth, class_id, medical_notes, allergies, emergency_contact, emergency_phone) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Emma', 'Smith', '2020-03-15', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'No known medical issues', 'None', 'Jane Smith', '555-0004'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Liam', 'Smith', '2021-07-22', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mild asthma', 'Peanuts', 'Jane Smith', '555-0004'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Sofia', 'Johnson', '2020-11-08', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'No known medical issues', 'Dairy', 'Mike Johnson', '555-0005');

-- Link children to parents
INSERT INTO parent_child_relationships (parent_id, child_id, relationship_type, is_primary) VALUES
  ('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'parent', true),
  ('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'parent', true);

-- Insert sample config fields
INSERT INTO config_fields (category, label, value, description, sort_order) VALUES
  ('mood', 'Happy', 'happy', 'Child is cheerful and content', 1),
  ('mood', 'Excited', 'excited', 'Child is energetic and enthusiastic', 2),
  ('mood', 'Calm', 'calm', 'Child is peaceful and relaxed', 3),
  ('mood', 'Tired', 'tired', 'Child appears sleepy or low energy', 4),
  ('mood', 'Upset', 'upset', 'Child is sad or distressed', 5),
  
  ('activity_type', 'Circle Time', 'circle_time', 'Group discussion and sharing time', 1),
  ('activity_type', 'Art & Craft', 'art_craft', 'Creative activities with various materials', 2),
  ('activity_type', 'Outdoor Play', 'outdoor_play', 'Physical activities in playground', 3),
  ('activity_type', 'Story Time', 'story_time', 'Reading and storytelling activities', 4),
  ('activity_type', 'Music & Movement', 'music_movement', 'Singing, dancing, and rhythm activities', 5),
  ('activity_type', 'Snack Time', 'snack_time', 'Eating and nutrition activities', 6),
  ('activity_type', 'Quiet Time', 'quiet_time', 'Rest and relaxation period', 7),
  
  ('skill_tag', 'Fine Motor Skills', 'fine_motor', 'Small muscle movements and dexterity', 1),
  ('skill_tag', 'Gross Motor Skills', 'gross_motor', 'Large muscle movements and coordination', 2),
  ('skill_tag', 'Language Development', 'language', 'Speaking, listening, and communication', 3),
  ('skill_tag', 'Social Skills', 'social', 'Interaction and cooperation with others', 4),
  ('skill_tag', 'Cognitive Development', 'cognitive', 'Thinking, problem-solving, and learning', 5),
  ('skill_tag', 'Emotional Development', 'emotional', 'Understanding and expressing feelings', 6),
  ('skill_tag', 'Creativity', 'creativity', 'Imagination and artistic expression', 7),
  ('skill_tag', 'Independence', 'independence', 'Self-help and autonomous activities', 8),
  
  ('worksheet_type', 'Math Practice', 'math', 'Number recognition and basic math concepts', 1),
  ('worksheet_type', 'Letter Recognition', 'letters', 'Alphabet and phonics activities', 2),
  ('worksheet_type', 'Coloring Activity', 'coloring', 'Creative coloring and art worksheets', 3),
  ('worksheet_type', 'Tracing Practice', 'tracing', 'Fine motor skill development through tracing', 4),
  ('worksheet_type', 'Pattern Recognition', 'patterns', 'Visual pattern and sequence activities', 5);

-- Insert sample daily logs
INSERT INTO daily_logs (child_id, teacher_id, log_date, activity_type, mood, description, skill_tags, duration_minutes, notes) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'art_craft', 'happy', 'Emma created a beautiful butterfly painting using watercolors. She showed great creativity and attention to detail!', ARRAY['creativity', 'fine_motor'], 45, 'Emma was very focused and proud of her work'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'circle_time', 'excited', 'Emma participated actively in our morning circle time. We sang songs about the weather and she shared her favorite color!', ARRAY['language', 'social'], 30, 'Great participation and enthusiasm'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'outdoor_play', 'happy', 'Liam enjoyed playing on the swings and slides. He made new friends and practiced sharing toys with others.', ARRAY['gross_motor', 'social'], 60, 'Good social interaction with peers'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'story_time', 'calm', 'Sofia listened attentively to "The Very Hungry Caterpillar" and answered questions about the story.', ARRAY['language', 'cognitive'], 25, 'Excellent comprehension and engagement');

-- Insert sample photos
INSERT INTO photos (child_id, teacher_id, image_url, caption, activity_type, photo_date, is_shared_with_parents) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Emma working on her butterfly painting', 'art_craft', CURRENT_DATE, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Liam having fun on the playground', 'outdoor_play', CURRENT_DATE, true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'https://images.pexels.com/photos/1181343/pexels-photo-1181343.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Sofia during story time', 'story_time', CURRENT_DATE, true);

-- Insert sample attendance records
INSERT INTO attendance (child_id, attendance_date, check_in_time, checked_in_by, status) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE, CURRENT_TIMESTAMP, '22222222-2222-2222-2222-222222222222', 'present'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_DATE, CURRENT_TIMESTAMP, '22222222-2222-2222-2222-222222222222', 'present'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', CURRENT_DATE, CURRENT_TIMESTAMP, '22222222-2222-2222-2222-222222222222', 'present');