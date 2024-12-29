import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import WaitlistUser from "@/models/WaitlistUser";
import { verifyToken } from "@/lib/token";

export const dynamic = 'force-dynamic'; 
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user by email only first
    const user = await WaitlistUser.findOne({
      email: decoded.email,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // If already verified, still return success
    if (user.isVerified) {
      return NextResponse.json({ 
        success: true, 
        message: "Email verified successfully" 
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Email verified successfully" 
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify email" },
      { status: 500 }
    );
  }
};
