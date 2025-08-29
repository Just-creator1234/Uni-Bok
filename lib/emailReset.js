import nodemailer from "nodemailer";

export async function sendEmail(email, token) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h3>Reset Your Password</h3>
      <p>Click here to reset:</p>
      <a href="${resetLink}">Verify Email</a>
    `,
  });
}