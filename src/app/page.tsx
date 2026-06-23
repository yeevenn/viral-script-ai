"use client";

import { useState } from "react";
import { Sparkles, Zap, TrendingUp, Film, Hash, Target } from "lucide-react";
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
}

const PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "小红书", "Facebook"];
const CONTENT_TYPES = ["搞笑/Funny", "教育/Educational", "销售/Sales", "故事型/Storytelling", "争议型/Controversial", "挑战型/Challenge"];
const MARKETS = ["Malaysia", "Singapore", "USA", "UK", "China", "Global"];
const LANGUAGES = ["English", "中文 Chinese", "Malay", "Bilingual (EN+ZH)", "Bilingual (EN+MY)"];
const STYLES = ["Malaysia Local (Lah/Bro/Walai)", "Singapore Singlish", "USA Gen Z / TikTok", "UK Humour", "Professional", "Luxury Brand", "Aggressive Sales"];

export default function Home() {
  const [form, setForm] = useState({
    product: "",
    contentType: "",
    market: "",
    platform: "",
    language: "",
    style: "",
    extraNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<ScriptOutput | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!form.product.trim()) {
      setError("请输入你的产品或服务名称");
      return;
    }
    setError("");
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  const ScoreBar = ({ score, label }: { score: number; label: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-primary">{score}/100</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">ViralScript <span className="gradient-text">AI</span></span>
          </div>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            AI Content Director — 30秒生成爆款脚本
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            让 AI 帮你写
            <br />
            <span className="gradient-text">下一个爆款视频</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            输入你的产品，AI 自动生成 Viral Hook、完整脚本、拍摄方案、Caption 和 Hashtags
          </p>
        </div>

        {/* Form */}
        <Card className="glow-card mb-8 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              填写你的内容需求
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">
                你的产品 / 服务是什么？ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product"
                placeholder="例如：马来西亚芝士奶茶、线上英语课程、美容仪器..."
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">目标平台</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, platform: form.platform === p ? "" : p })}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        form.platform === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">内容类型</Label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, contentType: form.contentType === t ? "" : t })}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        form.contentType === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">目标市场</Label>
                <div className="flex flex-wrap gap-2">
                  {MARKETS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setForm({ ...form, market: form.market === m ? "" : m })}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        form.market === m
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">语言</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => setForm({ ...form, language: form.language === l ? "" : l })}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        form.language === l
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">内容风格</Label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, style: form.style === s ? "" : s })}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.style === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">额外备注（可选）</Label>
              <Textarea
                id="notes"
                placeholder="例如：我们是家庭经营、产品价格 RM18、目标客户是 18-35 岁女性..."
                value={form.extraNotes}
                onChange={(e) => setForm({ ...form, extraNotes: e.target.value })}
                className="bg-secondary/50 border-border/50 focus:border-primary resize-none"
                rows={3}
              />
            </div>

            {error && (
              <p className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-semibold py-6 text-base transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI 正在为你生成爆款脚本...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  一键生成爆款脚本
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        {output && (
          <div className="space-y-6">
            {/* Viral Score */}
            <Card className="glow-card border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="w-5 h-5" />
                  Viral Score — 爆款潜力评分
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">综合评分</span>
                  <span className="text-4xl font-bold gradient-text">{output.viralScore.total}</span>
                </div>
                <ScoreBar score={output.viralScore.hookStrength} label="Hook 吸引力" />
                <ScoreBar score={output.viralScore.engagementPotential} label="互动潜力" />
                <ScoreBar score={output.viralScore.shareability} label="分享率" />
                <ScoreBar score={output.viralScore.conversionPotential} label="转化潜力" />
              </CardContent>
            </Card>

            <Tabs defaultValue="ideas" className="w-full">
              <TabsList className="w-full grid grid-cols-4 lg:grid-cols-7 bg-secondary/50 p-1 h-auto gap-1">
                <TabsTrigger value="ideas" className="text-xs py-2">爆款选题</TabsTrigger>
                <TabsTrigger value="hooks" className="text-xs py-2">Hooks</TabsTrigger>
                <TabsTrigger value="script" className="text-xs py-2">完整脚本</TabsTrigger>
                <TabsTrigger value="shots" className="text-xs py-2">分镜方案</TabsTrigger>
                <TabsTrigger value="editing" className="text-xs py-2">剪辑建议</TabsTrigger>
                <TabsTrigger value="caption" className="text-xs py-2">Caption</TabsTrigger>
                <TabsTrigger value="hashtags" className="text-xs py-2">Hashtags</TabsTrigger>
              </TabsList>

              <TabsContent value="ideas">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      10 个爆款内容方向
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.viralIdeas.map((idea, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                        <span className="text-primary font-bold text-sm min-w-[24px]">#{i + 1}</span>
                        <p className="text-sm leading-relaxed">{idea}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hooks">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      10 个 Viral Hooks（前3秒开场）
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.hookOptions.map((hook, i) => (
                      <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary mb-2">Hook #{i + 1}</Badge>
                        <p className="text-sm leading-relaxed font-medium">&ldquo;{hook}&rdquo;</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="script">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-primary" />
                      完整视频脚本
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/30 rounded-lg p-6 border border-border/30">
                      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{output.fullScript}</pre>
                    </div>
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary font-medium">📢 CTA（行动号召）</p>
                      <p className="text-sm mt-1">{output.cta}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shots">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-primary" />
                      拍摄分镜方案
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.shotList.map((shot, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-secondary/30 rounded-lg border border-border/30">
                        <div className="min-w-[60px] text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto text-primary font-bold text-sm">
                            {shot.shot}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 block">{shot.duration}</span>
                        </div>
                        <p className="text-sm leading-relaxed pt-2">{shot.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="editing">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      剪辑 & 后期建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {output.editingSuggestions.map((item, i) => (
                      <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-border/30">
                        <Badge variant="outline" className="text-xs mb-2 border-primary/30 text-primary">{item.type}</Badge>
                        <p className="text-sm leading-relaxed">{item.suggestion}</p>
                      </div>
                    ))}
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary mb-1">🎵 配乐风格建议</p>
                      <p className="text-sm">{output.musicStyle}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="caption">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      贴文 Caption 文案
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/30 rounded-lg p-6 border border-border/30">
                      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{output.caption}</pre>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => navigator.clipboard.writeText(output.caption)}
                    >
                      复制 Caption
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hashtags">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-primary" />
                      推荐 Hashtags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {output.hashtags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors py-1.5 px-3 text-sm"
                          onClick={() => navigator.clipboard.writeText(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => navigator.clipboard.writeText(output.hashtags.join(" "))}
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      复制全部 Hashtags
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="text-center pt-4 pb-8">
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={loading}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                重新生成
              </Button>
            </div>
          </div>
        )}

        <footer className="mt-16 pb-8 text-center text-xs text-muted-foreground">
          <p>ViralScript AI — 让每个创作者都能快速制作高流量短视频内容</p>
        </footer>
      </div>
    </main>
  );
}
