import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { product, contentType, market, platform, language, style, extraNotes } = await req.json();

    if (!product?.trim()) {
      return NextResponse.json({ error: "请输入产品名称" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "未配置 Gemini API Key，请在 Vercel 环境变量中添加 GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.85,
        maxOutputTokens: 4000,
      },
    });

    const prompt = `You are an elite short-form video content director, viral marketing strategist, and professional scriptwriter with 10+ years of experience creating viral content for TikTok, Instagram Reels, YouTube Shorts, and 小红书.

Create a complete viral video content package for:
Product/Service: ${product}
Platform: ${platform || "TikTok"}
Content Type: ${contentType || "搞笑/Funny"}
Target Market: ${market || "Malaysia"}
Language: ${language || "English"}
Style: ${style || "Malaysia Local (Lah/Bro/Walai)"}
Extra Notes: ${extraNotes || "None"}

Return ONLY valid JSON with this exact structure:
{
  "viralIdeas": [10 specific viral content angle ideas as strings],
  "hookOptions": [10 powerful opening hooks for first 3 seconds as strings, use the chosen language and style],
  "fullScript": "Complete word-for-word video script with timestamps like [0:00-0:03] Hook, [0:03-0:15] etc. Include stage directions in parentheses. Use chosen language and style.",
  "shotList": [
    {"shot": 1, "description": "Detailed description of what to film", "duration": "0-3 sec"}
  ],
  "editingSuggestions": [
    {"type": "Zoom Effect", "suggestion": "specific suggestion"},
    {"type": "Caption Style", "suggestion": "specific suggestion"},
    {"type": "Sound Effect", "suggestion": "specific suggestion"},
    {"type": "Transition", "suggestion": "specific suggestion"},
    {"type": "Text Overlay", "suggestion": "specific suggestion"},
    {"type": "B-roll", "suggestion": "specific suggestion"}
  ],
  "caption": "Complete social media caption with emojis and line breaks in the chosen language",
  "hashtags": ["#tag1", "#tag2", ... 25 relevant hashtags],
  "viralScore": {
    "hookStrength": 85,
    "engagementPotential": 82,
    "shareability": 80,
    "conversionPotential": 78,
    "total": 81
  },
  "musicStyle": "Specific music style recommendation with examples",
  "cta": "Strong call-to-action for end of video"
}

Rules:
- Use ${language || "English"} for the script and caption
- Apply ${style || "Malaysia Local"} cultural references and slang authentically
- Make it feel human and natural, not AI-generated
- Focus on high completion rate (hook in first 3 seconds)
- shotList must have 8-12 shots`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
