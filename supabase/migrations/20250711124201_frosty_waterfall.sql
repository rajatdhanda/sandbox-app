/*
  # Add comprehensive sample curriculum data

  1. Sample Data
    - Time slots for daily scheduling
    - Curriculum templates with hierarchical structure
    - Curriculum items with sub-sections
    - Sample assignments to classes

  2. Features
    - Mathematics with Building Blocks and Jodo Gyan sub-sections
    - Language Arts with Story Time and Phonics
    - Science with Nature Exploration
    - Weekly and daily planning structure
*/

-- Insert time slots
INSERT INTO time_slots (name, start_time, end_time, duration_minutes, sort_order) VALUES
('Morning Circle', '09:00', '09:30', 30, 1),
('Learning Activities', '09:30', '10:30', 60, 2),
('Snack Time', '10:30', '10:45', 15, 3),
('Outdoor Play', '10:45', '11:45', 60, 4),
('Creative Time', '11:45', '12:30', 45, 5),
('Lunch', '12:30', '13:15', 45, 6),
('Quiet Time', '13:15', '14:00', 45, 7),
('Afternoon Activities', '14:00', '15:00', 60, 8),
('Story Time', '15:00', '15:30', 30, 9),
('Free Play', '15:30', '16:00', 30, 10),
('Cleanup & Departure', '16:00', '16:30', 30, 11)
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive curriculum templates
INSERT INTO curriculum_templates (
  name, 
  description, 
  age_group, 
  subject_area, 
  total_weeks, 
  learning_objectives, 
  materials_list,
  is_active
) VALUES
(
  'Early Mathematics Foundation',
  'Comprehensive mathematics curriculum focusing on number recognition, counting, shapes, and patterns through hands-on activities',
  '3-4 years',
  'Mathematics',
  8,
  ARRAY[
    'Count from 1 to 20 with understanding',
    'Recognize and name basic shapes',
    'Create and extend simple patterns',
    'Compare quantities using more/less',
    'Understand basic spatial concepts'
  ],
  ARRAY[
    'Wooden counting blocks',
    'Shape sorting toys',
    'Pattern cards',
    'Number charts',
    'Jodo Gyan manipulatives',
    'Measuring tools'
  ],
  true
),
(
  'Language Arts Explorer',
  'Building foundation for reading and writing through phonics, vocabulary, and storytelling',
  '3-4 years',
  'Language Arts',
  8,
  ARRAY[
    'Recognize letter sounds A-Z',
    'Build vocabulary through stories',
    'Develop listening skills',
    'Express ideas verbally',
    'Understand story sequence'
  ],
  ARRAY[
    'Picture books',
    'Letter cards',
    'Phonics games',
    'Story props',
    'Writing materials'
  ],
  true
),
(
  'Science Discovery',
  'Exploring the natural world through observation, experimentation, and discovery',
  '3-4 years',
  'Science',
  6,
  ARRAY[
    'Observe weather patterns',
    'Identify living vs non-living',
    'Understand plant growth',
    'Explore simple machines',
    'Practice scientific thinking'
  ],
  ARRAY[
    'Magnifying glasses',
    'Weather chart',
    'Plant seeds',
    'Simple tools',
    'Observation journals'
  ],
  true
)
ON CONFLICT (name) DO NOTHING;

-- Get curriculum template IDs for inserting items
DO $$
DECLARE
  math_curriculum_id uuid;
  language_curriculum_id uuid;
  science_curriculum_id uuid;
  morning_circle_id uuid;
  learning_activities_id uuid;
  creative_time_id uuid;
  outdoor_play_id uuid;
  story_time_id uuid;
BEGIN
  -- Get curriculum IDs
  SELECT id INTO math_curriculum_id FROM curriculum_templates WHERE name = 'Early Mathematics Foundation';
  SELECT id INTO language_curriculum_id FROM curriculum_templates WHERE name = 'Language Arts Explorer';
  SELECT id INTO science_curriculum_id FROM curriculum_templates WHERE name = 'Science Discovery';
  
  -- Get time slot IDs
  SELECT id INTO morning_circle_id FROM time_slots WHERE name = 'Morning Circle';
  SELECT id INTO learning_activities_id FROM time_slots WHERE name = 'Learning Activities';
  SELECT id INTO creative_time_id FROM time_slots WHERE name = 'Creative Time';
  SELECT id INTO outdoor_play_id FROM time_slots WHERE name = 'Outdoor Play';
  SELECT id INTO story_time_id FROM time_slots WHERE name = 'Story Time';

  -- Insert Mathematics curriculum items with sub-sections
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
    skills_developed,
    preparation_notes
  ) VALUES
  -- Week 1 - Building Blocks Sub-section
  (
    math_curriculum_id,
    'Counting with Building Blocks',
    'Children will use colorful wooden blocks to practice counting from 1 to 10, building towers and counting each block as they add it.',
    'Building Blocks',
    ARRAY['Wooden counting blocks', 'Counting mat', 'Number cards 1-10'],
    ARRAY['Count objects 1-10', 'One-to-one correspondence', 'Number recognition'],
    1, 1, morning_circle_id, 30,
    ARRAY['Number sense', 'Fine motor skills', 'Hand-eye coordination'],
    'Prepare blocks in sets of 10, have counting mat ready'
  ),
  (
    math_curriculum_id,
    'Shape Sorting with Blocks',
    'Sort different shaped blocks by color and shape, discussing properties of each shape.',
    'Building Blocks',
    ARRAY['Shape blocks', 'Sorting trays', 'Shape cards'],
    ARRAY['Identify basic shapes', 'Sort by attributes', 'Describe shape properties'],
    1, 2, learning_activities_id, 45,
    ARRAY['Shape recognition', 'Classification skills', 'Vocabulary development'],
    'Set up sorting stations with clear labels'
  ),
  
  -- Week 1 - Jodo Gyan Sub-section
  (
    math_curriculum_id,
    'Pattern Making with Jodo Gyan',
    'Create simple AB patterns using Jodo Gyan colorful manipulatives, extending and creating new patterns.',
    'Jodo Gyan',
    ARRAY['Jodo Gyan blocks', 'Pattern cards', 'Pattern strips'],
    ARRAY['Recognize patterns', 'Create AB patterns', 'Extend patterns'],
    1, 3, learning_activities_id, 40,
    ARRAY['Pattern recognition', 'Logical thinking', 'Sequencing'],
    'Prepare pattern examples and blank strips for children'
  ),
  (
    math_curriculum_id,
    'Number Building with Jodo Gyan',
    'Use Jodo Gyan blocks to build numbers 1-5, understanding quantity representation.',
    'Jodo Gyan',
    ARRAY['Jodo Gyan number blocks', 'Number mats', 'Counting bears'],
    ARRAY['Build numbers 1-5', 'Understand quantity', 'Number formation'],
    1, 4, morning_circle_id, 35,
    ARRAY['Number sense', 'Quantity understanding', 'Fine motor skills'],
    'Have number mats 1-5 ready for each child'
  ),

  -- Week 2 - Advanced Building Blocks
  (
    math_curriculum_id,
    'Tower Comparison',
    'Build towers of different heights and compare using vocabulary: tall, taller, tallest, short, shorter, shortest.',
    'Building Blocks',
    ARRAY['Various sized blocks', 'Measuring tape', 'Height chart'],
    ARRAY['Compare heights', 'Use measurement vocabulary', 'Understand relative size'],
    2, 1, learning_activities_id, 40,
    ARRAY['Measurement concepts', 'Comparative thinking', 'Spatial reasoning'],
    'Prepare blocks of various sizes and measuring tools'
  ),
  (
    math_curriculum_id,
    'Bridge Building Challenge',
    'Work in pairs to build bridges using blocks, discussing stability and balance.',
    'Building Blocks',
    ARRAY['Large blocks', 'Small cars', 'Bridge examples'],
    ARRAY['Understand balance', 'Problem solving', 'Collaborative work'],
    2, 3, learning_activities_id, 50,
    ARRAY['Engineering thinking', 'Collaboration', 'Problem solving'],
    'Show bridge examples and have toy cars ready for testing'
  );

  -- Insert Language Arts curriculum items
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
    skills_developed,
    preparation_notes
  ) VALUES
  -- Story Time Sub-section
  (
    language_curriculum_id,
    'Interactive Story Reading',
    'Read picture books with interactive elements, asking questions and encouraging participation.',
    'Story Time',
    ARRAY['Picture books', 'Story props', 'Comfortable seating'],
    ARRAY['Listen actively', 'Vocabulary building', 'Story comprehension'],
    1, 1, story_time_id, 30,
    ARRAY['Listening skills', 'Language development', 'Imagination'],
    'Select engaging books with clear pictures and simple text'
  ),
  (
    language_curriculum_id,
    'Story Retelling with Props',
    'Children retell familiar stories using props and puppets, developing narrative skills.',
    'Story Time',
    ARRAY['Story puppets', 'Props box', 'Simple costumes'],
    ARRAY['Retell stories', 'Sequence events', 'Express ideas'],
    1, 3, creative_time_id, 35,
    ARRAY['Narrative skills', 'Memory', 'Creative expression'],
    'Prepare prop boxes for popular stories'
  ),
  
  -- Phonics Sub-section
  (
    language_curriculum_id,
    'Letter Sound Games',
    'Introduction to letter sounds A-E through games, songs, and activities.',
    'Phonics',
    ARRAY['Letter cards', 'Sound games', 'Musical instruments'],
    ARRAY['Recognize letter sounds', 'Phonemic awareness', 'Letter-sound connection'],
    1, 2, learning_activities_id, 35,
    ARRAY['Phonics skills', 'Pre-reading', 'Auditory processing'],
    'Have letter cards A-E and sound props ready'
  ),
  (
    language_curriculum_id,
    'Rhyming Fun',
    'Explore rhyming words through songs, games, and picture matching activities.',
    'Phonics',
    ARRAY['Rhyming cards', 'Musical recordings', 'Picture books'],
    ARRAY['Identify rhymes', 'Create rhyming words', 'Sound awareness'],
    2, 1, morning_circle_id, 25,
    ARRAY['Phonological awareness', 'Language play', 'Memory'],
    'Prepare rhyming card sets and familiar nursery rhymes'
  );

  -- Insert Science curriculum items
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
    skills_developed,
    preparation_notes
  ) VALUES
  (
    science_curriculum_id,
    'Weather Observation',
    'Daily weather observation and recording, discussing weather patterns and seasonal changes.',
    'Nature Exploration',
    ARRAY['Weather chart', 'Thermometer', 'Weather symbols'],
    ARRAY['Observe weather', 'Record observations', 'Understand patterns'],
    1, 1, morning_circle_id, 25,
    ARRAY['Observation skills', 'Scientific thinking', 'Data recording'],
    'Set up weather station with chart and symbols'
  ),
  (
    science_curriculum_id,
    'Plant Growth Experiment',
    'Plant seeds and observe growth over time, recording changes in observation journals.',
    'Nature Exploration',
    ARRAY['Seeds', 'Small pots', 'Soil', 'Watering can', 'Observation journals'],
    ARRAY['Understand plant needs', 'Observe changes', 'Record growth'],
    1, 2, learning_activities_id, 45,
    ARRAY['Scientific method', 'Observation', 'Responsibility'],
    'Prepare planting materials and set up observation area'
  );

END $$;