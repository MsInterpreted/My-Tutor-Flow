const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'My Tutor Flow <hello@mytutorflow.com>'
const APP_URL = 'https://mytutorflow.com'

const MARKER_LABELS = {
  phonics_vowels:               'Vowel Sound Discrimination',
  phonics_blends:               'Consonant Blends',
  phonics_spelling:             'Spelling Rules',
  phonics_syllables:            'Syllable Awareness',
  phonics_morphology:           'Prefixes, Suffixes & Word Roots',
  language_parts_of_speech:    'Parts of Speech',
  language_grammar:             'Grammar & Agreement',
  language_sentence_structure:  'Sentence Structure',
  language_vocabulary:          'Vocabulary & Word Choice',
  comprehension_literal:        'Literal Recall',
  comprehension_inference:      'Inference & Reading Between the Lines',
  comprehension_vocabulary_context: 'Vocabulary in Context',
  comprehension_main_idea:      'Main Idea & Summarising',
  comprehension_critical:       'Critical Analysis',
}

function scoreColour(pct) {
  if (pct >= 80) return { bg: '#f0fdf4', border: '#86efac', text: '#15803d', label: 'Excellent' }
  if (pct >= 55) return { bg: '#fffbeb', border: '#fcd34d', text: '#b45309', label: 'Good' }
  return { bg: '#fef2f2', border: '#fca5a5', text: '#b91c1c', label: 'Needs Support' }
}

function buildEmail({ name, level, score, weakMarkers, strongMarkers }) {
  const pct = Math.round((score.correct / score.total) * 100)
  const colours = scoreColour(pct)
  const displayName = name || 'there'

  const strengthRows = strongMarkers.map(m =>
    `<tr><td style="padding:6px 0;font-size:14px;color:#166534;">
      <span style="color:#22c55e;margin-right:8px;">✓</span>${MARKER_LABELS[m] || m}
    </td></tr>`
  ).join('')

  const weakRows = weakMarkers.map(m =>
    `<tr><td style="padding:6px 0;font-size:14px;color:#991b1b;">
      <span style="color:#ef4444;margin-right:8px;">⚠</span>${MARKER_LABELS[m] || m}
    </td></tr>`
  ).join('')

  const focusNote = weakMarkers.length
    ? `<p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
        Based on the results, the books below are designed to close the specific gaps identified — not generic practice, targeted practice.
      </p>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4c1d95,#5b21b6,#3730a3);border-radius:16px 16px 0 0;padding:32px 32px 24px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#c4b5fd;">MY TUTOR FLOW</p>
          <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;">Assessment Results</h1>
          <p style="margin:8px 0 0;font-size:14px;color:#ddd6fe;">${level} Level &middot; ${score.correct} of ${score.total} correct</p>
        </td></tr>

        <!-- Score hero -->
        <tr><td style="background:#ffffff;padding:32px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:${colours.bg};border:2px solid ${colours.border};border-radius:12px;padding:24px;text-align:center;">
              <p style="margin:0;font-size:52px;font-weight:900;color:#5b21b6;line-height:1;">${pct}%</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${colours.text};">${colours.label}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Breakdown -->
        <tr><td style="background:#ffffff;padding:24px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:12px;">
            <tr>
              ${strongMarkers.length ? `
              <td style="vertical-align:top;width:50%;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#15803d;">Strengths</p>
                <table cellpadding="0" cellspacing="0">${strengthRows}</table>
              </td>` : ''}
              ${weakMarkers.length ? `
              <td style="vertical-align:top;width:50%;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#b91c1c;">Needs Focus</p>
                <table cellpadding="0" cellspacing="0">${weakRows}</table>
              </td>` : ''}
            </tr>
          </table>
        </td></tr>

        <!-- CTA -->
        ${weakMarkers.length ? `
        <tr><td style="background:#ffffff;padding:24px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:linear-gradient(135deg,#5b21b6,#4338ca);border-radius:12px;padding:24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c4b5fd;">Targeted Practice Available</p>
              <h2 style="margin:0 0 12px;font-size:18px;font-weight:900;color:#ffffff;">Close these gaps with the right books</h2>
              ${focusNote}
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="padding-top:8px;">
                  <a href="${APP_URL}/pricing"
                    style="display:inline-block;background:#ffffff;color:#4c1d95;font-weight:800;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;">
                    Unlock All Books — from R179/month →
                  </a>
                </td></tr>
                <tr><td align="center" style="padding-top:12px;">
                  <a href="${APP_URL}/signup" style="color:#ddd6fe;font-size:13px;">
                    Create a free account to save this report
                  </a>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>` : `
        <tr><td style="background:#ffffff;padding:24px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:linear-gradient(135deg,#d97706,#b45309);border-radius:12px;padding:24px;text-align:center;">
              <p style="margin:0 0 8px;font-size:32px;">🏆</p>
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#ffffff;">Perfect Score!</h2>
              <p style="margin:0 0 16px;font-size:14px;color:#fef3c7;">Ready for the next challenge?</p>
              <a href="${APP_URL}/assess" style="display:inline-block;background:#ffffff;color:#92400e;font-weight:800;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
                Try the Next Level →
              </a>
            </td></tr>
          </table>
        </td></tr>`}

        <!-- What is PEEL teaser -->
        <tr><td style="background:#ffffff;padding:24px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#5b21b6;">Did you know?</p>
              <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
                All My Tutor Flow books are built around the <strong>P.E.E.L. method</strong> —
                Point, Evidence, Explanation, Link. It's the same writing framework used in
                top schools, taught in a way children actually understand.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#ffffff;border-radius:0 0 16px 16px;padding:24px 32px 32px;">
          <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.6;">
            You're receiving this because you completed a free assessment at
            <a href="${APP_URL}" style="color:#5b21b6;text-decoration:none;"> mytutorflow.com</a>.<br>
            Questions? Reply to this email — we read every one.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' }
  if (!RESEND_API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) }

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return { statusCode: 400, body: 'Bad JSON' } }

  const { email, name, level, score, weakMarkers = [], strongMarkers = [] } = body
  if (!email || !level || !score) return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) }

  const html = buildEmail({ name, level, score, weakMarkers, strongMarkers })
  const pct = Math.round((score.correct / score.total) * 100)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: `Your ${level} Assessment Results — ${pct}% · My Tutor Flow`,
      html,
    }),
  })

  const data = await res.json()
  if (!res.ok) return { statusCode: res.status, body: JSON.stringify(data) }
  return { statusCode: 200, body: JSON.stringify({ id: data.id }) }
}
