/*
  # Fix curriculum assignments RLS policies

  1. RLS Policies
    - Allow admins to create curriculum assignments
    - Allow teachers to read assignments for their classes
    - Allow all authenticated users to read active assignments
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage curriculum assignments" ON curriculum_assignments;
DROP POLICY IF EXISTS "Teachers can read assignments for their classes" ON curriculum_assignments;

-- Create comprehensive RLS policies for curriculum_assignments
CREATE POLICY "Admins can manage curriculum assignments"
  ON curriculum_assignments
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

CREATE POLICY "Teachers can read assignments for their classes"
  ON curriculum_assignments
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND (
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
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
      )
    )
  );

-- Ensure curriculum_assignments table has RLS enabled
ALTER TABLE curriculum_assignments ENABLE ROW LEVEL SECURITY;