import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — UW Marketplace',
  description: 'PIPEDA-compliant Privacy Policy for UW Marketplace.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">Legal</span>
        <h1 className="text-4xl font-bold text-fg mt-2 mb-3">Privacy Policy</h1>
        <p className="text-muted text-sm">Effective date: May 2025 · Last updated: May 2025</p>
        <div className="mt-4 bg-gold-muted border border-gold/20 rounded-xl px-4 py-3">
          <p className="text-xs text-gold-ink font-semibold mb-1">PIPEDA Compliance</p>
          <p className="text-xs text-fg/60">
            This policy is drafted in accordance with Canada's <em>Personal Information Protection and Electronic
            Documents Act</em> (PIPEDA), S.C. 2000, c. 5, and the Office of the Privacy Commissioner of Canada's
            guidelines.
          </p>
        </div>
      </div>

      <div className="space-y-10 text-sm text-fg/70 leading-relaxed">

        <Section title="1. Who We Are">
          <p>
            UW Marketplace ("<strong className="text-fg">we</strong>," "<strong className="text-fg">us</strong>") is
            an independent peer-to-peer classifieds platform for University of Waterloo students. We are the
            organization responsible for personal information collected through this platform.
          </p>
          <p className="mt-3">
            Privacy Officer:{' '}
            <a href="mailto:privacy@uwmarketplace.ca" className="text-gold-ink hover:underline">
              privacy@uwmarketplace.ca
            </a>
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect only what is necessary to operate the Platform ("<strong className="text-fg">principle of limited collection</strong>" under PIPEDA Schedule 1, Clause 4.4).</p>
          <div className="mt-4 space-y-4">
            <InfoBlock title="Account information">
              University of Waterloo email address, display name, and hashed password. Email is required solely to
              verify UW enrollment.
            </InfoBlock>
            <InfoBlock title="Listing content">
              Titles, descriptions, prices, category selections, and photographs you upload for listings.
            </InfoBlock>
            <InfoBlock title="Messages">
              Content of messages exchanged between users through the Platform's messaging feature.
            </InfoBlock>
            <InfoBlock title="Technical data">
              IP addresses and timestamps associated with account creation, login events, and listing activity,
              retained for security and abuse prevention.
            </InfoBlock>
            <InfoBlock title="Uploaded images">
              Photographs uploaded to listings, stored via Cloudinary (see Section 5).
            </InfoBlock>
          </div>
          <p className="mt-4">
            We do not collect payment information. All payments are arranged directly between users.
          </p>
        </Section>

        <Section title="3. Why We Collect It (Purpose & Consent)">
          <p>
            Under PIPEDA Clause 4.3, we collect personal information only for purposes a reasonable person would
            consider appropriate in the circumstances:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-fg">Account verification</strong> — to confirm you are a current UW community member.</li>
            <li><strong className="text-fg">Platform operation</strong> — to display listings, enable messaging, and deliver core features.</li>
            <li><strong className="text-fg">Safety &amp; moderation</strong> — to investigate reports, enforce our Terms of Service, and prevent abuse.</li>
            <li><strong className="text-fg">Technical maintenance</strong> — to diagnose errors and maintain service availability.</li>
          </ul>
          <p className="mt-3">
            By creating an account you consent to collection for these purposes. You may withdraw consent at any time
            by deleting your account (see Section 8).
          </p>
        </Section>

        <Section title="4. How We Use Your Information">
          <p>We use collected information only for the purposes described in Section 3. We do not:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Sell your personal information to third parties.</li>
            <li>Use your information for advertising or marketing.</li>
            <li>Profile you for automated decision-making.</li>
            <li>Use your email address for newsletters without explicit opt-in.</li>
          </ul>
        </Section>

        <Section title="5. Information Sharing & Third Parties">
          <p>We share personal information only in the following limited circumstances:</p>
          <div className="mt-3 space-y-3">
            <InfoBlock title="Resend (email delivery)">
              We use Resend to send transactional emails (account verification, password reset). Resend processes
              your email address on our behalf under a data processing agreement. Resend's privacy policy is available
              at resend.com/privacy.
            </InfoBlock>
            <InfoBlock title="Cloudinary (image hosting)">
              Uploaded listing images are stored on Cloudinary's CDN. Images are publicly accessible via URL once
              uploaded. Cloudinary's privacy policy is available at cloudinary.com/privacy.
            </InfoBlock>
            <InfoBlock title="Legal requirements">
              We may disclose information to law enforcement or regulators when required by law, court order, or to
              protect the safety of users or the public.
            </InfoBlock>
          </div>
          <p className="mt-3">
            No other disclosure is made without your prior written consent.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            Under PIPEDA Clause 4.5, we retain personal information only as long as necessary for the identified purposes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-fg">Active accounts</strong> — retained for as long as your account remains open.</li>
            <li><strong className="text-fg">Deleted accounts</strong> — personal identifiers are anonymized within 30 days. Listing content may be retained in anonymized form for up to 90 days.</li>
            <li><strong className="text-fg">Security logs</strong> (IP, timestamps) — retained for 90 days, then deleted.</li>
            <li><strong className="text-fg">Reports</strong> — retained for 12 months to support moderation decisions, then deleted.</li>
          </ul>
        </Section>

        <Section title="7. Security Safeguards">
          <p>
            Under PIPEDA Clause 4.7, we implement reasonable technical and organizational safeguards:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Passwords are hashed using bcrypt with a cost factor of ≥12.</li>
            <li>All data in transit is encrypted via TLS 1.2+.</li>
            <li>Access to production data is restricted to authorized personnel only.</li>
            <li>JWT tokens are short-lived; refresh tokens are stored securely.</li>
          </ul>
          <p className="mt-3">
            No security system is impenetrable. In the event of a breach affecting your personal information, we will
            notify affected users and report to the Office of the Privacy Commissioner as required by the PIPEDA
            breach-reporting regulations (SOR/2018-64).
          </p>
        </Section>

        <Section title="8. Your Rights Under PIPEDA">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-fg">Access</strong> — request a copy of the personal information we hold about you.</li>
            <li><strong className="text-fg">Correction</strong> — request correction of inaccurate or incomplete information.</li>
            <li><strong className="text-fg">Withdrawal of consent</strong> — delete your account at any time; this will trigger anonymization per Section 6.</li>
            <li><strong className="text-fg">Complaint</strong> — file a complaint with the Office of the Privacy Commissioner of Canada at <a href="https://www.priv.gc.ca" className="text-gold-ink hover:underline" target="_blank" rel="noopener noreferrer">priv.gc.ca</a> if you believe we have violated PIPEDA.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact our Privacy Officer at{' '}
            <a href="mailto:privacy@uwmarketplace.ca" className="text-gold-ink hover:underline">
              privacy@uwmarketplace.ca
            </a>{' '}
            with subject line "Privacy Request." We will respond within 30 days.
          </p>
        </Section>

        <Section title="9. Cookies & Local Storage">
          <p>
            We use <strong className="text-fg">localStorage</strong> (browser storage) to remember your theme
            preference (light/dark mode) and whether you have dismissed safety banners. No cookies are used for
            tracking or advertising purposes. Our authentication uses server-side JWT tokens; no session cookies
            are placed on third-party domains.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            The Platform is not intended for persons under the age of 18. We do not knowingly collect personal
            information from minors. If you believe a minor has registered, please contact us immediately.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this policy at any time. Material changes will be reflected in the effective date above and,
            where practicable, communicated to registered users by email. Continued use of the Platform after the
            revised policy is posted constitutes acceptance.
          </p>
        </Section>

        <Section title="12. Contact & Privacy Officer">
          <p>
            For any privacy-related questions, requests, or complaints:
          </p>
          <div className="mt-3 bg-surface border border-border rounded-xl p-4 space-y-1">
            <p><strong className="text-fg">UW Marketplace — Privacy Officer</strong></p>
            <p>Email: <a href="mailto:privacy@uwmarketplace.ca" className="text-gold-ink hover:underline">privacy@uwmarketplace.ca</a></p>
            <p>Response time: within 30 calendar days</p>
          </div>
          <p className="mt-3">
            If you are not satisfied with our response, you may escalate to the{' '}
            <a href="https://www.priv.gc.ca/en/report-a-concern/" className="text-gold-ink hover:underline" target="_blank" rel="noopener noreferrer">
              Office of the Privacy Commissioner of Canada
            </a>.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-fg mb-3">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <p className="font-semibold text-fg text-xs uppercase tracking-wide mb-1">{title}</p>
      <p className="text-sm text-fg/70 leading-relaxed">{children}</p>
    </div>
  );
}
