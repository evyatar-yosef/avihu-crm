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

-- Enable Row-Level Security
ALTER TABLE clients  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Single-tenant policies: any authenticated user has full access.
-- The anon key (exposed in the browser) is blocked from reading/writing.
DROP POLICY IF EXISTS clients_auth_all  ON clients;
DROP POLICY IF EXISTS products_auth_all ON products;

CREATE POLICY clients_auth_all  ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY products_auth_all ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
