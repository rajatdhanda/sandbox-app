/*
  # Add RLS policies for classes table

  1. Security
    - Enable RLS on classes table (if not already enabled)
    - Add policy for admins to manage all classes
    - Add policy for teachers to read classes they're assigned to
    - Add policy for all authenticated users to read active classes

  2. Policies
    - Admins can perform all operations (SELECT, INSERT, UPDATE, DELETE)
    - Teachers can read classes they're assigned to
    - All authenticated users can read active classes
*/

-- Ensure RLS is enabled on classes table
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all classes" ON classes;
DROP POLICY IF EXISTS "Teachers can read assigned classes" ON classes;
DROP POLICY IF EXISTS "All users can read active classes" ON classes;

-- Policy for admins to manage all classes
CREATE POLICY "Admins can manage all classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Policy for teachers to read classes they're assigned to
CREATE POLICY "Teachers can read assigned classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_assignments ca
      JOIN users u ON ca.teacher_id = u.id
      WHERE ca.class_id = classes.id
      AND u.id = auth.uid()
      AND u.role = 'teacher'
    )
  );

-- Policy for all authenticated users to read active classes
CREATE POLICY "All users can read active classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (is_active = true);