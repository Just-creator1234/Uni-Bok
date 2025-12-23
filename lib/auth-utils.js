// /lib/auth-utils.js
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "./prisma";

/**
 * Check if the current session user is SUPER_ADMIN
 * @param {Object} session - Optional session object (if not provided, fetches from server)
 * @returns {Promise<boolean>} True if user is SUPER_ADMIN
 */
export async function isSuperAdmin(session = null) {
  try {
    // If session not provided, get it from server
    if (!session) {
      session = await getServerSession(authOptions);
    }

    if (!session?.user?.email) {
      return false;
    }

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    return user?.role === "SUPER_ADMIN";
  } catch (error) {
    console.error("Error checking SUPER_ADMIN status:", error);
    return false;
  }
}

/**
 * Check if user has admin privileges (SUPER_ADMIN or ADMIN)
 * @param {Object} session - Optional session object
 * @returns {Promise<boolean>} True if user is ADMIN or SUPER_ADMIN
 */
export async function isAdmin(session = null) {
  try {
    if (!session) {
      session = await getServerSession(authOptions);
    }

    if (!session?.user?.email) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get current user with role information
 * @returns {Promise<Object|null>} User object with role
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        slug: true,
        emailVerified: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
