import { pool } from '../db/pool';

export type ReportReason = 'prohibited_item' | 'fraud' | 'spam' | 'harassment' | 'fake_listing' | 'other';

interface CreateReportInput {
  reporterId: string;
  reportedListingId?: string;
  reportedUserId?: string;
  reason: ReportReason;
  description?: string;
}

export async function createReport(data: CreateReportInput): Promise<void> {
  await pool.query(
    `INSERT INTO reports (reporter_id, reported_listing_id, reported_user_id, reason, description)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      data.reporterId,
      data.reportedListingId ?? null,
      data.reportedUserId ?? null,
      data.reason,
      data.description ?? null,
    ]
  );
}

export async function hasRecentReport(reporterId: string, reportedListingId?: string, reportedUserId?: string): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 FROM reports
     WHERE reporter_id = $1
       AND (reported_listing_id = $2 OR reported_user_id = $3)
       AND created_at > NOW() - INTERVAL '24 hours'
     LIMIT 1`,
    [reporterId, reportedListingId ?? null, reportedUserId ?? null]
  );
  return rows.length > 0;
}
