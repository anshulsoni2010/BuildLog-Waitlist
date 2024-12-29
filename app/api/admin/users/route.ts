import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import WaitlistUser from "@/models/WaitlistUser";

export async function GET() {
  try {
    await connectDB();
    const users = await WaitlistUser.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { userId, action, email } = await req.json();

    switch (action) {
      case "verify":
        await WaitlistUser.findByIdAndUpdate(userId, {
          isVerified: true,
          verifiedAt: new Date(),
        });
        break;
      
      case "edit":
        await WaitlistUser.findByIdAndUpdate(userId, { email });
        break;

      case "delete":
        await WaitlistUser.findByIdAndDelete(userId);
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error managing user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to manage user" },
      { status: 500 }
    );
  }
}
