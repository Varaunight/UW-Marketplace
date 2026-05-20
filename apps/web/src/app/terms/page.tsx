import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — UW Marketplace',
  description: 'Terms of Service for UW Marketplace, a peer-to-peer classifieds platform for University of Waterloo students.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">Legal</span>
        <h1 className="text-4xl font-bold text-fg mt-2 mb-3">Terms of Service</h1>
        <p className="text-muted text-sm">Effective date: May 2025 · Last updated: May 2025</p>
        <p className="text-sm text-fg/70 mt-4 leading-relaxed">
          Please read these Terms of Service carefully before using UW Marketplace. By creating an account or using the
          platform you agree to be bound by these terms.
        </p>
      </div>

      <div className="space-y-10 text-sm text-fg/70 leading-relaxed">

        <Section title="1. About UW Marketplace">
          <p>
            UW Marketplace ("<strong className="text-fg">we</strong>," "<strong className="text-fg">us</strong>," or
            "<strong className="text-fg">the Platform</strong>") is an online peer-to-peer classifieds service that
            allows University of Waterloo students to post and discover listings for the sale of second-hand goods.
          </p>
          <p className="mt-3 font-semibold text-fg">
            UW Marketplace is a facilitator only. We are not a party to any transaction between buyers and sellers.
            We do not buy, sell, hold, or guarantee any item listed on the Platform.
          </p>
          <p className="mt-3">
            UW Marketplace is not affiliated with or endorsed by the University of Waterloo.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must hold a valid <strong className="text-fg">@uwaterloo.ca</strong> email address to register. By
            creating an account you represent that:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You are currently enrolled at or employed by the University of Waterloo.</li>
            <li>You are at least 18 years of age, or have parental/guardian consent.</li>
            <li>You have the legal capacity to enter into a binding agreement.</li>
            <li>Your use of the Platform will comply with all applicable laws.</li>
          </ul>
          <p className="mt-3">
            We reserve the right to suspend or terminate any account that does not meet these requirements.
          </p>
        </Section>

        <Section title="3. Account Registration & Verification">
          <p>
            You must verify your @uwaterloo.ca email address before you can post listings or send messages. You are
            responsible for maintaining the confidentiality of your account credentials. You must notify us immediately
            at <strong className="text-fg">admin@uwmarketplace.ca</strong> if you believe your account has been
            compromised.
          </p>
        </Section>

        <Section title="4. The Platform's Role">
          <p>
            We provide infrastructure for users to connect. We do not:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Inspect, verify, or guarantee the accuracy of any listing.</li>
            <li>Verify that sellers have the right to sell listed items.</li>
            <li>Handle, inspect, or take custody of any physical goods.</li>
            <li>Process, hold, or facilitate the transfer of money between users.</li>
            <li>Provide insurance or warranty of any kind for any transaction.</li>
          </ul>
          <p className="mt-3">
            All transactions are conducted directly between buyers and sellers. You transact entirely at your own risk.
          </p>
        </Section>

        <Section title="5. Prohibited Items & Activities">
          <p>You agree not to list, sell, trade, or facilitate the exchange of any prohibited item. Prohibited items include but are not limited to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Weapons, firearms, ammunition, or dangerous devices.</li>
            <li>Illegal drugs, prescription medications not prescribed to you, or alcohol sold without a licence.</li>
            <li>Counterfeit, stolen, or fraudulently obtained goods.</li>
            <li>Content that infringes intellectual property rights.</li>
            <li>Academic dishonesty services (ghostwriting, assignment completion, etc.).</li>
            <li>Live animals.</li>
            <li>Gambling items or services.</li>
            <li>Any item or service whose sale is prohibited by Ontario or Canadian federal law.</li>
          </ul>
          <p className="mt-3">
            A full list is available on our <a href="/safety#prohibited" className="text-gold-ink hover:underline">Safety &amp; Prohibited Items page</a>.
            Violations may result in immediate account suspension and may be reported to law enforcement.
          </p>
        </Section>

        <Section title="6. User Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Post false, misleading, or fraudulent listings.</li>
            <li>Harass, threaten, or abuse other users.</li>
            <li>Attempt to circumvent security measures or scrape the Platform.</li>
            <li>Use the Platform for any commercial or business purpose beyond personal peer-to-peer sales.</li>
            <li>Share login credentials or allow others to access your account.</li>
          </ul>
        </Section>

        <Section title="7. Content & Intellectual Property">
          <p>
            You retain ownership of content you post (listing descriptions, photos). By posting content you grant UW
            Marketplace a non-exclusive, royalty-free licence to display that content on the Platform for as long as
            your listing is active. You represent that you have the right to post the content you submit.
          </p>
          <p className="mt-3">
            The UW Marketplace name, logo, and user interface are the property of UW Marketplace and may not be
            reproduced without written permission.
          </p>
        </Section>

        <Section title="8. Reporting & Moderation">
          <p>
            We accept reports of listings or users that violate these Terms. Reports are reviewed within 48 hours on a
            best-efforts basis. We reserve the right to remove any content or suspend any account at our sole
            discretion. We are not obligated to act on any specific report or to notify a reported user of any action
            taken.
          </p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
            INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT
            WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, UW MARKETPLACE AND ITS OPERATORS SHALL NOT BE LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION
            WITH YOUR USE OF THE PLATFORM OR ANY TRANSACTION CONDUCTED THROUGH IT, EVEN IF ADVISED OF THE POSSIBILITY
            OF SUCH DAMAGES.
          </p>
          <p className="mt-3">
            Our total aggregate liability to you for any claim shall not exceed CAD $0, as we provide the Platform free
            of charge.
          </p>
        </Section>

        <Section title="11. Indemnification">
          <p>
            You agree to indemnify and hold harmless UW Marketplace and its operators from any claims, losses, damages,
            or expenses (including legal fees) arising from your use of the Platform, your violation of these Terms, or
            any transaction you enter into through the Platform.
          </p>
        </Section>

        <Section title="12. Governing Law & Dispute Resolution">
          <p>
            These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable
            therein, without regard to conflict-of-law principles. Any dispute shall be resolved in the courts of
            Ontario, and you consent to the exclusive jurisdiction of those courts.
          </p>
        </Section>

        <Section title="13. Changes to These Terms">
          <p>
            We may update these Terms at any time. If we make material changes, we will update the effective date
            above and may notify registered users by email. Continued use of the Platform after changes take effect
            constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            Questions about these Terms? Email us at{' '}
            <a href="mailto:admin@uwmarketplace.ca" className="text-gold-ink hover:underline">
              admin@uwmarketplace.ca
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
