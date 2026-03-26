import connectDB from "@/lib/db";
import Settings from "@/modal/settings.modal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ownerId } = await req.json();

    if (!ownerId) {
      return NextResponse.json(
        { message: "owner id is required" },
        { status: 400 },
      );
    }
    await connectDB();
    const settings = await Settings.findOne({ ownerId });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
