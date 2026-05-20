import bcrypt from 'bcryptjs';
import { pool } from './pool';

const LISTINGS = [
  // Textbooks
  { title: 'MATH 135 — Algebra for Honours Mathematics', category: 'textbooks', price: 35, description: 'Lightly used, a few highlights in chapters 3-5. Great condition overall. Perfect for first-year math students.' },
  { title: 'CS 246 — Object-Oriented Software Development (7th ed.)', category: 'textbooks', price: 45, description: 'No marks or highlights. Includes access code (unused). Selling because I took the course online.' },
  { title: 'ECON 101 Principles of Microeconomics', category: 'textbooks', price: 28, description: 'Some pencil notes in the margins, fully erasable. Missing the back cover sticker but content is complete.' },
  { title: 'STAT 230 Textbook + Course Notes Bundle', category: 'textbooks', price: 40, description: 'Textbook plus printed course notes from Winter 2024. Saves you $30+ compared to buying separately.' },
  // Electronics
  { title: 'Dell 27" 4K Monitor — IPS, 60Hz', category: 'electronics', price: 220, description: 'Used for two co-op terms. No dead pixels. Comes with original stand and HDMI cable. Reason for selling: upgrading to ultrawide.' },
  { title: 'Logitech MX Keys Keyboard + MX Master 3 Mouse', category: 'electronics', price: 130, description: 'Combo deal. Both in excellent condition. Less than 6 months old. Ideal for programmers and heavy typists.' },
  { title: 'iPad Pro 11" (2021) — 128GB WiFi + Apple Pencil', category: 'electronics', price: 680, description: 'Minimal use — just note-taking. Screen protector applied since day one. Selling to fund a new laptop.' },
  { title: 'Sony WH-1000XM4 Noise-Cancelling Headphones', category: 'electronics', price: 185, description: 'Works perfectly. Battery life still very strong. Comes with original case and cables. No scratches.' },
  // Furniture
  { title: 'IKEA KALLAX 4x2 Shelf Unit — White', category: 'furniture', price: 60, description: 'Solid condition. Minor scuff on one side, not visible when placed against a wall. Self-pickup from Waterloo.' },
  { title: 'Standing Desk — FlexiSpot 60" x 24"', category: 'furniture', price: 175, description: 'Electric height adjustment, dual motor. Works great. Selling because I moved to a smaller studio. Pick up in KW area.' },
  { title: 'Queen Mattress — Endy, 2 years old', category: 'furniture', price: 250, description: 'Excellent condition, barely used. Comes with mattress protector. Pickup only. Available after April 30.' },
  { title: 'Ergonomic Office Chair — Flexibod Mesh Back', category: 'furniture', price: 90, description: 'Adjustable lumbar support, armrests, and seat depth. Great for long study sessions. Some wear on armrest foam.' },
  // Clothing
  { title: 'UW Engineering Hoodie — Size L', category: 'clothing', price: 30, description: 'Official UW Engineering hoodie from the class of 2023. Worn maybe 5 times. True to size.' },
  { title: 'Canada Goose Parka — Mens Medium, Black', category: 'clothing', price: 380, description: 'Authentic, bought from the Eaton Centre store. Receipt available. Perfect for Waterloo winters. No tears or stains.' },
  // Bikes
  { title: 'Trek FX 2 Disc — Size M, 2022', category: 'bikes', price: 520, description: 'Barely 500km on the odometer. Front and rear lights included. Serviced last month. Perfect commuter bike.' },
  { title: 'Brompton M6L Folding Bike — Black', category: 'bikes', price: 900, description: 'Ideal for bus + bike commutes. Folds in under 20 seconds. Includes carry bag. Minor handlebar scuff.' },
  // Miscellaneous
  { title: 'Nikon D3500 DSLR + 18-55mm Kit Lens', category: 'miscellaneous', price: 340, description: 'Shutter count under 4,000. Includes two batteries, charger, 32GB SD card and bag. Perfect starter camera.' },
  { title: 'Keurig K-Mini Coffee Maker — Black', category: 'miscellaneous', price: 35, description: 'Works perfectly. Descaled and cleaned before selling. Great for dorm or apartment. No pods included.' },
  { title: 'Yoga Mat + Resistance Bands Set', category: 'miscellaneous', price: 22, description: 'Lightly used mat (6mm thick, non-slip) plus 5 resistance bands in varying strengths. Washed and ready to go.' },
  { title: 'Dyson V8 Cordless Vacuum', category: 'miscellaneous', price: 160, description: 'Strong suction, all attachments included. Battery holds about 25 min. Selling because I am leaving Canada after grad.' },
];

async function seed() {
  const email = 'testuser@uwaterloo.ca';
  const hash = await bcrypt.hash('Password123!', 12);

  // Upsert test user
  const { rows: userRows } = await pool.query(
    `INSERT INTO users (email, password_hash, display_name, email_verified)
     VALUES ($1, $2, 'Test User', TRUE)
     ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name
     RETURNING id`,
    [email, hash]
  );
  const sellerId = userRows[0].id;

  // Fetch category id map
  const { rows: catRows } = await pool.query('SELECT id, slug FROM categories');
  const catMap: Record<string, number> = {};
  for (const r of catRows) catMap[r.slug] = r.id;

  let created = 0;
  for (const l of LISTINGS) {
    const catId = catMap[l.category];
    if (!catId) { console.warn(`Unknown category: ${l.category}`); continue; }
    await pool.query(
      `INSERT INTO listings (seller_id, category_id, title, description, price)
       VALUES ($1, $2, $3, $4, $5)`,
      [sellerId, catId, l.title, l.description, l.price]
    );
    created++;
  }

  console.log(`Seeded ${created} listings under ${email}`);
  await pool.end();
}

seed().catch((err) => { console.error(err); process.exit(1); });
