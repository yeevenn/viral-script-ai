import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { product, contentType, market, platform, language, style, extraNotes } = await req.json();

    if (!product?.trim()) {
      return NextResponse.json({ error: "请输入产品名称" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "未配置 OpenAI API Key，请在 Vercel 环境变量中添加 OPENAI_API_KEY" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an elite short-form video content director, viral marketing strategist, and professional scriptwriter with 10+ years of experience creating viral content for TikTok, Instagram Reels, YouTube Shorts, and 小红书.

You deeply understand:
- What makes videos go viral (pattern interrupts, emotional triggers, curiosity gaps)
- Platform-specific algorithms and content styles
- Regional culture and slang (Malaysia, Singapore, USA, UK, China)
- High completion rate video structures
- Proven viral hook formulas

Always output valid JSON matching the exact structure requested.`;

    const userPrompt = `Create a complete viral video content package for:

Product/Service: ${product}
Platform: ${platform || "TikTok"}
Content Type: ${contentType || "搞笑/Funny"}
Target Market: ${market || "Malaysia"}
Language: ${language || "English"}
Style: ${style || "Malaysia Local (Lah/Bro/Walai)"}
Extra Notes: ${extraNotes || "None"}

Generate EXACTLY this JSON structure (no markdown, pure JSON):
{
  "viralIdeas": [10 specific viral content angle ideas as strings, each with a compelling title],
  "hookOptions": [10 powerful opening hooks (first 3 seconds) as strings - use the chosen language/style],
  "fullScript": "Complete word-for-word video script with timestamps like [0:00-0:03] Hook, [0:03-0:15] etc. Include stage directions in parentheses. Use chosen language and style.",
  "shotList": [
    {"shot": 1, "description": "Detailed description of what to film", "duration": "0-3 sec"},
    ...8-12 shots total
  ],
  "editingSuggestions": [
    {"type": "Zoom Effect", "suggestion": "specific suggestion"},
    {"type": "Caption Style", "suggestion": "specific suggestion"},
    {"type": "Sound Effect", "suggestion": "specific suggestion"},
    {"type": "Transition", "suggestion": "specific suggestion"},
    {"type": "Text Overlay", "suggestion": "specific suggestion"},
    {"type": "B-roll", "suggestion": "specific suggestion"}
  ],
  "caption": "Complete social media caption with emojis, line breaks, and call to action. In the chosen language.",
  "hashtags": [25-30 relevant hashtags as strings including # symbol, mix of trending and niche],
  "viralScore": {
    "hookStrength": number between 70-98,
    "engagementPotential": number between 70-98,
    "shareability": number between 70-98,
    "conversionPotential": number between 70-98,
    "total": average of above 4 scores
  },
  "musicStyle": "Specific music style recommendation with 3-4 examples of song types or artists",
  "cta": "Strong call-to-action text for end of video"
}

IMPORTANT:
- Use ${language || "English"} for the script and caption
- Apply ${style || "Malaysia Local"} cultural references and slang
- Make content feel authentic, not AI-generated
- Focus on high completion rate (hook viewers in first 3 seconds)
- Return ONLY valid JSON, no other text`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.85,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("AI 没有返回内容");

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
