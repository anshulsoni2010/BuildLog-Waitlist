import nodemailer from 'nodemailer';

if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD || !process.env.EMAIL_FROM) {
  throw new Error('Email configuration missing in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your BuildLog waitlist signup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181B; color: #FAFAFA; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FAFAFA; margin: 0;">BuildLog</h1>
          <p style="color: #A1A1AA; margin: 10px 0;">Thank you for joining our waitlist!</p>
        </div>
        
        <div style="background-color: #27272A; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 20px 0;">Please verify your email address to complete your waitlist signup. Click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationLink}" 
               style="display: inline-block; background-color: #FAFAFA; color: #18181B; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Verify Email Address
            </a>
          </div>
        </div>

        <p style="color: #A1A1AA; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="color: #A1A1AA; font-size: 14px; word-break: break-all;">${verificationLink}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272A; text-align: center;">
          <p style="color: #A1A1AA; font-size: 14px; margin: 5px 0;">
            This link will expire in 24 hours.<br>
            If you didn't sign up for BuildLog, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
