"use server";
import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { logEvent } from "@/utils/sentry";
import { signAuthToken, setAuthCookie, removeAuthCookie } from "@/lib/auth";

type ResponseResult = {
  success: boolean;
  message: string;
};

// Register a user
export async function registerUser(
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      logEvent(
        "Validation error: Missing registration fields",
        "auth",
        { name, email },
        "warning"
      );
      return { success: false, message: "All fields are required" };
    }

    // Check is user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logEvent(
        `Registration failed: user ${email} already exists`,
        "auth",
        { email },
        "warning"
      );
      return { success: false, message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Sign and set auth token
    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);

    logEvent(
      `User ${email} registered successfully`,
      "auth",
      { userId: user.id, email },
      "info"
    );

    return { success: true, message: "Registration successful" };
  } catch (error) {
    logEvent(
      "Unexpected error during registration",
      "auth",
      {},
      "error",
      error
    );
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}

// Logout user and remove auth cookie
export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await removeAuthCookie();

    logEvent("User logged out successfully", "auth", {}, "info");
    return { success: true, message: "Logout successful" };
  } catch (error) {
    logEvent(
      "Unexpected Error: User not logged out",
      "auth",
      {},
      "error",
      error
    );
    return { success: false, message: "Logout failed. Please try again" };
  }
}

// Login user
export async function loginUser(
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      logEvent(
        "Validation Error: missing login fields",
        "auth",
        { email },
        "warning"
      );
      return { success: false, message: "Email and password are required" };
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      logEvent(
        `Login failed: User not found ${email}`,
        "auth",
        { email },
        "warning"
      );
      return { success: false, message: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logEvent(
        `Login failed: Incorrect password`,
        "auth",
        { email },
        "warning"
      );
      return { success: false, message: "Invalid email or password" };
    }

    // User enters correct email and password
    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);
    return { success: true, message: "Login successful" };
  } catch (error) {
    logEvent(`Unexpected error: Login failed`, "auth", {}, "error", error);
    return { success: false, message: "Login Failed" };
  }
}
