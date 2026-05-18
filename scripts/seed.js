require('dotenv').config({ path: '.env.local' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

// To run this script: node scripts/seed.js

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables. Please check your .env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SAMPLE_CLIENTS = [
  {
    id: 'c-1042',
    name_full: 'רחל פרידמן',
    phone_number: '052-481-3370',
    date_of_birth: '1978-05-15',
    date_joining: '2022-09-12',
    status: 'active',
    general_notes: 'מועדפת שיחות בבוקר. ההורים מבוגרים — אולי הזדמנות לפוליסת סיעוד. הזכירה שהבת הצעירה מסיימת צבא בקיץ.',
    products: [
      { id: 'p-7001', category: 'בריאות',      company: 'הראל',           date_start: '2022-09-22', premium_monthly: 612 },
      { id: 'p-7002', category: 'פנסיה',        company: 'מגדל',           date_start: '2023-01-05', premium_monthly: 1850 },
      { id: 'p-7003', category: 'חיים/משכנתא',  company: 'כלל',            date_start: '2024-03-18', premium_monthly: 318 },
    ],
  },
  {
    id: 'c-0993',
    name_full: 'דניאל כהן',
    phone_number: '054-720-1188',
    date_of_birth: '1983-11-04',
    date_joining: '2023-05-15',
    status: 'active',
    general_notes: 'עצמאי, רואה חשבון. שיחה אחרונה דנה בהגדלת ההפקדה לקופ"ג. רוצה לבחון השקעות אלטרנטיביות.',
    products: [
      { id: 'p-7010', category: 'בריאות',   company: 'הפניקס',        date_start: '2023-05-20', premium_monthly: 845 },
      { id: 'p-7011', category: 'פנסיה',    company: 'אלטשולר שחם',   date_start: '2023-05-20', premium_monthly: 2980 },
      { id: 'p-7012', category: 'השקעות',   company: 'מיטב דש',       date_start: '2024-08-02', premium_monthly: 1500 },
      { id: 'p-7013', category: 'חיים/משכנתא', company: 'מגדל',       date_start: '2024-11-30', premium_monthly: 412 },
    ],
  },
  {
    id: 'c-1118',
    name_full: 'מיכל לוי',
    phone_number: '050-339-4421',
    date_of_birth: '1990-02-22',
    date_joining: '2025-05-15',
    status: 'active',
    general_notes: 'עברה דירה בינואר. נדרשת התאמה לפוליסת תכולה. בעל חדש בעבודה מ-2026.',
    products: [
      { id: 'p-7020', category: 'בריאות', company: 'הראל', date_start: '2025-05-20', premium_monthly: 540 },
      { id: 'p-7021', category: 'חיים/משכנתא', company: 'מנורה מבטחים', date_start: '2025-06-01', premium_monthly: 290 },
    ],
  },
  {
    id: 'c-0871',
    name_full: 'יוסי אברהם',
    phone_number: '053-612-9087',
    date_of_birth: '1971-08-09',
    date_joining: '2021-11-22',
    status: 'needs',
    general_notes: 'דורש מעקב — תביעה פתוחה מול הראל מינואר. ביקש לחזור אליו בסוף השבוע. בן 55, חושב לפרוש מוקדם.',
    products: [
      { id: 'p-7030', category: 'פנסיה',  company: 'מגדל',       date_start: '2021-12-01', premium_monthly: 3420 },
      { id: 'p-7031', category: 'השקעות', company: 'אלטשולר שחם', date_start: '2022-04-15', premium_monthly: 2100 },
      { id: 'p-7032', category: 'בריאות', company: 'הראל',       date_start: '2021-12-01', premium_monthly: 980 },
    ],
  },
  {
    id: 'c-1201',
    name_full: 'עומר שטרן',
    phone_number: '058-204-7715',
    date_of_birth: '1995-07-30',
    date_joining: '2024-11-08',
    status: 'inactive',
    general_notes: 'הקפיא פעילות בנובמבר. לבדוק חזרה אחרי חופשת הקיץ.',
    products: [
      { id: 'p-7040', category: 'השקעות', company: 'מיטב דש', date_start: '2024-11-15', premium_monthly: 750 },
    ],
  },
];

async function seed() {
  // נתחבר עם המשתמש שיצרת כדי לעקוף את חסימת האבטחה (RLS)
  const email = 'avihuyoyo@gmail.com';
  // אם שמת סיסמה אחרת כשנרשמת ב-Supabase, תשנה אותה פה זמנית רק בשביל ה-seed:
  const password = 'avihuyoyo@gmail.com'; 
  
  console.log(`Logging in as ${email}...`);
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("Login failed! Please update the password in scripts/seed.js");
    console.error(authError.message);
    process.exit(1);
  }

  console.log('Successfully logged in!');
  console.log("Starting database seed...");

  for (const clientData of SAMPLE_CLIENTS) {
    const { products, ...clientInfo } = clientData;

    // Insert client
    const { data: insertedClient, error: clientError } = await supabase
      .from('clients')
      .upsert(clientInfo)
      .select()
      .single();

    if (clientError) {
      console.error(`Error inserting client ${clientInfo.name_full}:`, clientError.message);
      continue;
    }

    console.log(`Inserted client: ${insertedClient.name_full}`);

    // Insert products
    if (products && products.length > 0) {
      const productsWithClientId = products.map((p) => ({
        ...p,
        client_id: insertedClient.id,
      }));

      const { error: productsError } = await supabase
        .from('products')
        .upsert(productsWithClientId);

      if (productsError) {
        console.error(`Error inserting products for ${clientInfo.name_full}:`, productsError.message);
      } else {
        console.log(`Inserted ${products.length} products for ${clientInfo.name_full}`);
      }
    }
  }

  console.log("Seeding complete!");
}

seed();
