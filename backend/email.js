const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
  console.log(`\n[EMAIL] Verification link for ${email}: ${url}\n`);
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_xxxxxxxxxxxx') return { data: null, error: null };

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [email],
    subject: 'Verify your email — ShopHub',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p><p>Or paste: ${url}</p>`,
  });

  if (error) console.error('[RESEND] Verification email error:', error);
  return { data, error };
};

const sendResetEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  console.log(`\n[EMAIL] Reset link for ${email}: ${url}\n`);
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_xxxxxxxxxxxx') return { data: null, error: null };

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [email],
    subject: 'Reset your password — ShopHub',
    html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });

  if (error) console.error('[RESEND] Reset email error:', error);
  return { data, error };
};

module.exports = { sendVerificationEmail, sendResetEmail };
