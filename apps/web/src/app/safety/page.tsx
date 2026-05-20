import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety Guidelines — UW Marketplace',
  description: 'Stay safe when buying and selling on UW Marketplace. Campus meetup spots, prohibited items, and safety tips.',
};

const MEETUP_SPOTS = [
  {
    name: 'Student Life Centre (SLC)',
    address: '200 University Ave W',
    notes: 'Main student hub — always busy, security desk on site.',
  },
  {
    name: 'Davis Centre (DC) Lobby',
    address: 'Ring Road',
    notes: '24-hour access building; well-lit and monitored.',
  },
  {
    name: 'Dana Porter (DP) Library Entrance',
    address: 'Arts Quad',
    notes: 'High foot traffic during school hours.',
  },
  {
    name: 'MC (Math & Computer) Lobby',
    address: 'Ring Road',
    notes: 'Busy during class hours; camera coverage.',
  },
  {
    name: 'Tim Hortons — SLC',
    address: 'Student Life Centre, main floor',
    notes: 'Constant foot traffic; public and open.',
  },
  {
    name: 'E5 / E6 Engineering Lobby',
    address: 'Engineering Quad',
    notes: 'Staffed during business hours; security cameras.',
  },
  {
    name: 'Campus Centre (CC) Lobby',
    address: 'Columbia St W at University Ave',
    notes: 'Accessible from multiple directions; visible location.',
  },
  {
    name: 'Waterloo Public Library',
    address: '35 Albert St (off-campus)',
    notes: 'Public space with staff and security cameras.',
  },
];

const PROHIBITED = [
  {
    category: 'Weapons & Dangerous Items',
    items: [
      'Firearms, ammunition, or firearm components',
      'Knives with blades longer than 6 cm',
      'Tasers, pepper spray, or other weapons',
      'Explosives, fireworks, or flammable materials',
    ],
  },
  {
    category: 'Controlled Substances',
    items: [
      'Illegal drugs or drug paraphernalia',
      'Prescription medications not prescribed to the seller',
      'Alcohol (sales by unlicensed individuals are illegal in Ontario)',
      'Tobacco or vaping products (sale to persons under 19 is prohibited)',
    ],
  },
  {
    category: 'Illegal or Stolen Goods',
    items: [
      'Stolen property of any kind',
      'Counterfeit goods or replicas of branded products',
      'Pirated software, media, or academic materials',
      'Items obtained through fraud or deception',
    ],
  },
  {
    category: 'Restricted Services & Content',
    items: [
      'Academic dishonesty services (essays, assignments for hire)',
      'Gambling or lottery tickets',
      'Adult or explicit content',
      'Personal financial information or identity documents',
    ],
  },
  {
    category: 'Animals & Living Organisms',
    items: [
      'Live animals',
      'Endangered species or protected wildlife products',
    ],
  },
  {
    category: 'Other Prohibited Items',
    items: [
      'Items subject to export controls or sanctions',
      'Any item whose sale is illegal under Ontario or Canadian federal law',
    ],
  },
];

export default function SafetyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">Your safety matters</span>
        <h1 className="text-4xl font-bold text-fg mt-2 mb-4">Safety Guidelines</h1>
        <p className="text-fg/70 leading-relaxed">
          UW Marketplace is built exclusively for University of Waterloo students. While we verify all accounts with{' '}
          <strong className="text-fg">@uwaterloo.ca</strong> emails, you should still take precautions during every transaction.
          If you ever feel unsafe, call{' '}
          <strong className="text-fg">UW Campus Police at (519) 888-4567 x22222</strong>.
        </p>
      </div>

      {/* General tips */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-fg mb-4">General Safety Tips</h2>
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
          {[
            'Meet in busy, public locations on or near campus — see the list below.',
            'Meet during daylight hours whenever possible.',
            'Bring a friend or let someone know where you\'re going.',
            'Inspect items in person before handing over payment.',
            'Pay with cash or Interac e-Transfer — avoid wire transfers or gift cards.',
            'Never share your banking details, SIN, or passwords with anyone.',
            'If a deal seems too good to be true, it probably is.',
            'Trust your instincts. It is OK to cancel a transaction if something feels off.',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gold-ink">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <p className="text-sm text-fg/80 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Email verification */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-fg mb-4">UW Email Verification</h2>
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-sm text-fg/70 leading-relaxed mb-3">
            Every account on UW Marketplace must be verified with a{' '}
            <strong className="text-fg">@uwaterloo.ca</strong> email address before listing items or contacting sellers.
            This requirement significantly reduces the risk of dealing with non-students.
          </p>
          <p className="text-sm text-fg/70 leading-relaxed">
            Verification is checked on every listing and message action. If your email is not yet verified, check your
            inbox for the confirmation link we sent when you registered.
          </p>
        </div>
      </section>

      {/* Meetup spots */}
      <section id="meetups" className="mb-12">
        <h2 className="text-xl font-bold text-fg mb-2">Recommended Campus Meetup Spots</h2>
        <p className="text-sm text-muted mb-5">
          These locations are well-lit, staffed or monitored, and have high foot traffic.
        </p>
        <div className="space-y-3">
          {MEETUP_SPOTS.map((spot) => (
            <div key={spot.name} className="bg-surface border border-border rounded-xl p-4 flex gap-4 items-start">
              <div className="text-xl shrink-0">📍</div>
              <div>
                <p className="font-semibold text-fg text-sm">{spot.name}</p>
                <p className="text-xs text-muted mt-0.5">{spot.address}</p>
                <p className="text-xs text-fg/60 mt-1">{spot.notes}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gold-muted border border-gold/20 rounded-xl px-4 py-3">
          <p className="text-xs text-gold-ink font-semibold mb-1">UW Campus Police</p>
          <p className="text-xs text-fg/60">
            For emergencies on campus: <strong className="text-fg">(519) 888-4567 x22222</strong> — available 24/7.
          </p>
        </div>
      </section>

      {/* Prohibited items */}
      <section id="prohibited" className="mb-12">
        <h2 className="text-xl font-bold text-fg mb-2">Prohibited Items</h2>
        <p className="text-sm text-muted mb-5">
          The following items are not permitted on UW Marketplace. Listings found in violation will be removed and the
          account may be banned. Some violations may be reported to authorities.
        </p>
        <div className="space-y-4">
          {PROHIBITED.map((group) => (
            <div key={group.category} className="bg-surface border border-border rounded-xl p-5">
              <h3 className="font-semibold text-fg text-sm mb-3 flex items-center gap-2">
                <span className="text-red-500">⚠</span>
                {group.category}
              </h3>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-fg/70">
                    <span className="text-muted shrink-0 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Report section */}
      <section className="mb-4">
        <h2 className="text-xl font-bold text-fg mb-4">See Something? Report It.</h2>
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-sm text-fg/70 leading-relaxed mb-4">
            Every listing and user profile has a{' '}
            <strong className="text-fg">Report</strong> button. Use it if you encounter suspicious activity,
            prohibited items, or harmful behaviour. Reports are reviewed within 48 hours.
          </p>
          <p className="text-sm text-fg/70 leading-relaxed">
            For immediate safety concerns, do not wait for a review — contact UW Campus Police or call 911.
          </p>
        </div>
      </section>

      <div className="flex gap-4 mt-8 text-sm">
        <Link href="/terms" className="text-gold-ink hover:text-gold transition-colors">Terms of Service</Link>
        <span className="text-border">|</span>
        <Link href="/privacy" className="text-gold-ink hover:text-gold transition-colors">Privacy Policy</Link>
      </div>
    </div>
  );
}
