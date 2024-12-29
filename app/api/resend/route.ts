import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import WaitlistUser from "@/models/WaitlistUser";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required", success: false },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user
    const user = await WaitlistUser.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Email not found in waitlist", success: false },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email is already verified", success: false },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    // Update user with new token
    await WaitlistUser.updateOne(
      { _id: user._id },
      { $set: { verificationToken } }
    );

    // Send new verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { 
        message: "Verification email resent successfully", 
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in resend verification:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email", success: false },
      { status: 500 }
    );
  }
}
