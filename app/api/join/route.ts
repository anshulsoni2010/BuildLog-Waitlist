import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import WaitlistUser from "@/models/WaitlistUser";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/token";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, isVerified, fromAdmin } = await req.json();

    // Check if user already exists
    const existingUser = await WaitlistUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken(email);

    // Create new user with token
    const user = await WaitlistUser.create({
      email,
      isVerified: isVerified || false,
      verificationToken: verificationToken, // Store the token
      verifiedAt: isVerified ? new Date() : undefined,
    });

    // Only send verification email if not added by admin as verified
    if (!isVerified && !fromAdmin) {
      try {
        await sendVerificationEmail(email, verificationToken);
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        // Delete the user if email sending fails
        await WaitlistUser.deleteOne({ _id: user._id });
        throw new Error("Failed to send verification email");
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Please check your email to verify your account"
    });
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
