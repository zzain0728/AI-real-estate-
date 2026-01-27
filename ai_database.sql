
-- RENTAL APPLICATION AND OFFER AUTOMATION PLATFORM - DATABASE SCHEMA
-- Users table represents: CLIENTS/TENANTS and we extend it to match specific data for each

DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS agent_notes CASCADE;
DROP TABLE IF EXISTS agent_clients CASCADE;
DROP TABLE IF EXISTS ai_analysis CASCADE;
DROP TABLE IF EXISTS tenant_properties CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;
-- 1. USERS TABLE 
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  phone_country_code TEXT,
  phone_location TEXT,
  searches_price_min NUMERIC,
  searches_price_max NUMERIC,
  agent_id BIGINT,
  agent_fullname TEXT,
  last_login_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  signedup_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  status_value INTEGER,
  has_viewing_request INTEGER,
  validation_required INTEGER,
  text_validated INTEGER,
  is_phone_valid INTEGER,
  is_email_valid INTEGER,
  has_mobile_app INTEGER,
  is_realtor BOOLEAN,
  subscribe_preconstruction BOOLEAN,
  subscribe_alerts BOOLEAN,
  subscribe_newsletters BOOLEAN,
  roles JSONB,
  sites JSONB,
  localities JSONB,
  sublocalities JSONB,
  credit_score INTEGER,
  income NUMERIC,
  marital_status TEXT,
  child1_birthday TEXT,
  child2_birthday TEXT,
  child3_birthday TEXT,
  date_of_birth TEXT,
  location_of_interest TEXT,
  home_address TEXT,
  home_city TEXT,
  home_province TEXT,
  time_zone TEXT,
  number_of_times_called INTEGER NOT NULL DEFAULT 0,
  last_call_date TEXT,
  taken_on_showings BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_agent_id ON users(agent_id);

-- 2. AGENTS TABLE
CREATE TABLE agents (

  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  reco_license_number TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  referral_url TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_agents_email ON agents(email);
CREATE INDEX idx_agents_reco_license ON agents(reco_license_number);


-- 3. TENANTS TABLE (Extended tenant-specific data linked to users)
CREATE TABLE tenants (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  agent_id BIGINT REFERENCES agents(id) ON DELETE SET NULL,
  referred_by_url TEXT,
  requested_move_in_date DATE,
  employer TEXT,
  bio TEXT,
  status TEXT DEFAULT 'Browsing',
  consent_document_storage BOOLEAN DEFAULT false,
  consent_ai_analysis BOOLEAN DEFAULT false,
  consent_data_sharing BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  profile_password TEXT

);
CREATE INDEX idx_tenants_user_id ON tenants(user_id);
CREATE INDEX idx_tenants_agent_id ON tenants(agent_id);
CREATE INDEX idx_tenants_status ON tenants(status);

-- 4. DOCUMENTS TABLE
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  extracted_address TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX idx_documents_type ON documents(document_type);

-- 5. PROPERTIES TABLE
CREATE TABLE properties (
  id BIGSERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  monthly_rent NUMERIC,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  property_type TEXT,
  listing_agent_name TEXT,
  listing_agent_email TEXT,
  listing_agent_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_properties_address ON properties(address);

-- 6. TENANT_PROPERTIES TABLE
CREATE TABLE tenant_properties (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Viewing Requested',
  applied_at TIMESTAMPTZ,
  status_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, property_id)
);
CREATE INDEX idx_tenant_properties_tenant_id ON tenant_properties(tenant_id);
CREATE INDEX idx_tenant_properties_property_id ON tenant_properties(property_id);
CREATE INDEX idx_tenant_properties_status ON tenant_properties(status);

-- 7. AI_ANALYSIS TABLE
CREATE TABLE ai_analysis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  credit_score_check BOOLEAN,
  income_check BOOLEAN,
  debt_check BOOLEAN,
  risk_level TEXT,
  summary TEXT,
  agent_override BOOLEAN DEFAULT false,
  agent_override_reason TEXT,
  agent_override_by BIGINT REFERENCES agents(id),
  agent_override_at TIMESTAMPTZ,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_analysis_tenant_id ON ai_analysis(tenant_id);
CREATE INDEX idx_ai_analysis_risk_level ON ai_analysis(risk_level);

-- 8. AGENT_CLIENTS TABLE
CREATE TABLE agent_clients (
  id BIGSERIAL PRIMARY KEY,
  agent_id BIGINT REFERENCES agents(id) ON DELETE CASCADE,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT false,
  payment_amount NUMERIC DEFAULT 50.00,
  payment_status TEXT,
  square_payment_id TEXT,
  square_invoice_id TEXT,
  unlocked_at TIMESTAMPTZ,
  access_expires_at TIMESTAMPTZ,

  UNIQUE(agent_id, tenant_id)
);
CREATE INDEX idx_agent_clients_agent_id ON agent_clients(agent_id);
CREATE INDEX idx_agent_clients_tenant_id ON agent_clients(tenant_id);
CREATE INDEX idx_agent_clients_unlocked ON agent_clients(is_unlocked);

-- 9. AGENT_NOTES TABLE
CREATE TABLE agent_notes (
  id BIGSERIAL PRIMARY KEY,
  agent_id BIGINT REFERENCES agents(id) ON DELETE CASCADE,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  note_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_agent_notes_agent_id ON agent_notes(agent_id);
CREATE INDEX idx_agent_notes_tenant_id ON agent_notes(tenant_id);

-- 10. OFFERS TABLE
CREATE TABLE offers (
  id BIGSERIAL PRIMARY KEY,
  agent_id BIGINT REFERENCES agents(id) ON DELETE CASCADE,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  offer_amount NUMERIC,
  lease_start_date DATE,
  lease_end_date DATE,
  template_used TEXT,
  status TEXT DEFAULT 'Draft',
  email_body TEXT,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_offers_agent_id ON offers(agent_id);
CREATE INDEX idx_offers_tenant_id ON offers(tenant_id);
CREATE INDEX idx_offers_property_id ON offers(property_id);


