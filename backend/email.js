const nodemailer = require('nodemailer');

const FROM = process.env.SMTP_FROM || 'ShopHub <harishgb3805@gmail.com>';

const getTransport = () => {
  if (!process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'harishgb3805@gmail.com',
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
  console.log(`\n[EMAIL] Verification link for ${email}: ${url}\n`);
  const transport = getTransport();
  if (!transport) return { data: null, error: null };
  try {
    const info = await transport.sendMail({
      from: FROM,
      to: email,
      subject: 'Verify your email — ShopHub',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p><p>Or paste: ${url}</p>`,
    });
    return { data: info, error: null };
  } catch (error) {
    console.error('[EMAIL] Verification email error:', error.message);
    return { data: null, error };
  }
};

const sendResetEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  console.log(`\n[EMAIL] Reset link for ${email}: ${url}\n`);
  const transport = getTransport();
  if (!transport) return { data: null, error: null };
  try {
    const info = await transport.sendMail({
      from: FROM,
      to: email,
      subject: 'Reset your password — ShopHub',
      html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
    return { data: info, error: null };
  } catch (error) {
    console.error('[EMAIL] Reset email error:', error.message);
    return { data: null, error };
  }
};

module.exports = { sendVerificationEmail, sendResetEmail };
