const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || 'ShopHub <noreply@yourdomain.com>';

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your email — ShopHub',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p><p>Or paste: ${url}</p>`,
  });
};

const sendResetEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your password — ShopHub',
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p><p>Or paste: ${url}</p>`,
  });
};

module.exports = { sendVerificationEmail, sendResetEmail };
