'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

const REASONS = [
  { value: 'prohibited_item', label: 'Prohibited or illegal item' },
  { value: 'fraud',           label: 'Suspected fraud or scam' },
  { value: 'fake_listing',    label: 'Fake or misleading listing' },
  { value: 'spam',            label: 'Spam or irrelevant content' },
  { value: 'harassment',      label: 'Harassment or threatening behavior' },
  { value: 'other',           label: 'Other' },
] as const;

interface Props {
  reportedListingId?: string;
  reportedUserId?: string;
  label?: string;
}

export default function ReportModal({ reportedListingId, reportedUserId, label = 'Report' }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function handleOpen() {
    if (!session) { router.push('/login'); return; }
    setOpen(true);
    setDone(false);
    setError('');
    setReason('');
    setDescription('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason || !session) return;
    setLoading(true);
    setError('');
    try {
      await apiClient(session.accessToken).post('/reports', {
        reportedListingId,
        reportedUserId,
        reason,
        description: description.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-xs text-muted hover:text-fg transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>
        </svg>
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-fg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            {done ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gold-muted border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl text-gold-ink font-bold">✓</div>
                <h2 className="text-lg font-bold text-fg mb-2">Report submitted</h2>
                <p className="text-muted text-sm mb-4">
                  Thank you. Our team will review this report within 48 hours. If there is an immediate safety concern, contact UW Campus Police at <strong className="text-fg">(519) 888-4567 x22222</strong>.
                </p>
                <button onClick={() => setOpen(false)} className="text-sm text-gold-ink hover:text-gold font-medium transition-colors">Close</button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-fg mb-1">Submit a report</h2>
                <p className="text-muted text-sm mb-5">
                  Reports are reviewed by our team. For emergencies, call UW Campus Police at <strong className="text-fg">(519) 888-4567 x22222</strong>.
                </p>

                {error && (
                  <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-2 rounded-lg mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-fg/70 mb-1.5">Reason</label>
                    <select
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg"
                    >
                      <option value="">Select a reason</option>
                      {REASONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg/70 mb-1.5">Additional details <span className="text-muted font-normal">(optional)</span></label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue..."
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted resize-none"
                    />
                    <p className="text-xs text-muted mt-1 text-right">{description.length}/500</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !reason}
                    className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading ? 'Submitting...' : 'Submit report'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
