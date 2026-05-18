-- clients table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name_full TEXT NOT NULL,
  phone_number TEXT,
  date_of_birth DATE,
  date_joining DATE,
  status TEXT DEFAULT 'active',
  general_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  company TEXT NOT NULL,
  date_start DATE,
  premium_monthly NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Note: No RLS policies needed since there's only one user and we don't enable RLS on these tables
