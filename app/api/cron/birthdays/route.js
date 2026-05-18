import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use service role key if available for server-side queries (bypasses RLS)
// Falls back to anon key which still works with proper policies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  // Verify the request comes from our cron job (not a random user)
  const authHeader = request.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate();

  // Fetch clients whose birthday month and day match today
  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, name_full, date_of_birth, phone_number')
    .not('date_of_birth', 'is', null);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // Filter in JS to match month and day (ignoring year)
  const birthdayClients = (clients || []).filter((c) => {
    if (!c.date_of_birth) return false;
    const dob = new Date(c.date_of_birth);
    return dob.getMonth() + 1 === month && dob.getDate() === day;
  });

  if (birthdayClients.length === 0) {
    return NextResponse.json({ message: 'No birthdays today 🎂' });
  }

  // Build HTML email
  const todayStr = today.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const clientRows = birthdayClients
    .map((c) => {
      const birthYear = new Date(c.date_of_birth).getFullYear();
      const age = today.getFullYear() - birthYear;
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;font-size:15px;font-weight:600;">
            🎂 ${c.name_full}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;font-size:14px;color:#555;">
            בן/בת ${age} | ${c.phone_number || 'ללא טלפון'}
          </td>
        </tr>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 36px;">
              <div style="font-size:13px;color:#a0aec0;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;">Avihu CRM</div>
              <div style="font-size:26px;font-weight:700;color:#fff;">🎂 ימי הולדת היום</div>
              <div style="font-size:14px;color:#a0aec0;margin-top:6px;">${todayStr}</div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:28px 36px 8px;">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                שלום אביהו,<br/>
                היום חוגגים יום הולדת <strong>${birthdayClients.length}</strong> מהלקוחות שלך.
                זו הזדמנות מצוינת לברך אותם ולחזק את הקשר האישי 💙
              </p>
            </td>
          </tr>

          <!-- Clients table -->
          <tr>
            <td style="padding:16px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #eee;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:10px 16px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;letter-spacing:0.05em;">שם הלקוח</th>
                    <th style="padding:10px 16px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;letter-spacing:0.05em;">גיל / טלפון</th>
                  </tr>
                </thead>
                <tbody>${clientRows}</tbody>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 36px 36px;">
              <p style="margin:0 0 16px;font-size:13px;color:#6b7280;">
                מומלץ לשלוח הודעת ברכה קצרה — לקוח שמרגיש שזוכרים אותו, נשאר לקוח לחיים.
              </p>
              <a href="http://localhost:3000/clients" style="display:inline-block;background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                פתח את מסך הלקוחות ←
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:16px 36px;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                Avihu CRM · מייל אוטומטי נשלח בכל בוקר ב-08:00
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { error: sendError } = await resend.emails.send({
    from: 'Avihu CRM <onboarding@resend.dev>',
    to: 'avihuyoyo@gmail.com',
    subject: `🎂 ${birthdayClients.length} ימי הולדת היום — ${todayStr}`,
    html,
  });

  if (sendError) {
    console.error('Resend error:', sendError);
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }

  return NextResponse.json({
    message: `Email sent! ${birthdayClients.length} birthdays today.`,
    clients: birthdayClients.map((c) => c.name_full),
  });
}
