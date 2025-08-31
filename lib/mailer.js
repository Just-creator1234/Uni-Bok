// import nodemailer from "nodemailer";

// export async function sendVerificationEmail(email, token) {
//   console.log(email,token,"jfdddddddddddddddddddddd")
//   const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

//   console.log(email, "funckinggggg come");

//   const transporter = nodemailer.createTransport({
//     service: "gmail", // or your email provider
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Uni-Bok" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Verify your email",
//     html: `
//       <h3>Email Verification</h3>
//       <p>Click below to verify your email:</p>
//       <a href="${verifyUrl}">Verify Email</a>
//     `,
//   });
// }

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
