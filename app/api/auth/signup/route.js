// app/api/auth/signup/route.js
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { slugify } from "@/lib/utils"; // You'll need to create this utility function

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
  try {
    const { name, email, password } = await request.json();

    // 1. Input validation
    if (!email?.trim() || !password?.trim() || !name.trim()) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // 3. Password strength validation
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
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered", code: "EMAIL_EXISTS" },
        { status: 409 }
      );
    }

    const adminEmails = ["jackright198765@gmail.com","darlingtonboateng18@gmail.com"];
    const isAdmin = adminEmails.includes(email.toLowerCase());

    // 5. Generate unique slug from name
    const baseSlug = slugify(name);
    const uniqueSlug = await generateUniqueSlug(baseSlug, prisma);

    // 6. Create account
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();
    const tokenExpires = addHours(new Date(), 2);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: hashedPassword,
        slug: uniqueSlug, // Add the generated slug
        emailVerified: null,
        role: isAdmin ? "ADMIN" : "STUDENT",
      },
      select: { id: true, email: true, slug: true },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });

    await sendVerificationEmail(user.email, verificationToken);

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
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Account creation failed", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}