CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE listing_status AS ENUM ('active', 'sold', 'deleted');

-- Users

CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  display_name      TEXT NOT NULL,
  avatar_url        TEXT,
  email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  verify_token      TEXT,
  verify_token_exp  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Refresh tokens

CREATE TABLE refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories

CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  slug  TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL
);

INSERT INTO categories (slug, label) VALUES
  ('textbooks',   'Textbooks'),
  ('electronics', 'Electronics'),
  ('furniture',   'Furniture'),
  ('clothing',    'Clothing'),
  ('bikes',       'Bikes & Scooters'),
  ('subletting',  'Subletting'),
  ('other',       'Other');

-- Listings

CREATE TABLE listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   INT  NOT NULL REFERENCES categories(id),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  status        listing_status NOT NULL DEFAULT 'active',
  search_vector TSVECTOR GENERATED ALWAYS AS (
                  to_tsvector('english', title || ' ' || description)
                ) STORED,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Listing images

CREATE TABLE listing_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  cloudinary_id TEXT NOT NULL,
  url           TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversations

CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (listing_id, buyer_id)
);

-- Messages

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
