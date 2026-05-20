-- Microsoft SSO: password is no longer required
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- SSO users are verified by Microsoft; mark them verified by default
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT TRUE;

-- Store Microsoft's object ID for deduplication
ALTER TABLE users ADD COLUMN IF NOT EXISTS microsoft_id TEXT UNIQUE;
