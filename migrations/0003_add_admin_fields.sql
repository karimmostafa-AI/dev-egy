-- Add role field to users table
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer';

-- Add image field to categories table
ALTER TABLE categories ADD COLUMN image TEXT;

-- Create index for role field for better performance
CREATE INDEX idx_users_role ON users(role);

-- Update any existing admin users (if needed)
-- UPDATE users SET role = 'admin' WHERE email = 'admin@devegypt.com';