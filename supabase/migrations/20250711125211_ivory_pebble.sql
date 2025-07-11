/*
  # Add sample teacher data and curriculum assignments

  1. Sample Data
    - Add sample teacher users
    - Create class assignments for teachers
    - Add curriculum assignments to classes
    - Create sample curriculum executions

  2. Security
    - Ensure proper RLS policies are in place
*/

-- Insert sample teacher users (if they don't exist)
INSERT INTO users (
  email,
  full_name,
  role,
  phone,
  is_active
) VALUES
(
  'teacher1@example.com',
  'Ms. Sarah Johnson',
  'teacher',
  '+1-555-0101',
  true
),
(
  'teacher2@example.com',
  'Ms. Emily Davis',
  'teacher',
  '+1-555-0102',
  true
),
(
  'teacher3@example.com',
  'Mr. Michael Wilson',
  'teacher',
  '+1-555-0103',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Get teacher and class IDs for assignments
DO $$
DECLARE
  teacher1_id uuid;
  teacher2_id uuid;
  teacher3_id uuid;
  sunflower_class_id uuid;
  rainbow_class_id uuid;
  butterfly_class_id uuid;
  math_curriculum_id uuid;
  language_curriculum_id uuid;
  science_curriculum_id uuid;
BEGIN
  -- Get teacher IDs
  SELECT id INTO teacher1_id FROM users WHERE email = 'teacher1@example.com';
  SELECT id INTO teacher2_id FROM users WHERE email = 'teacher2@example.com';
  SELECT id INTO teacher3_id FROM users WHERE email = 'teacher3@example.com';
  
  -- Get class IDs (assuming these exist from previous migrations)
  SELECT id INTO sunflower_class_id FROM classes WHERE name = 'Sunflower Class' LIMIT 1;
  SELECT id INTO rainbow_class_id FROM classes WHERE name = 'Rainbow Class' LIMIT 1;
  SELECT id INTO butterfly_class_id FROM classes WHERE name = 'Butterfly Class' LIMIT 1;
  
  -- Get curriculum IDs
  SELECT id INTO math_curriculum_id FROM curriculum_templates WHERE name = 'Early Mathematics Foundation';
  SELECT id INTO language_curriculum_id FROM curriculum_templates WHERE name = 'Language Arts Explorer';
  SELECT id INTO science_curriculum_id FROM curriculum_templates WHERE name = 'Science Discovery';

  -- Create class assignments for teachers
  INSERT INTO class_assignments (
    teacher_id,
    class_id,
    is_primary
  ) VALUES
  (teacher1_id, sunflower_class_id, true),
  (teacher2_id, rainbow_class_id, true),
  (teacher3_id, butterfly_class_id, true)
  ON CONFLICT (teacher_id, class_id) DO NOTHING;

  -- Assign curriculum to classes
  INSERT INTO curriculum_assignments (
    curriculum_id,
    class_id,
    assigned_by,
    start_date,
    is_active
  ) VALUES
  (math_curriculum_id, sunflower_class_id, teacher1_id, CURRENT_DATE, true),
  (language_curriculum_id, sunflower_class_id, teacher1_id, CURRENT_DATE, true),
  (math_curriculum_id, rainbow_class_id, teacher2_id, CURRENT_DATE, true),
  (science_curriculum_id, rainbow_class_id, teacher2_id, CURRENT_DATE, true),
  (language_curriculum_id, butterfly_class_id, teacher3_id, CURRENT_DATE, true),
  (science_curriculum_id, butterfly_class_id, teacher3_id, CURRENT_DATE, true)
  ON CONFLICT (curriculum_id, class_id, start_date) DO NOTHING;

  -- Create some sample curriculum executions for today
  INSERT INTO curriculum_executions (
    curriculum_item_id,
    class_id,
    teacher_id,
    execution_date,
    completion_status,
    student_engagement,
    notes
  )
  SELECT 
    ci.id,
    sunflower_class_id,
    teacher1_id,
    CURRENT_DATE,
    CASE 
      WHEN ci.title LIKE '%Counting%' THEN 'completed'
      WHEN ci.title LIKE '%Shape%' THEN 'in_progress'
      ELSE 'planned'
    END,
    'high',
    CASE 
      WHEN ci.title LIKE '%Counting%' THEN 'Students were very engaged with the counting blocks activity. All children participated actively.'
      WHEN ci.title LIKE '%Shape%' THEN 'Currently working on shape sorting. Some children need extra help with triangle identification.'
      ELSE NULL
    END
  FROM curriculum_items ci
  WHERE ci.curriculum_id = math_curriculum_id
    AND ci.week_number = 1
    AND ci.day_number = EXTRACT(DOW FROM CURRENT_DATE)
  ON CONFLICT (curriculum_item_id, class_id, execution_date) DO NOTHING;

END $$;