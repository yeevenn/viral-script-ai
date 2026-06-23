import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { product, contentType, market, platform, language, style, extraNotes } = await req.json();

    if (!product?.trim()) {
      return NextResponse.json({ error: "请输入产品名称" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "未配置 GROQ_API_KEY，请在 Vercel 环境变量中添加" }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are an elite short-form video content director, viral marketing strategist, and professional scriptwriter with 10+ years of experience creating viral content for TikTok, Instagram Reels, YouTube Shorts, and 小红书.

Create a complete viral video content package for:
Product/Service: ${product}
Platform: ${platform || "TikTok"}
Content Type: ${contentType || "搞笑/Funny"}
Target Market: ${market || "Malaysia"}
Language: ${language || "English"}
Style: ${style || "Malaysia Local (Lah/Bro/Walai)"}
Extra Notes: ${extraNotes || "None"}

Return ONLY valid JSON with this exact structure (no markdown, no explanation, pure JSON):
{
  "viralIdeas": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5", "idea 6", "idea 7", "idea 8", "idea 9", "idea 10"],
  "hookOptions": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5", "hook 6", "hook 7", "hook 8", "hook 9", "hook 10"],
  "fullScript": "Complete word-for-word video script with timestamps like [0:00-0:03] Hook\\n[0:03-0:15] Main content etc. Include stage directions in parentheses. Use chosen language and style.",
  "shotList": [
    {"shot": 1, "description": "what to film", "duration": "0-3 sec"},
    {"shot": 2, "description": "what to film", "duration": "3-8 sec"},
    {"shot": 3, "description": "what to film", "duration": "8-15 sec"},
    {"shot": 4, "description": "what to film", "duration": "15-22 sec"},
    {"shot": 5, "description": "what to film", "duration": "22-30 sec"},
    {"shot": 6, "description": "what to film", "duration": "30-38 sec"},
    {"shot": 7, "description": "what to film", "duration": "38-45 sec"},
    {"shot": 8, "description": "what to film", "duration": "45-55 sec"}
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
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12", "#tag13", "#tag14", "#tag15", "#tag16", "#tag17", "#tag18", "#tag19", "#tag20", "#tag21", "#tag22", "#tag23", "#tag24", "#tag25"],
  "viralScore": {
    "hookStrength": 85,
    "engagementPotential": 82,
    "shareability": 80,
    "conversionPotential": 78,
    "total": 81
  },
  "musicStyle": "Specific music style recommendation with 3-4 examples",
  "cta": "Strong call-to-action text for end of video"
}

Important rules:
- Use ${language || "English"} for ALL script, caption, hooks content
- Apply ${style || "Malaysia Local"} cultural references and slang authentically
- Make it feel human and natural
- Hook must grab attention in first 3 seconds
- Return ONLY the JSON object, nothing else`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a viral content expert. Always respond with valid JSON only, no markdown formatting, no explanation.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 4000,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI 没有返回正确格式");

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
