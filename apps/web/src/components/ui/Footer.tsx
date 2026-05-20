import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface dark:bg-transparent border-t border-border mt-auto shadow-[0_-1px_0_0_var(--theme-border)] dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="font-bold text-fg mb-3">
              <span className="text-gold-ink">UW</span> Marketplace
            </p>
            <p className="text-xs text-muted leading-relaxed">
              A peer-to-peer marketplace for University of Waterloo students.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Marketplace</p>
            <ul className="space-y-2">
              <li><Link href="/listings" className="text-sm text-fg/70 hover:text-fg transition-colors">Browse Listings</Link></li>
              <li><Link href="/listings/new" className="text-sm text-fg/70 hover:text-fg transition-colors">Sell an Item</Link></li>
              <li><Link href="/messages" className="text-sm text-fg/70 hover:text-fg transition-colors">Messages</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Safety</p>
            <ul className="space-y-2">
              <li><Link href="/safety" className="text-sm text-fg/70 hover:text-fg transition-colors">Safety Guidelines</Link></li>
              <li><Link href="/safety#prohibited" className="text-sm text-fg/70 hover:text-fg transition-colors">Prohibited Items</Link></li>
              <li><Link href="/safety#meetups" className="text-sm text-fg/70 hover:text-fg transition-colors">Safe Meetup Spots</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-fg/70 hover:text-fg transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-fg/70 hover:text-fg transition-colors">Privacy Policy</Link></li>
              <li>
                <a href="mailto:admin@uwmarketplace.ca" className="text-sm text-fg/70 hover:text-fg transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {year} UW Marketplace. Not affiliated with the University of Waterloo.
          </p>
          <p className="text-xs text-muted">
            UW Marketplace is a facilitator only and is not a party to any transaction.
          </p>
        </div>
      </div>
    </footer>
  );
}
