/*
  # Fix admin role assignment and INSERT policy

  1. Updates
    - Set the role for admin2@example.com to 'admin' in the users table
    - Add proper INSERT policy for admins to create users

  2. Security
    - Ensures admin users can insert new user records
    - Maintains existing RLS policies
*/

-- Update the admin user's role in the users table
UPDATE users 
SET role = 'admin', updated_at = now()
WHERE email = 'admin2@example.com';

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Admins can insert users" ON users;

-- Create proper INSERT policy for admins
CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );