// // app/api/auth/signup/route.js
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { v4 as uuidv4 } from "uuid";
// import { addHours } from "date-fns";
// import { createSlug } from "@/lib/utils";

// import { sendVerificationEmail } from "@/lib/mailer";

// // Password requirements
// const PASSWORD_RULES = {
//   minLength: 8,
//   requireUppercase: true,
//   requireNumber: true,
//   requireSpecialChar: true,
//   blockedPasswords: [
//     "password",
//     "12345678",
//     "qwerty",
//     "letmein",
//     "admin123",
//     "welcome",
//   ],
// };

// // Function to generate a unique slug
// async function generateUniqueSlug(baseSlug, prisma) {
//   let slug = baseSlug;
//   let counter = 1;
//   let isUnique = false;

//   while (!isUnique) {
//     const existingUser = await prisma.user.findUnique({
//       where: { slug },
//     });

//     if (!existingUser) {
//       isUnique = true;
//     } else {
//       slug = `${baseSlug}-${counter}`;
//       counter++;
//     }
//   }

//   return slug;
// }

// export async function POST(request) {
//   try {
//     const { name, email, password } = await request.json();

//     // 1. Input validation
//     if (!email?.trim() || !password?.trim() || !name.trim()) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // 2. Email format check
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: "Please enter a valid email address" },
//         { status: 400 }
//       );
//     }

//     // 3. Password strength validation
//     const errors = [];
//     const passwordLower = password.toLowerCase();

//     if (password.length < PASSWORD_RULES.minLength) {
//       errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
//     }
//     if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
//       errors.push("One uppercase letter");
//     }
//     if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(password)) {
//       errors.push("One number");
//     }
//     if (
//       PASSWORD_RULES.requireSpecialChar &&
//       !/[!@#$%^&*(),.?":{}|<>]/.test(password)
//     ) {
//       errors.push("One special character");
//     }
//     if (PASSWORD_RULES.blockedPasswords.includes(passwordLower)) {
//       errors.push("Password is too common");
//     }

//     if (errors.length > 0) {
//       return NextResponse.json(
//         {
//           error: `Password requirements: ${errors.join(", ")}`,
//           code: "WEAK_PASSWORD",
//         },
//         { status: 400 }
//       );
//     }

//     // 4. Case-insensitive email check
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         email: {
//           equals: email.toLowerCase(),
//         },
//       },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email already registered", code: "EMAIL_EXISTS" },
//         { status: 409 }
//       );
//     }

//     // 6. Generate unique slug from name
//     const baseSlug = createSlug(name);
//     const uniqueSlug = await generateUniqueSlug(baseSlug, prisma);

//     // 7. Create account (ALWAYS as STUDENT)
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const verificationToken = uuidv4();
//     const tokenExpires = addHours(new Date(), 2);

//     const user = await prisma.user.create({
//       data: {
//         name: name,
//         email: email.toLowerCase(),
//         password: hashedPassword,
//         slug: uniqueSlug,
//         emailVerified: false,
//         role: "STUDENT", // <-- ALL new users are STUDENTS
//         // REMOVED: hasCompletedQuestionnaire field
//       },
//       select: { id: true, email: true, slug: true, role: true },
//     });

//     await prisma.verificationToken.create({
//       data: {
//         identifier: user.email,
//         token: verificationToken,
//         expires: tokenExpires,
//       },
//     });

//     await sendVerificationEmail(user.email, verificationToken);

//     return NextResponse.json(
//       {
//         success: true,
//         user,
//         message:
//           "Account created. Please check your email to verify your account.",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json(
//       { error: "Account creation failed", code: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }

// app/api/auth/signup/route.js
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { createSlug } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/mailer";

// Password requirements
const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  blockedPasswords: [
    "password",
    "12345678",
    "qwerty",
    "letmein",
    "admin123",
    "welcome",
  ],
};

// Function to generate a unique slug
async function generateUniqueSlug(baseSlug, prisma) {
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({
      where: { slug },
    });

    if (!existingUser) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}

export async function POST(request) {
  let errorStep = "initialization";

  try {
    errorStep = "parsing_request";
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Input validation
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // 2. Email format check
    errorStep = "email_validation";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // 3. Password strength validation
    errorStep = "password_validation";
    const errors = [];
    const passwordLower = password.toLowerCase();

    if (password.length < PASSWORD_RULES.minLength) {
      errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
    }
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(password)) {
      errors.push("One number");
    }
    if (
      PASSWORD_RULES.requireSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.push("One special character");
    }
    if (PASSWORD_RULES.blockedPasswords.includes(passwordLower)) {
      errors.push("Password is too common");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: `Password requirements: ${errors.join(", ")}`,
          code: "WEAK_PASSWORD",
        },
        { status: 400 }
      );
    }

    // 4. Case-insensitive email check
    errorStep = "check_existing_user";
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already registered",
          code: "EMAIL_EXISTS",
          step: errorStep,
        },
        { status: 409 }
      );
    }

    // 5. Generate unique slug from name
    errorStep = "slug_generation";
    const baseSlug = createSlug(name);
    const uniqueSlug = await generateUniqueSlug(baseSlug, prisma);

    // 6. Create account (ALWAYS as STUDENT)
    errorStep = "password_hashing";
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();
    const tokenExpires = addHours(new Date(), 2);

    errorStep = "create_user";
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: hashedPassword,
        slug: uniqueSlug,
        emailVerified: false,
        role: "STUDENT",
      },
      select: { id: true, email: true, slug: true, role: true },
    });

    errorStep = "create_verification_token";
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });

    errorStep = "send_verification_email";
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        {
          error: "Email sending error ",
          code: "Failure to send email",
          step: errorStep,
        },
        { status: 409 }
      );
      // Continue even if email fails - user can request resend
    }

    return NextResponse.json(
      {
        success: true,
        user,
        message:
          "Account created. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(errorStep, "KKKKKKKKKKK");
    console.error(`Signup error at step "${errorStep}":`, error);

    // Log specific error details
    if (error.code) {
      console.error("Database error code:", error.code);
    }
    if (error.meta) {
      console.error("Database error meta:", error.meta);
    }

    return NextResponse.json(
      {
        error: "Account creation failed",
        code: "SERVER_ERROR",
        step: errorStep,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
