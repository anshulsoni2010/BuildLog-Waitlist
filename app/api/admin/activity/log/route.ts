import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import WaitlistUser from "@/models/WaitlistUser";

export async function POST(request: Request) {
  try {
    const { userId, activity } = await request.json();

    await connectDB();

    await WaitlistUser.updateOne(
      { _id: userId },
      { 
        $push: { 
          activities: activity 
        },
        ...(activity.type === "login" && {
          $set: { lastLoginAt: new Date() }
        })
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
