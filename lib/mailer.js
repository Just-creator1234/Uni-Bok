import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Uni-Bok" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Uni-Bok email address",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Uni-Bok</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background-color: #ffffff;
            padding: 24px;
            text-align: center;
            border-bottom: 1px solid #dbeafe;
          }
          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(to right, #2563eb, #1e40af);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          .content {
            padding: 32px;
          }
          .button {
            display: inline-block;
            background-color: #e5e8ef;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 500;
            margin: 16px 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .button:hover {
            background-color: #e5e8ef;
          }
          .footer {
            text-align: center;
            padding: 24px;
            font-size: 14px;
            color: #6b7280;
            border-top: 1px solid #dbeafe;
          }
          .text-center {
            text-align: center;
          }
          .verify-text {
            font-size: 20px;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 24px;
          }
          .secondary-text {
            color: #6b7280;
            margin-bottom: 24px;
          }
          .link {
            color: #2563eb;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <span class="logo-text">Uni-Bok</span>
            </div>
          </div>
          
          <div class="content">
            <h2 class="text-center verify-text">Verify Your Email Address</h2>
            <p class="text-center secondary-text">Thank you for signing up with Uni-Bok! Please verify your email address to complete your registration and access all features.</p>
            
            <div class="text-center">
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p class="text-center secondary-text">If the button doesn't work, copy and paste this link into your browser:</p>
            <p class="text-center"><a href="${verifyUrl}" class="link">${verifyUrl}</a></p>
            
            <p class="text-center secondary-text">This verification link will expire in 24 hours.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Uni-Bok. All rights reserved.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendAdminInviteEmail(email, token) {
  const acceptUrl = `${process.env.NEXTAUTH_URL}/accept-invite/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Uni-Bok Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Admin Invitation - Uni-Bok Platform",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Invitation - Uni-Bok</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(to right, #7c3aed, #5b21b6);
            padding: 32px;
            text-align: center;
            color: white;
          }
          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: white;
          }
          .badge {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 8px;
          }
          .content {
            padding: 32px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(to right, #7c3aed, #5b21b6);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 600;
            margin: 24px 0;
            box-shadow: 0 4px 6px rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(124, 58, 237, 0.3);
          }
          .footer {
            text-align: center;
            padding: 24px;
            font-size: 14px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          .text-center {
            text-align: center;
          }
          .invite-title {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 16px;
          }
          .invite-subtitle {
            color: #6b7280;
            margin-bottom: 32px;
            font-size: 16px;
          }
          .details-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
          }
          .detail-item {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          }
          .detail-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            color: #7c3aed;
          }
          .link-box {
            background-color: #f1f5f9;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 14px;
            color: #475569;
          }
          .link {
            color: #2563eb;
            text-decoration: none;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            color: #92400e;
          }
          .warning-icon {
            display: inline-block;
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <span class="logo-text">Uni-Bok</span>
            </div>
            <div class="badge">Admin Invitation</div>
          </div>
          
          <div class="content">
            <h2 class="text-center invite-title">You're Invited to Join as Administrator</h2>
            <p class="text-center invite-subtitle">
              You have been invited to become an administrator for the Uni-Bok platform
            </p>
            
            <div class="details-box">
              <div class="detail-item">
                <svg class="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <span><strong>Platform:</strong> Uni-Bok - Department of Molecular Biology and Biotechnology</span>
              </div>
              <div class="detail-item">
                <svg class="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span><strong>Role:</strong> Administrator (Full Access)</span>
              </div>
              <div class="detail-item">
                <svg class="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
                <span><strong>Invite Expires:</strong> 24 hours from now</span>
              </div>
            </div>
            
            <div class="text-center">
              <a href="${acceptUrl}" class="button">Accept Admin Invitation</a>
            </div>
            
            <p class="text-center" style="color: #6b7280; margin-bottom: 16px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <div class="link-box">
              ${acceptUrl}
            </div>
            
            <div class="warning">
              <span class="warning-icon">⚠️</span>
              <strong>Important:</strong> This invitation link is unique to you and expires in 24 hours. 
              Do not share this link with anyone else.
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              As an administrator, you'll have access to manage courses, upload materials, 
              view analytics, and help maintain the platform for the Microbiology Department.
            </p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Uni-Bok - Department of Molecular Biology and Biotechnology</p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you believe you received this invitation by mistake, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  console.log(`Admin invite email sent to: ${email}`);
  console.log(`Accept URL: ${acceptUrl}`);
}
