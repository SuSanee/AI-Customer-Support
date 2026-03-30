import connectDB from "@/lib/db";
import { getSession } from "@/lib/getSession";
import Settings from "@/modal/settings.modal";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }
    const ownerId = session.user.id;

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
