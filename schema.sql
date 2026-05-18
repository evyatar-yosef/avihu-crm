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

-- Add owner_id columns (idempotent for existing installs)
ALTER TABLE clients  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE clients  ALTER COLUMN owner_id SET DEFAULT auth.uid();
ALTER TABLE products ALTER COLUMN owner_id SET DEFAULT auth.uid();

-- After backfilling existing rows with the correct owner_id, enforce NOT NULL:
-- UPDATE clients  SET owner_id = '<your-auth-user-uuid>' WHERE owner_id IS NULL;
-- UPDATE products SET owner_id = '<your-auth-user-uuid>' WHERE owner_id IS NULL;
-- ALTER TABLE clients  ALTER COLUMN owner_id SET NOT NULL;
-- ALTER TABLE products ALTER COLUMN owner_id SET NOT NULL;

-- Enable Row-Level Security
ALTER TABLE clients  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Clients: owner can read/write only their own rows
DROP POLICY IF EXISTS clients_owner_select ON clients;
DROP POLICY IF EXISTS clients_owner_insert ON clients;
DROP POLICY IF EXISTS clients_owner_update ON clients;
DROP POLICY IF EXISTS clients_owner_delete ON clients;

CREATE POLICY clients_owner_select ON clients
  FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY clients_owner_insert ON clients
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY clients_owner_update ON clients
  FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY clients_owner_delete ON clients
  FOR DELETE USING (owner_id = auth.uid());

-- Products: same model
DROP POLICY IF EXISTS products_owner_select ON products;
DROP POLICY IF EXISTS products_owner_insert ON products;
DROP POLICY IF EXISTS products_owner_update ON products;
DROP POLICY IF EXISTS products_owner_delete ON products;

CREATE POLICY products_owner_select ON products
  FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY products_owner_insert ON products
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY products_owner_update ON products
  FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY products_owner_delete ON products
  FOR DELETE USING (owner_id = auth.uid());
