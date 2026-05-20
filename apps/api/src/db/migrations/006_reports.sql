CREATE TYPE report_reason AS ENUM (
  'prohibited_item',
  'fraud',
  'spam',
  'harassment',
  'fake_listing',
  'other'
);

CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');

CREATE TABLE reports (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id          UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_listing_id  UUID         REFERENCES listings(id) ON DELETE SET NULL,
  reported_user_id     UUID         REFERENCES users(id) ON DELETE SET NULL,
  reason               report_reason NOT NULL,
  description          TEXT,
  status               report_status NOT NULL DEFAULT 'pending',
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_report_target CHECK (
    reported_listing_id IS NOT NULL OR reported_user_id IS NOT NULL
  )
);

CREATE INDEX reports_status_idx        ON reports(status);
CREATE INDEX reports_reporter_idx      ON reports(reporter_id);
CREATE INDEX reports_listing_idx       ON reports(reported_listing_id);
CREATE INDEX reports_reported_user_idx ON reports(reported_user_id);
