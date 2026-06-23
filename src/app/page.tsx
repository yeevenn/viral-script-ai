"use client";

import { useState } from "react";
import { Sparkles, Zap, TrendingUp, Film, Hash, Target, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScriptOutput {
  viralIdeas: string[];
  hookOptions: string[];
  fullScript: string;
  shotList: { shot: number; description: string; duration: string }[];
  editingSuggestions: { type: string; suggestion: string }[];
  caption: string;
  hashtags: string[];
  viralScore: {
    hookStrength: number;
    engagementPotential: number;
    shareability: number;
    conversionPotential: number;
    total: number;
  };
  musicStyle: string;
  cta: string;
  coverSuggestion?: string;
  xhsTitle?: string;
}

const PLATFORMS = [
  { id: "TikTok", emoji: "🎵", label: "TikTok" },
  { id: "Instagram Reels", emoji: "📸", label: "Instagram" },
  { id: "YouTube Shorts", emoji: "▶️", label: "YouTube Shorts" },
  { id: "小红书", emoji: "📕", label: "小红书" },
  { id: "Facebook", emoji: "👍", label: "Facebook" },
];

const CONTENT_TYPES = [
  { id: "搞笑/Funny", emoji: "😂", label: "搞笑" },
  { id: "教育/Educational", emoji: "🧠", label: "干货教育" },
  { id: "销售/Sales", emoji: "🛒", label: "种草销售" },
  { id: "故事型/Storytelling", emoji: "✨", label: "故事情感" },
  { id: "争议型/Controversial", emoji: "🔥", label: "争议话题" },
  { id: "挑战型/Challenge", emoji: "💪", label: "挑战趋势" },
  { id: "开箱/Unboxing", emoji: "📦", label: "开箱测评" },
  { id: "Vlog", emoji: "🎬", label: "Vlog 日常" },
];

const MARKETS = [
  { id: "Malaysia", emoji: "🇲🇾", label: "Malaysia" },
  { id: "Singapore", emoji: "🇸🇬", label: "Singapore" },
  { id: "China", emoji: "🇨🇳", label: "中国" },
  { id: "USA", emoji: "🇺🇸", label: "USA" },
  { id: "UK", emoji: "🇬🇧", label: "UK" },
  { id: "Global", emoji: "🌍", label: "Global" },
];

const LANGUAGES = [
  { id: "中文 Chinese", emoji: "🇨🇳", label: "中文" },
  { id: "English", emoji: "🇬🇧", label: "English" },
  { id: "Malay", emoji: "🇲🇾", label: "Bahasa" },
  { id: "Bilingual (EN+ZH)", emoji: "🔀", label: "中英双语" },
  { id: "Bilingual (EN+MY)", emoji: "🔀", label: "英马双语" },
];

const STYLES = [
  { id: "小红书爆款风 (干货+颜值+情绪)", emoji: "📕", label: "小红书爆款" },
  { id: "抖音/TikTok 爆款 (快节奏+反转)", emoji: "🎵", label: "抖音爆款" },
  { id: "Malaysia Chinese Style (大马华语+本地梗：哇靠/酱/对啊/真的假的/你懂我意思吗)", emoji: "🇲🇾🀄", label: "大马华语风" },
  { id: "Malaysia Local Malay (Lah/Bro/Walai/Weh/Kan)", emoji: "🇲🇾", label: "Malaysia Malay" },
  { id: "Singapore Singlish (Lah/Lor/Sia/Can or not)", emoji: "🇸🇬", label: "Singlish" },
  { id: "USA Gen Z / TikTok Slang", emoji: "🇺🇸", label: "Gen Z USA" },
  { id: "UK Humour & Sarcasm", emoji: "🇬🇧", label: "UK Humour" },
  { id: "Luxury Brand Aesthetic", emoji: "💎", label: "高端奢华" },
  { id: "Aggressive Sales / FOMO", emoji: "🔥", label: "爆卖促销" },
];

// Platform Preview Components
function XiaohongshuPreview({ output, product }: { output: ScriptOutput; product: string }) {
  const [copied, setCopied] = useState(false);
  const fullText = `${output.xhsTitle || "✨ " + product}\n\n${output.caption}\n\n${output.hashtags.slice(0, 10).join(" ")}`;

  const copy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto text-black">
        {/* XHS Header */}
        <div className="bg-[#FF2442] px-4 py-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#FF2442] font-black text-xs">小</span>
          </div>
          <span className="text-white font-bold text-sm">小红书</span>
        </div>

        {/* Cover image placeholder */}
        <div className="relative bg-gradient-to-br from-pink-100 to-rose-200 aspect-[4/5] flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-4xl mb-3">📸</div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {output.coverSuggestion || `封面建议：拍摄 ${product} 最吸引人的特写镜头，加上醒目标题文字`}
            </p>
          </div>
          {/* XHS style title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white font-bold text-sm leading-snug">
              {output.xhsTitle || `✨ 这个${product}真的绝了！`}
            </p>
          </div>
        </div>

        {/* Post content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-xs font-bold">你</div>
            <span className="text-xs font-semibold text-gray-800">你的账号名</span>
            <span className="ml-auto text-xs bg-[#FF2442] text-white px-2 py-0.5 rounded-full">+ 关注</span>
          </div>

          <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
            {output.caption}
          </div>

          <div className="flex flex-wrap gap-1">
            {output.hashtags.slice(0, 5).map((tag, i) => (
              <span key={i} className="text-xs text-[#FF2442] font-medium">{tag}</span>
            ))}
          </div>

          {/* Engagement bar */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500">
            <span>❤️ 收藏</span>
            <span>💬 评论</span>
            <span>↗️ 分享</span>
            <span className="ml-auto">👁️ 浏览</span>
          </div>
        </div>
      </div>

      <Button onClick={copy} className="w-full bg-[#FF2442] hover:bg-[#e01f3a] text-white">
        {copied ? "✅ 已复制！" : "📋 复制小红书文案"}
      </Button>
    </div>
  );
}

function TikTokPreview({ output, product }: { output: ScriptOutput; product: string }) {
  const [copied, setCopied] = useState(false);
  const fullText = `${output.caption}\n\n${output.hashtags.join(" ")}`;

  const copy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-2xl overflow-hidden shadow-xl max-w-[280px] mx-auto" style={{ aspectRatio: "9/16", maxHeight: "500px" }}>
        {/* TikTok video area */}
        <div className="relative h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-5xl mb-4">🎵</div>
            <p className="text-white/70 text-xs leading-relaxed">
              {output.coverSuggestion || `拍摄建议：竖屏 9:16，第一帧就要让人停住 — ${product} 最吸睛的画面`}
            </p>
          </div>

          {/* Hook overlay */}
          <div className="absolute top-6 left-4 right-4">
            <div className="bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-lg inline-block">
              ⚡ {output.hookOptions?.[0]?.slice(0, 40) || "前3秒抓住眼球的开场"}...
            </div>
          </div>

          {/* Right side buttons */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4">
            <div className="text-center"><div className="text-2xl">❤️</div><p className="text-white text-xs">12.4K</p></div>
            <div className="text-center"><div className="text-2xl">💬</div><p className="text-white text-xs">843</p></div>
            <div className="text-center"><div className="text-2xl">↗️</div><p className="text-white text-xs">2.1K</p></div>
          </div>

          {/* Bottom caption */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <p className="text-white text-xs font-semibold mb-1">@你的账号</p>
            <p className="text-white text-xs leading-relaxed line-clamp-2">{output.caption?.slice(0, 80)}...</p>
            <p className="text-white/70 text-xs mt-1">{output.hashtags.slice(0, 3).join(" ")}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-4 h-4 bg-white rounded-full animate-spin" style={{ animationDuration: "3s" }}>🎵</div>
              <p className="text-white text-xs">原创音乐 · {product}</p>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={copy} className="w-full bg-black hover:bg-gray-900 text-white border border-gray-700">
        {copied ? "✅ 已复制！" : "📋 复制 TikTok 文案"}
      </Button>
    </div>
  );
}

function InstagramPreview({ output, product }: { output: ScriptOutput; product: string }) {
  const [copied, setCopied] = useState(false);
  const fullText = `${output.caption}\n\n${output.hashtags.join(" ")}`;

  const copy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto text-black">
        {/* IG Header */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs">你</div>
          </div>
          <div>
            <p className="text-xs font-semibold">你的账号</p>
            <p className="text-xs text-gray-400">赞助</p>
          </div>
          <span className="ml-auto text-gray-400 text-lg">···</span>
        </div>

        {/* Cover */}
        <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 aspect-square flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-xs text-gray-500">{output.coverSuggestion || `封面：${product} 高质感拍摄，方形构图`}</p>
          </div>
        </div>

        {/* Engagement */}
        <div className="px-4 py-2 flex items-center gap-4 text-xl">
          <span>🤍</span><span>💬</span><span>↗️</span>
          <span className="ml-auto">🔖</span>
        </div>

        {/* Caption */}
        <div className="px-4 pb-4 space-y-1">
          <p className="text-xs font-semibold">12,847 个赞</p>
          <p className="text-xs"><span className="font-semibold">你的账号</span> {output.caption?.slice(0, 100)}...</p>
          <p className="text-xs text-blue-500">{output.hashtags.slice(0, 5).join(" ")}</p>
          <p className="text-xs text-gray-400">查看全部 234 条评论</p>
        </div>
      </div>

      <Button onClick={copy} className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white">
        {copied ? "✅ 已复制！" : "📋 复制 Instagram 文案"}
      </Button>
    </div>
  );
}

function FacebookPreview({ output, product }: { output: ScriptOutput; product: string }) {
  const [copied, setCopied] = useState(false);
  const fullText = `${output.caption}\n\n${output.hashtags.join(" ")}`;

  const copy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto text-black">
        {/* FB Header */}
        <div className="px-4 py-3 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">你</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-600">你的专页</p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-400">刚刚 · </p>
              <span className="text-xs text-gray-400">🌍 公开</span>
            </div>
          </div>
          <span className="text-gray-400">···</span>
        </div>

        {/* Post text */}
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap line-clamp-4">
            {output.caption?.slice(0, 150)}...
          </p>
          <p className="text-blue-500 text-sm mt-1">{output.hashtags.slice(0, 3).join(" ")}</p>
        </div>

        {/* Video/Image */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-xs text-gray-500 px-4">{output.coverSuggestion || `视频封面建议：${product} 最吸引眼球的场景`}</p>
          </div>
        </div>

        {/* Reactions */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>👍❤️😍 8,432 人</span>
            <span>1,204 则留言 · 567 次分享</span>
          </div>
          <div className="flex gap-0 border-t border-gray-100 pt-2">
            {["👍 赞", "💬 留言", "↗️ 分享"].map((btn) => (
              <button key={btn} className="flex-1 text-center text-xs text-gray-500 py-1 hover:bg-gray-50 rounded-lg font-medium">
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={copy} className="w-full bg-[#1877F2] hover:bg-blue-700 text-white">
        {copied ? "✅ 已复制！" : "📋 复制 Facebook 文案"}
      </Button>
    </div>
  );
}

function YouTubePreview({ output, product }: { output: ScriptOutput; product: string }) {
  const [copied, setCopied] = useState(false);
  const fullText = `${output.caption}\n\n${output.hashtags.join(" ")}`;

  const copy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#0f0f0f] rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
        {/* Thumbnail */}
        <div className="relative bg-gradient-to-br from-red-900 to-gray-900 aspect-video flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-4xl mb-2">▶️</div>
            <p className="text-white/70 text-xs">{output.coverSuggestion || `缩略图建议：明亮背景 + 你的表情 + 大字标题`}</p>
          </div>
          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded font-medium">0:58</div>
          {/* Title overlay on thumbnail */}
          <div className="absolute top-2 left-2 right-2">
            <div className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded inline-block">
              {output.hookOptions?.[0]?.slice(0, 30) || product}
            </div>
          </div>
        </div>

        {/* Video info */}
        <div className="p-3 flex gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">你</div>
          <div className="flex-1">
            <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
              {output.xhsTitle || `【${product}】${output.hookOptions?.[0]?.slice(0, 40) || "你一定要看这个！"}`}
            </p>
            <p className="text-gray-400 text-xs mt-1">你的频道 · 1.2万 次观看 · 刚刚</p>
          </div>
        </div>
      </div>

      <Button onClick={copy} className="w-full bg-[#FF0000] hover:bg-red-700 text-white">
        {copied ? "✅ 已复制！" : "📋 复制 YouTube 文案"}
      </Button>
    </div>
  );
}

function PlatformPreview({ output, platform, product }: { output: ScriptOutput; platform: string; product: string }) {
  if (platform === "小红书") return <XiaohongshuPreview output={output} product={product} />;
  if (platform === "TikTok") return <TikTokPreview output={output} product={product} />;
  if (platform === "Instagram Reels") return <InstagramPreview output={output} product={product} />;
  if (platform === "Facebook") return <FacebookPreview output={output} product={product} />;
  if (platform === "YouTube Shorts") return <YouTubePreview output={output} product={product} />;
  return <TikTokPreview output={output} product={product} />;
}

export default function Home() {
  const [form, setForm] = useState({
    product: "",
    contentTypes: [] as string[],
    markets: [] as string[],
    platforms: [] as string[],
    languages: [] as string[],
    styles: [] as string[],
    extraNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<ScriptOutput | null>(null);
  const [error, setError] = useState("");

  const toggle = (field: keyof typeof form, value: string) => {
    const arr = form[field] as string[];
    setForm({
      ...form,
      [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const handleGenerate = async () => {
    if (!form.product.trim()) {
      setError("⚠️ 请输入你的产品或服务名称！");
      return;
    }
    setError("");
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: form.product,
          contentType: form.contentTypes.join(", "),
          market: form.markets.join(", "),
          platform: form.platforms.join(", "),
          language: form.languages.join(", "),
          style: form.styles.join(", "),
          extraNotes: form.extraNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setOutput(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ score, label, emoji }: { score: number; label: string; emoji: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{emoji} {label}</span>
        <span className="font-bold text-primary">{score}/100</span>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  const Chip = ({
    emoji, label, selected, onClick,
  }: { emoji: string; label: string; selected: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
          : "bg-secondary/40 border-border/40 text-muted-foreground hover:border-primary/50 hover:bg-secondary/70"
      }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight">ViralScript <span className="gradient-text">AI</span></span>
              <p className="text-xs text-muted-foreground -mt-0.5">🔥 爆款脚本生成器</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30">✨ 免费使用</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 rounded-full px-5 py-2 mb-5 text-sm font-medium">
            <span>🚀</span>
            <span className="gradient-text font-bold">30秒生成爆款视频脚本</span>
            <span>🚀</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            一键生成
            <span className="gradient-text"> 爆款内容 </span>
            🔥
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            输入产品 → AI 帮你写 Hook、脚本、分镜、Caption、Hashtag 🎯<br />
            <span className="text-primary font-semibold">支持小红书 📕 · TikTok 🎵 · Instagram 📸 · Facebook 👍</span>
          </p>
        </div>

        {/* Form Card */}
        <Card className="mb-8 border-border/30 bg-card/80 backdrop-blur-sm shadow-2xl shadow-black/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>✍️</span> 告诉 AI 你要做什么内容
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product */}
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-1.5">
                🛍️ 你的产品 / 服务 <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="例如：芝士奶茶 🧋、瘦身代餐 💪、护肤精华 ✨、线上课程 📚..."
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="bg-secondary/30 border-border/40 focus:border-primary text-base h-12"
              />
            </div>

            {/* Platform */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold flex items-center gap-1.5">
                📱 目标平台
                <span className="text-xs font-normal text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">可多选</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Chip key={p.id} emoji={p.emoji} label={p.label}
                    selected={form.platforms.includes(p.id)}
                    onClick={() => toggle("platforms", p.id)}
                  />
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold flex items-center gap-1.5">
                🎭 内容类型
                <span className="text-xs font-normal text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">可多选</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map((t) => (
                  <Chip key={t.id} emoji={t.emoji} label={t.label}
                    selected={form.contentTypes.includes(t.id)}
                    onClick={() => toggle("contentTypes", t.id)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market */}
              <div className="space-y-2.5">
                <Label className="text-sm font-bold flex items-center gap-1.5">
                  🌍 目标市场
                  <span className="text-xs font-normal text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">可多选</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {MARKETS.map((m) => (
                    <Chip key={m.id} emoji={m.emoji} label={m.label}
                      selected={form.markets.includes(m.id)}
                      onClick={() => toggle("markets", m.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-2.5">
                <Label className="text-sm font-bold flex items-center gap-1.5">
                  💬 语言
                  <span className="text-xs font-normal text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">可多选</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <Chip key={l.id} emoji={l.emoji} label={l.label}
                      selected={form.languages.includes(l.id)}
                      onClick={() => toggle("languages", l.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Style */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold flex items-center gap-1.5">
                ✨ 内容风格
                <span className="text-xs font-normal text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">可多选</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <Chip key={s.id} emoji={s.emoji} label={s.label}
                    selected={form.styles.includes(s.id)}
                    onClick={() => toggle("styles", s.id)}
                  />
                ))}
              </div>
            </div>

            {/* Extra */}
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-1.5">📝 额外备注（可选）</Label>
              <Textarea
                placeholder="例如：价格 RM18 🏷️、家庭式经营 🏠、目标 18-35 岁女生 👩、有促销活动 🎉..."
                value={form.extraNotes}
                onChange={(e) => setForm({ ...form, extraNotes: e.target.value })}
                className="bg-secondary/30 border-border/40 focus:border-primary resize-none"
                rows={2}
              />
            </div>

            {error && (
              <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-black py-7 text-lg rounded-xl shadow-xl shadow-violet-500/30 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI 正在帮你打造爆款脚本... ✨
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🚀 一键生成爆款脚本
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        {output && (
          <div className="space-y-6">
            {/* Viral Score */}
            <Card className="border-primary/30 bg-gradient-to-br from-violet-500/10 to-blue-500/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  🔥 爆款潜力评分
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground font-medium">综合爆款分数</span>
                  <span className="text-5xl font-black gradient-text">{output.viralScore.total}</span>
                </div>
                <ScoreBar score={output.viralScore.hookStrength} label="Hook 吸引力" emoji="⚡" />
                <ScoreBar score={output.viralScore.engagementPotential} label="互动潜力" emoji="💬" />
                <ScoreBar score={output.viralScore.shareability} label="分享扩散力" emoji="↗️" />
                <ScoreBar score={output.viralScore.conversionPotential} label="转化购买力" emoji="🛒" />
              </CardContent>
            </Card>

            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="w-full grid grid-cols-4 md:grid-cols-8 bg-secondary/40 p-1 h-auto gap-1 rounded-xl">
                <TabsTrigger value="preview" className="text-xs py-2 rounded-lg">📱 预览</TabsTrigger>
                <TabsTrigger value="ideas" className="text-xs py-2 rounded-lg">💡 选题</TabsTrigger>
                <TabsTrigger value="hooks" className="text-xs py-2 rounded-lg">⚡ Hooks</TabsTrigger>
                <TabsTrigger value="script" className="text-xs py-2 rounded-lg">📝 脚本</TabsTrigger>
                <TabsTrigger value="shots" className="text-xs py-2 rounded-lg">🎬 分镜</TabsTrigger>
                <TabsTrigger value="editing" className="text-xs py-2 rounded-lg">✂️ 剪辑</TabsTrigger>
                <TabsTrigger value="caption" className="text-xs py-2 rounded-lg">✍️ 文案</TabsTrigger>
                <TabsTrigger value="hashtags" className="text-xs py-2 rounded-lg">#️⃣ 标签</TabsTrigger>
              </TabsList>

              {/* Platform Preview */}
              <TabsContent value="preview">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      📱 {form.platforms[0] || "TikTok"} 发布效果预览
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">这就是你发布后在平台上看起来的样子 👇</p>
                  </CardHeader>
                  <CardContent>
                    <PlatformPreview output={output} platform={form.platforms[0] || "TikTok"} product={form.product} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Ideas */}
              <TabsContent value="ideas">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      💡 10 个爆款选题方向
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.viralIdeas.map((idea, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 bg-secondary/30 rounded-xl border border-border/30 hover:border-primary/40 transition-all hover:bg-secondary/50">
                        <span className="text-primary font-black text-sm min-w-[28px] bg-primary/10 rounded-lg px-1.5 py-0.5 text-center">#{i + 1}</span>
                        <p className="text-sm leading-relaxed">{idea}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hooks */}
              <TabsContent value="hooks">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      ⚡ 10 个 Viral Hooks（前3秒开场白）
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">这些是用来抓住观众注意力的开场白，让他们不刷走 👇</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.hookOptions.map((hook, i) => (
                      <div key={i} className="p-4 bg-secondary/30 rounded-xl border border-border/30 hover:border-primary/40 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">⚡ Hook #{i + 1}</Badge>
                          <button
                            onClick={() => navigator.clipboard.writeText(hook)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-sm leading-relaxed font-medium">&ldquo;{hook}&rdquo;</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Script */}
              <TabsContent value="script">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      📝 完整视频脚本
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-secondary/30 rounded-xl p-5 border border-border/30">
                      <pre className="text-sm leading-loose whitespace-pre-wrap font-sans">{output.fullScript}</pre>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <p className="text-sm text-primary font-bold mb-1">📢 CTA — 结尾行动号召</p>
                      <p className="text-sm">{output.cta}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => navigator.clipboard.writeText(output.fullScript)}
                    >
                      <Copy className="w-4 h-4 mr-2" /> 复制完整脚本
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shots */}
              <TabsContent value="shots">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      🎬 拍摄分镜方案
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">每个镜头要拍什么，按顺序来就对了 👇</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.shotList.map((shot, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-border/30">
                        <div className="min-w-[56px] text-center flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto text-primary font-black text-sm">
                            {shot.shot}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 block">{shot.duration}</span>
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-sm leading-relaxed">{shot.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Editing */}
              <TabsContent value="editing">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      ✂️ 剪辑 & 后期建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.editingSuggestions.map((item, i) => (
                      <div key={i} className="p-4 bg-secondary/30 rounded-xl border border-border/30">
                        <Badge variant="outline" className="text-xs mb-2 border-primary/30 text-primary">{item.type}</Badge>
                        <p className="text-sm leading-relaxed">{item.suggestion}</p>
                      </div>
                    ))}
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <p className="text-sm font-bold text-primary mb-1">🎵 配乐风格建议</p>
                      <p className="text-sm">{output.musicStyle}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Caption */}
              <TabsContent value="caption">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      ✍️ 贴文 Caption 文案
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-secondary/30 rounded-xl p-5 border border-border/30">
                      <pre className="text-sm leading-loose whitespace-pre-wrap font-sans">{output.caption}</pre>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-violet-600 to-blue-500 text-white"
                      onClick={() => navigator.clipboard.writeText(output.caption)}
                    >
                      <Copy className="w-4 h-4 mr-2" /> 复制 Caption
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hashtags */}
              <TabsContent value="hashtags">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      #️⃣ 推荐 Hashtags
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">点单个标签可以复制 · 或者一次复制全部</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {output.hashtags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-all py-1.5 px-3 text-sm rounded-xl"
                          onClick={() => navigator.clipboard.writeText(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className="bg-gradient-to-r from-violet-600 to-blue-500 text-white"
                      onClick={() => navigator.clipboard.writeText(output.hashtags.join(" "))}
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      复制全部 {output.hashtags.length} 个标签
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Regenerate */}
            <div className="text-center pb-8">
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={loading}
                className="border-primary/30 text-primary hover:bg-primary/10 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                换一套脚本
              </Button>
            </div>
          </div>
        )}

        <footer className="mt-16 pb-8 text-center text-xs text-muted-foreground space-y-1">
          <p>✨ ViralScript AI — 让每个创作者都能快速制作高流量短视频内容</p>
          <p>🎯 支持 TikTok · 小红书 · Instagram · YouTube Shorts · Facebook</p>
        </footer>
      </div>
    </main>
  );
}
