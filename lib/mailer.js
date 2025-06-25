import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, token) {
  console.log(email,token,"jfdddddddddddddddddddddd")
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  console.log(email, "funckinggggg come");

  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Email Verification</h3>
      <p>Click below to verify your email:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `,
  });
}
