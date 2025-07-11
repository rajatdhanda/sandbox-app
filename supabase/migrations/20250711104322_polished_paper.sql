/*
  # Add comprehensive sample data for production testing

  1. Sample Data
    - Additional demo users (parents, teachers, admins)
    - Sample children with realistic profiles
    - Classes with proper schedules
    - Daily logs with activities
    - Photos and worksheets
    - Configuration fields for dropdowns

  2. Relationships
    - Parent-child relationships
    - Teacher-class assignments
    - Activity logs linked to children and teachers

  3. Configuration
    - Mood options
    - Activity types
    - Skill tags
    - Worksheet types
*/

-- Insert additional demo users
INSERT INTO users (id, email, full_name, role, phone, address, emergency_contact, emergency_phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@example.com', 'Sarah Johnson', 'parent', '+1-555-0101', '123 Maple Street, Springfield, IL 62701', 'Mike Johnson', '+1-555-0102'),
  ('550e8400-e29b-41d4-a716-446655440002', 'mike.davis@example.com', 'Mike Davis', 'parent', '+1-555-0201', '456 Oak Avenue, Springfield, IL 62702', 'Lisa Davis', '+1-555-0202'),
  ('550e8400-e29b-41d4-a716-446655440003', 'lisa.wilson@example.com', 'Lisa Wilson', 'teacher', '+1-555-0301', '789 Pine Road, Springfield, IL 62703', 'John Wilson', '+1-555-0302'),
  ('550e8400-e29b-41d4-a716-446655440004', 'jennifer.martinez@example.com', 'Jennifer Martinez', 'parent', '+1-555-0401', '321 Elm Street, Springfield, IL 62704', 'Carlos Martinez', '+1-555-0402'),
  ('550e8400-e29b-41d4-a716-446655440005', 'david.chen@example.com', 'David Chen', 'parent', '+1-555-0501', '654 Birch Lane, Springfield, IL 62705', 'Amy Chen', '+1-555-0502'),
  ('550e8400-e29b-41d4-a716-446655440006', 'amanda.thompson@example.com', 'Amanda Thompson', 'teacher', '+1-555-0601', '987 Cedar Drive, Springfield, IL 62706', 'Robert Thompson', '+1-555-0602'),
  ('550e8400-e29b-41d4-a716-446655440007', 'robert.rodriguez@example.com', 'Robert Rodriguez', 'parent', '+1-555-0701', '147 Willow Way, Springfield, IL 62707', 'Maria Rodriguez', '+1-555-0702'),
  ('550e8400-e29b-41d4-a716-446655440008', 'michelle.brown@example.com', 'Michelle Brown', 'teacher', '+1-555-0801', '258 Spruce Street, Springfield, IL 62708', 'James Brown', '+1-555-0802')
ON CONFLICT (id) DO NOTHING;

-- Insert sample classes
INSERT INTO classes (id, name, age_group, capacity, schedule_start, schedule_end, description, color_code) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Sunflower Class', '3-4 years', 20, '08:00:00', '15:00:00', 'A nurturing environment for 3-4 year olds focusing on social skills and creativity', '#F59E0B'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Rainbow Class', '2-3 years', 18, '08:30:00', '15:30:00', 'Gentle introduction to structured learning for toddlers', '#8B5CF6'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Butterfly Class', '4-5 years', 22, '07:30:00', '14:30:00', 'Pre-K preparation with focus on literacy and numeracy', '#EC4899'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Ocean Class', '3-4 years', 16, '09:00:00', '16:00:00', 'Nature-based learning with outdoor exploration', '#10B981')
ON CONFLICT (id) DO NOTHING;

-- Insert sample children
INSERT INTO children (id, first_name, last_name, date_of_birth, class_id, medical_notes, allergies, emergency_contact, emergency_phone) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Emma', 'Johnson', '2020-03-15', '660e8400-e29b-41d4-a716-446655440001', 'No known medical conditions', 'Peanuts', 'Grandma Johnson', '+1-555-0103'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Liam', 'Davis', '2021-07-22', '660e8400-e29b-41d4-a716-446655440002', 'Mild asthma - inhaler available', 'None known', 'Uncle Tom', '+1-555-0203'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Sofia', 'Martinez', '2019-11-08', '660e8400-e29b-41d4-a716-446655440003', 'Wears glasses for reading', 'Dairy', 'Aunt Rosa', '+1-555-0403'),
  ('770e8400-e29b-41d4-a716-446655440004', 'Oliver', 'Chen', '2020-09-12', '660e8400-e29b-41d4-a716-446655440001', 'No known medical conditions', 'Shellfish', 'Grandpa Chen', '+1-555-0503'),
  ('770e8400-e29b-41d4-a716-446655440005', 'Maya', 'Rodriguez', '2021-01-30', '660e8400-e29b-41d4-a716-446655440002', 'No known medical conditions', 'None known', 'Aunt Carmen', '+1-555-0703'),
  ('770e8400-e29b-41d4-a716-446655440006', 'Noah', 'Thompson', '2020-05-18', '660e8400-e29b-41d4-a716-446655440004', 'ADHD - medication at lunch', 'Food coloring', 'Neighbor Mrs. Smith', '+1-555-0603')
ON CONFLICT (id) DO NOTHING;

-- Insert parent-child relationships
INSERT INTO parent_child_relationships (parent_id, child_id, relationship_type, is_primary) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'parent', true),
  ('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'parent', true),
  ('550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', 'parent', true),
  ('550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440004', 'parent', true),
  ('550e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440005', 'parent', true)
ON CONFLICT (parent_id, child_id) DO NOTHING;

-- Insert teacher-class assignments
INSERT INTO class_assignments (teacher_id, class_id, is_primary) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', true),
  ('550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', true),
  ('550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', true),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', false)
ON CONFLICT (teacher_id, class_id) DO NOTHING;

-- Insert configuration fields for dynamic dropdowns
INSERT INTO config_fields (category, label, value, description, sort_order) VALUES
  -- Mood options
  ('mood', 'Happy', 'happy', 'Child was cheerful and positive', 1),
  ('mood', 'Excited', 'excited', 'Child was energetic and enthusiastic', 2),
  ('mood', 'Calm', 'calm', 'Child was peaceful and relaxed', 3),
  ('mood', 'Focused', 'focused', 'Child was attentive and concentrated', 4),
  ('mood', 'Tired', 'tired', 'Child seemed sleepy or low energy', 5),
  ('mood', 'Upset', 'upset', 'Child was sad or distressed', 6),
  ('mood', 'Frustrated', 'frustrated', 'Child was having difficulty with tasks', 7),
  
  -- Activity types
  ('activity_type', 'Circle Time', 'circle_time', 'Group discussion and sharing time', 1),
  ('activity_type', 'Art & Craft', 'art_craft', 'Creative activities with various materials', 2),
  ('activity_type', 'Story Time', 'story_time', 'Reading books and storytelling', 3),
  ('activity_type', 'Music & Movement', 'music_movement', 'Singing, dancing, and rhythm activities', 4),
  ('activity_type', 'Outdoor Play', 'outdoor_play', 'Physical activities in playground or garden', 5),
  ('activity_type', 'Science Exploration', 'science_exploration', 'Hands-on experiments and discovery', 6),
  ('activity_type', 'Dramatic Play', 'dramatic_play', 'Role-playing and imaginative activities', 7),
  ('activity_type', 'Building & Construction', 'building_construction', 'Block play and building activities', 8),
  ('activity_type', 'Sensory Play', 'sensory_play', 'Activities involving touch, smell, and texture', 9),
  ('activity_type', 'Math Activities', 'math_activities', 'Counting, sorting, and pattern recognition', 10),
  ('activity_type', 'Snack Time', 'snack_time', 'Eating and nutrition education', 11),
  ('activity_type', 'Rest Time', 'rest_time', 'Quiet time and napping', 12),
  
  -- Skill tags
  ('skill_tag', 'Fine Motor Skills', 'fine_motor', 'Small muscle movements and dexterity', 1),
  ('skill_tag', 'Gross Motor Skills', 'gross_motor', 'Large muscle movements and coordination', 2),
  ('skill_tag', 'Language Development', 'language_development', 'Speaking, listening, and vocabulary', 3),
  ('skill_tag', 'Social Skills', 'social_skills', 'Interaction and cooperation with others', 4),
  ('skill_tag', 'Emotional Regulation', 'emotional_regulation', 'Managing feelings and behavior', 5),
  ('skill_tag', 'Creativity', 'creativity', 'Artistic expression and imagination', 6),
  ('skill_tag', 'Problem Solving', 'problem_solving', 'Critical thinking and reasoning', 7),
  ('skill_tag', 'Independence', 'independence', 'Self-help and autonomous activities', 8),
  ('skill_tag', 'Following Instructions', 'following_instructions', 'Listening and task completion', 9),
  ('skill_tag', 'Sharing & Turn-taking', 'sharing_turn_taking', 'Cooperative play and patience', 10),
  ('skill_tag', 'Pre-literacy', 'pre_literacy', 'Letter recognition and early reading', 11),
  ('skill_tag', 'Pre-math', 'pre_math', 'Number concepts and mathematical thinking', 12),
  
  -- Worksheet types
  ('worksheet_type', 'Coloring', 'coloring', 'Color recognition and fine motor practice', 1),
  ('worksheet_type', 'Tracing', 'tracing', 'Pre-writing skills and hand control', 2),
  ('worksheet_type', 'Matching', 'matching', 'Visual discrimination and categorization', 3),
  ('worksheet_type', 'Counting', 'counting', 'Number recognition and quantity concepts', 4),
  ('worksheet_type', 'Letter Recognition', 'letter_recognition', 'Alphabet identification and sounds', 5),
  ('worksheet_type', 'Patterns', 'patterns', 'Sequence recognition and completion', 6),
  ('worksheet_type', 'Shapes', 'shapes', 'Geometric shape identification', 7),
  ('worksheet_type', 'Cutting Practice', 'cutting_practice', 'Scissor skills and hand coordination', 8)
ON CONFLICT (category, value) DO NOTHING;

-- Insert sample daily logs
INSERT INTO daily_logs (child_id, teacher_id, log_date, activity_type, mood, description, skill_tags, duration_minutes, notes) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE, 'art_craft', 'happy', 'Emma created a beautiful butterfly painting using watercolors. She showed great attention to detail and was very proud of her work.', ARRAY['creativity', 'fine_motor'], 45, 'Emma is developing excellent artistic skills'),
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE, 'circle_time', 'excited', 'Emma participated actively in morning circle time. She shared about her weekend trip to the zoo and listened well to others.', ARRAY['language_development', 'social_skills'], 20, 'Great participation today'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', CURRENT_DATE, 'outdoor_play', 'happy', 'Liam enjoyed playing on the swings and slides. He practiced climbing and showed good balance.', ARRAY['gross_motor', 'independence'], 30, 'Liam is becoming more confident on playground equipment'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', CURRENT_DATE, 'story_time', 'focused', 'Sofia listened attentively to "The Very Hungry Caterpillar" and answered questions about the story.', ARRAY['language_development', 'following_instructions'], 25, 'Sofia has excellent comprehension skills'),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE, 'building_construction', 'excited', 'Oliver built an impressive tower with blocks and explained his design to the class.', ARRAY['problem_solving', 'creativity', 'language_development'], 35, 'Oliver shows strong engineering thinking'),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', CURRENT_DATE, 'music_movement', 'happy', 'Maya danced enthusiastically to the music and helped lead the group in singing.', ARRAY['gross_motor', 'social_skills', 'creativity'], 20, 'Maya is a natural performer')
ON CONFLICT DO NOTHING;

-- Insert sample photos
INSERT INTO photos (child_id, teacher_id, image_url, caption, activity_type, photo_date, album_name) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Emma working on her butterfly painting', 'art_craft', CURRENT_DATE, 'Art Projects'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Liam enjoying outdoor playtime', 'outdoor_play', CURRENT_DATE, 'Playground Fun'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'https://images.pexels.com/photos/1181343/pexels-photo-1181343.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Sofia during story time', 'story_time', CURRENT_DATE, 'Learning Activities'),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'https://images.pexels.com/photos/1181344/pexels-photo-1181344.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Oliver\'s amazing block tower', 'building_construction', CURRENT_DATE, 'Building Projects'),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', 'https://images.pexels.com/photos/1181342/pexels-photo-1181342.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', 'Maya leading the dance', 'music_movement', CURRENT_DATE, 'Music & Movement')
ON CONFLICT DO NOTHING;

-- Insert sample worksheets
INSERT INTO worksheets (child_id, teacher_id, title, description, worksheet_type, skill_areas, completion_status, score, max_score, due_date) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Letter A Tracing', 'Practice writing the letter A in uppercase and lowercase', 'tracing', ARRAY['pre_literacy', 'fine_motor'], 'completed', 8, 10, CURRENT_DATE + INTERVAL '3 days'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'Counting to 5', 'Count objects and circle the correct number', 'counting', ARRAY['pre_math'], 'in_progress', NULL, 10, CURRENT_DATE + INTERVAL '2 days'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'Shape Matching', 'Match shapes with their names', 'matching', ARRAY['pre_math', 'problem_solving'], 'completed', 9, 10, CURRENT_DATE + INTERVAL '1 day'),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Color Patterns', 'Complete the color pattern sequence', 'patterns', ARRAY['problem_solving', 'creativity'], 'assigned', NULL, 10, CURRENT_DATE + INTERVAL '4 days')
ON CONFLICT DO NOTHING;

-- Insert sample attendance records
INSERT INTO attendance (child_id, attendance_date, check_in_time, check_out_time, checked_in_by, status) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2 hours', NULL, '550e8400-e29b-41d4-a716-446655440003', 'present'),
  ('770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '1.5 hours', NULL, '550e8400-e29b-41d4-a716-446655440006', 'present'),
  ('770e8400-e29b-41d4-a716-446655440003', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '1 hour', NULL, '550e8400-e29b-41d4-a716-446655440008', 'late'),
  ('770e8400-e29b-41d4-a716-446655440004', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2.5 hours', NULL, '550e8400-e29b-41d4-a716-446655440003', 'present'),
  ('770e8400-e29b-41d4-a716-446655440005', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '1.8 hours', NULL, '550e8400-e29b-41d4-a716-446655440006', 'present')
ON CONFLICT (child_id, attendance_date) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (sender_id, recipient_id, child_id, subject, content, message_type) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Emma\'s Great Day!', 'Emma had a wonderful day today! She was very engaged in our art activity and created a beautiful butterfly painting. She also participated well in circle time and shared about her weekend. Keep up the great work at home!', 'general'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Thank you!', 'Thank you so much for the update! Emma was so excited to tell me about her painting when I picked her up. We\'re so grateful for all the care and attention you give the children.', 'general'),
  ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'Liam\'s Progress', 'Liam is making great progress with his social skills. He shared toys nicely today and helped a friend who was upset. His confidence on the playground equipment is also growing!', 'general'),
  ('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', 'Field Trip Reminder', 'Just a reminder that we have our zoo field trip next Friday. Please make sure Sofia has comfortable walking shoes and a water bottle. We\'re all very excited!', 'reminder')
ON CONFLICT DO NOTHING;