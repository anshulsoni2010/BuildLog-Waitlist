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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #09090B; color: #FAFAFA; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="BuildLog Logo" style="width: 120px; margin-bottom: 15px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/banner.png" alt="BuildLog Preview" style="width: 100%; max-width: 500px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #FAFAFA; margin: 0;">You are in Early Access Waitlist</h1>
          <h3 style="color: #71717A; margin: 10px 0;">Thank you for joining waitlist! I’ll keep you updated on new features and let you know when you’ll be able to access BuildLog. Right now, I'm still working on the app and expect it to be ready very soon. Your support means a lot to me, and I can't wait to share BuildLog with you. Stay tuned for something amazing!</h3>
          <div style="margin-top: 20px;">
            <p style="color: #71717A; margin: 10px 0;">Meanwhile, let's connect!</p>
            <a href="https://twitter.com/Anshulsoni2010" 
               style="display: inline-flex; align-items: center; background-color: #18181B; color: #FAFAFA; padding: 10px 20px; text-decoration: none; border-radius: 6px; border: 1px solid #27272A;">
              <svg style="width: 16px; height: 16px; margin-right: 8px;" viewBox="0 0 24 24" fill="#FAFAFA">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Follow Anshul (Mind Behind BuildLog)
            </a>
          </div>
        </div>
        
        <div style="background-color: #18181B; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 20px 0;">Please verify your email address to complete your waitlist signup. Click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationLink}" 
               style="display: inline-block; background-color: #FAFAFA; color: #09090B; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Verify Email Address
            </a>
          </div>
        </div>

        <p style="color: #71717A; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="color: #71717A; font-size: 14px; word-break: break-all;">${verificationLink}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272A; text-align: center;">
          <p style="color: #71717A; font-size: 14px; margin: 5px 0;">
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
