/*
  # Add admin insert policy for users table

  1. Security Changes
    - Add INSERT policy for users table to allow admins to create new users
    - This resolves the RLS violation when admins try to create new user accounts

  2. Policy Details
    - Policy name: "Admins can insert users"
    - Allows users with admin role to insert new records into users table
    - Uses the same role check pattern as existing admin policies
*/

-- Add INSERT policy for admins to create users
CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    current_setting('request.jwt.claim.role'::text, true) = 'admin'::text
  );