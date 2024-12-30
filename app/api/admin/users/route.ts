import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import WaitlistUser from "@/models/WaitlistUser";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { userId, action, email } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    switch (action) {
      case "verify":
        await WaitlistUser.findByIdAndUpdate(userId, {
          isVerified: true,
          verifiedAt: new Date(),
        });
        break;
      
      case "edit":
        if (!email) {
          return NextResponse.json(
            { success: false, error: "Email is required for edit action" },
            { status: 400 }
          );
        }
        await WaitlistUser.findByIdAndUpdate(userId, { email });
        break;

      case "delete":
        const result = await WaitlistUser.findByIdAndDelete(userId);
        if (!result) {
          return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
          );
        }
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
