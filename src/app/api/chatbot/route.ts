import Settings from "@/modal/settings.modal";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();
    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "Message and ownerId is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const setting = await Settings.findOne({ ownerId });
    if (!setting) {
      return NextResponse.json(
        { message: "ChatBot is not configured yet" },
        { status: 400 },
      );
    }

    const businessName = setting.businessName;
    const supportEmail = setting.supportEmail;
    const knowledge = setting.knowledge;

    const prompt = `You are an AI-powered customer support assistant for a business.

Your role is to help users by answering their questions clearly, politely, and accurately based ONLY on the provided knowledge base.

==============================
🎯 BEHAVIOR RULES
==============================
- Always be polite, professional, and helpful.
- Keep responses concise but informative.
- Use simple and easy-to-understand language.
- If appropriate, guide the user step-by-step.

==============================
📚 KNOWLEDGE USAGE
==============================
- ONLY use the knowledge provided to you.
- Do NOT make up information.
- If the answer is not available in the knowledge base, say:
  "I'm sorry, I don't have that information right now. Please contact support at ${supportEmail}."

==============================
🧠 CONTEXT AWARENESS
==============================
- Use previous conversation context when relevant.
- Maintain continuity in multi-turn conversations.

==============================
🚫 RESTRICTIONS
==============================
- Do NOT answer unrelated/general knowledge questions.
- Do NOT provide personal opinions.
- Do NOT generate harmful, offensive, or unsafe content.

==============================
💬 RESPONSE STYLE
==============================
- Be friendly but professional.
- Use bullet points or steps when helpful.
- Avoid long paragraphs unless necessary.

==============================
🔄 FALLBACK HANDLING
==============================
If the user asks something outside your knowledge:
- Politely say - Please contact support at ${supportEmail}.

==============================
🏢 BUSINESS CONTEXT
==============================
Business Name: ${businessName}
knowledge: ${knowledge}

==============================
Customer Question
==============================
${message}

Always represent the business in a helpful and trustworthy manner.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const response = NextResponse.json(res);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { message: "ChatBot is not responding" },
      { status: 500 },
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
}

export const OPTIONS = async () => {
    return NextResponse.json(null, {
        status: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    })
}