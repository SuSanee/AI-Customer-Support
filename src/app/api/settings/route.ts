import connectDB from "@/lib/db";
import { getSession } from "@/lib/getSession";
import Settings from "@/modal/settings.modal";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }
    const ownerId = session.user.id;

    const formData = await req.formData();
    const businessName = formData.get("businessName") as string;
    const supportEmail = formData.get("supportEmail") as string;
    const knowledge = formData.get("knowledge") as string;
    const pdfFile = formData.get("pdf") as File | null;
    const removePdf = formData.get("removePdf") === "true";

    await connectDB();

    const updateData: Record<string, string> = {
      ownerId,
      businessName,
      supportEmail,
      knowledge,
    };

    if (removePdf) {
      updateData.pdfText = "";
      updateData.pdfName = "";
    } else if (pdfFile && pdfFile.size > 0) {
      if (pdfFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "PDF must be under 5MB" },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      updateData.pdfText = pdfData.text;
      updateData.pdfName = pdfFile.name;
    }

    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      updateData,
      { new: true, upsert: true },
    );
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
