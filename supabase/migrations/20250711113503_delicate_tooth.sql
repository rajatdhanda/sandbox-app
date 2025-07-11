/*
  # Add sample data for testing features

  1. Sample Data
    - Add sample milestones
    - Add sample notifications  
    - Add sample announcements
    - Add sample events
    - Add sample attendance records
    - Add sample daily logs with photos

  2. Testing Data
    - Ensures all features have data to display
    - Covers different scenarios and edge cases
*/

-- Insert sample milestones
INSERT INTO milestones (child_id, teacher_id, title, description, category, achievement_date, is_shared_with_parents, notes) 
SELECT 
  c.id,
  t.id,
  'First Steps Achievement',
  'Successfully completed first independent walking milestone during outdoor play time.',
  'physical_development',
  CURRENT_DATE - INTERVAL '2 days',
  true,
  'Great progress in gross motor skills!'
FROM children c
CROSS JOIN (SELECT id FROM users WHERE role = 'teacher' LIMIT 1) t
WHERE c.first_name = 'Emma'
LIMIT 1;

INSERT INTO milestones (child_id, teacher_id, title, description, category, achievement_date, is_shared_with_parents, notes)
SELECT 
  c.id,
  t.id,
  'Reading Recognition',
  'Recognized and read 10 sight words independently during story time.',
  'cognitive_development', 
  CURRENT_DATE - INTERVAL '1 day',
  true,
  'Excellent reading progress!'
FROM children c
CROSS JOIN (SELECT id FROM users WHERE role = 'teacher' LIMIT 1) t
WHERE c.first_name = 'Emma'
LIMIT 1;

-- Insert sample notifications for parents
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT 
  p.id,
  'New Photos Available',
  'Your child has new photos from today''s art activity. Check them out in the photos section!',
  'info',
  false,
  NOW() - INTERVAL '1 hour'
FROM users p
WHERE p.role = 'parent' AND p.email = 'parent1@example.com';

INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT 
  p.id,
  'Milestone Achievement',
  'Emma achieved a new milestone in reading! She can now recognize 10 sight words.',
  'success',
  false,
  NOW() - INTERVAL '2 hours'
FROM users p  
WHERE p.role = 'parent' AND p.email = 'parent1@example.com';

INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT 
  p.id,
  'Upcoming Event',
  'Don''t forget about the parent-teacher conference scheduled for tomorrow at 3:00 PM.',
  'warning',
  false,
  NOW() - INTERVAL '3 hours'
FROM users p
WHERE p.role = 'parent' AND p.email = 'parent1@example.com';

-- Insert sample notifications for teachers
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT 
  t.id,
  'New Student Enrollment',
  'A new student has been enrolled in your class. Please review their profile.',
  'info',
  false,
  NOW() - INTERVAL '30 minutes'
FROM users t
WHERE t.role = 'teacher' AND t.email = 'teacher1@example.com';

-- Insert sample announcements
INSERT INTO announcements (author_id, title, content, type, target_audience, is_published, publish_date)
SELECT 
  a.id,
  'School Holiday Notice',
  'Please note that the school will be closed next Friday for a professional development day. Regular classes will resume on Monday.',
  'general',
  ARRAY['all'],
  true,
  NOW() - INTERVAL '1 day'
FROM users a
WHERE a.role = 'admin'
LIMIT 1;

INSERT INTO announcements (author_id, title, content, type, target_audience, is_published, publish_date)
SELECT 
  a.id,
  'Parent-Teacher Conferences',
  'Parent-teacher conferences are scheduled for next week. Please check your email for your assigned time slot.',
  'event',
  ARRAY['parent'],
  true,
  NOW() - INTERVAL '2 days'
FROM users a
WHERE a.role = 'admin'
LIMIT 1;

-- Insert sample events
INSERT INTO events (title, description, event_type, start_date, end_date, location, organizer_id, is_all_classes, requires_permission, status)
SELECT 
  'Spring Art Exhibition',
  'Annual showcase of student artwork and creative projects. All families welcome!',
  'exhibition',
  NOW() + INTERVAL '1 week',
  NOW() + INTERVAL '1 week' + INTERVAL '3 hours',
  'Main Hall',
  a.id,
  true,
  false,
  'scheduled'
FROM users a
WHERE a.role = 'admin'
LIMIT 1;

INSERT INTO events (title, description, event_type, start_date, end_date, location, organizer_id, is_all_classes, requires_permission, status)
SELECT 
  'Field Trip to Zoo',
  'Educational visit to the city zoo. Permission slips required.',
  'field_trip',
  NOW() + INTERVAL '2 weeks',
  NOW() + INTERVAL '2 weeks' + INTERVAL '6 hours',
  'City Zoo',
  t.id,
  false,
  true,
  'scheduled'
FROM users t
WHERE t.role = 'teacher'
LIMIT 1;

-- Insert sample attendance records for today
INSERT INTO attendance (child_id, attendance_date, check_in_time, status, checked_in_by)
SELECT 
  c.id,
  CURRENT_DATE,
  NOW() - INTERVAL '2 hours',
  'present',
  t.id
FROM children c
CROSS JOIN (SELECT id FROM users WHERE role = 'teacher' LIMIT 1) t
WHERE c.is_active = true
LIMIT 5;

-- Insert sample daily logs with recent activities
INSERT INTO daily_logs (child_id, teacher_id, log_date, activity_type, mood, description, skill_tags, duration_minutes, notes)
SELECT 
  c.id,
  t.id,
  CURRENT_DATE,
  'Art & Craft',
  'happy',
  'Created a beautiful butterfly painting using watercolors. Showed great creativity and focus.',
  ARRAY['creativity', 'fine_motor_skills', 'color_recognition'],
  45,
  'Excellent concentration and artistic expression!'
FROM children c
CROSS JOIN (SELECT id FROM users WHERE role = 'teacher' LIMIT 1) t
WHERE c.first_name = 'Emma'
LIMIT 1;

INSERT INTO daily_logs (child_id, teacher_id, log_date, activity_type, mood, description, skill_tags, duration_minutes, notes)
SELECT 
  c.id,
  t.id,
  CURRENT_DATE,
  'Story Time',
  'engaged',
  'Actively participated in story reading and answered questions about the characters.',
  ARRAY['listening_skills', 'comprehension', 'vocabulary'],
  30,
  'Great engagement and understanding!'
FROM children c
CROSS JOIN (SELECT id FROM users WHERE role = 'teacher' LIMIT 1) t
WHERE c.first_name = 'Emma'
LIMIT 1;

-- Insert sample photos
INSERT INTO photos (child_id, teacher_id, image_url, caption, activity_type, photo_date, is_shared_with_parents)
SELECT 
  c.id,
  t.id,
  'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'Emma working on her butterfly painting during art time',
  'Art & Craft',
  CURRENT_DATE,
  true
FROM children c
CROSS JOIN (SELECT id FROM users WHERE role = 'teacher' LIMIT 1) t
WHERE c.first_name = 'Emma'
LIMIT 1;

INSERT INTO photos (child_id, teacher_id, image_url, caption, activity_type, photo_date, is_shared_with_parents)
SELECT 
  c.id,
  t.id,
  'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'Story time with the class - everyone listening intently',
  'Story Time',
  CURRENT_DATE,
  true
FROM children c
CROSS JOIN (SELECT id FROM users WHERE role = 'teacher' LIMIT 1) t
WHERE c.first_name = 'Emma'
LIMIT 1;