import React, { useState, useEffect } from "react";
import {
  ContentItem,
  ContentStatus,
  ChannelType,
  FeedbackEntry,
  VisualDirection,
} from "../types";
import { ImageStudio } from "./ImageStudio";
import { AESTHETIC_STOCK_VIDEOS } from "../data/stockMedia";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Send,
  Image as ImageIcon,
  FileText,
  Instagram,
  Hash,
  Clock3,
  Film,
  Smartphone,
  Quote,
  Globe,
  Languages,
  RotateCcw,
  Camera,
  Layers,
  Palette,
  Loader2,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ExternalLink,
  BookOpen,
  MessageSquare,
  Wand2,
  PenLine,
  AtSign,
  BarChart3,
} from "lucide-react";

interface ContentDetailStudioProps {
  item: ContentItem;
  onUpdateItem: (updated: ContentItem) => void;
  onBackToCalendar: () => void;
  onOpenPublishModal: (item: ContentItem) => void;
}

const QUICK_PROMPT_CATEGORIES = {
  all: [
    { label: "✨ 최종 업로드용 게시본으로 정리해줘", action: "finalize" as const, scope: "all" as const },
    { label: "✍️ 조금 더 짧고 담백하게 다듬어줘", action: "modify" as const, scope: "text" as const },
    { label: "📸 따뜻한 오전 자연광과 린넨 질감 사진으로 수정", action: "modify" as const, scope: "image" as const },
    { label: "🎬 9:16 릴스 영상으로 전환하고 슬로우 무빙 연출", action: "modify" as const, scope: "video" as const },
    { label: "🌿 광고 느낌을 줄이고 진솔한 디렉터 톤으로", action: "modify" as const, scope: "text" as const },
  ],
  text: [
    { label: "✍️ 조금 더 짧고 담백하게 다듬어줘", action: "modify" as const, scope: "text" as const },
    { label: "🌿 광고 느낌을 줄이고 진솔한 톤으로", action: "modify" as const, scope: "text" as const },
    { label: "🎨 전통 공예·조각보 디자인 배경 스토리 비중 확대", action: "modify" as const, scope: "text" as const },
    { label: "💡 독자에게 유익한 관리/스타일링 팁 추가", action: "modify" as const, scope: "text" as const },
    { label: "🧵 Threads 특유의 솔직한 디렉터 사유 어조로", action: "modify" as const, scope: "text" as const },
    { label: "🌐 영문(EN) 카피를 매거진 에디토리얼 무드로 강화", action: "modify" as const, scope: "text" as const },
  ],
  image: [
    { label: "📸 아침 자연광과 내추럴 린넨 클로즈업 사진으로 수정", action: "modify" as const, scope: "image" as const },
    { label: "🏺 백자 도자기와 모던 원목 오브제 중심 구도로 변경", action: "modify" as const, scope: "image" as const },
    { label: "📐 여백을 넉넉히 둔 1:1 정방형 미니멀 구도로 수정", action: "modify" as const, scope: "image" as const },
    { label: "🏛️ 성수동 아뜰리에 무드의 감성적인 톤으로 재생성", action: "modify" as const, scope: "image" as const },
    { label: "🪞 이미지 오버레이 카피를 '시간이 깃든 공간'으로 변경", action: "modify" as const, scope: "image" as const },
    { label: "☀️ 따뜻한 오후 골든아워 자연광으로 조명 연출 변경", action: "modify" as const, scope: "image" as const },
  ],
  video: [
    { label: "🎬 9:16 세로 릴스로 전환하고 슬로우 팬 무빙 연출", action: "modify" as const, scope: "video" as const },
    { label: "☕ 바람에 살랑이는 커튼과 따뜻한 티 타임 영상으로 수정", action: "modify" as const, scope: "video" as const },
    { label: "🧵 원단 직조감과 핸드크래프트 디테일 포커스 인 영상", action: "modify" as const, scope: "video" as const },
    { label: "📽️ 릴스 3씬 스토리보드와 시청 유도 훅 문구 보강", action: "modify" as const, scope: "video" as const },
    { label: "🏛️ 미니멀 아뜰리에 전경을 담은 시네마틱 릴스로 변경", action: "modify" as const, scope: "video" as const },
    { label: "📱 릴스 첫 3초 시선 집중 텍스트 오버레이 추가", action: "modify" as const, scope: "video" as const },
  ],
};

export const ContentDetailStudio: React.FC<ContentDetailStudioProps> = ({
  item,
  onUpdateItem,
  onBackToCalendar,
  onOpenPublishModal,
}) => {
  // Main Navigation Mode in Detail Studio: "content" (Copy & Channels), "media" (Visual & Image Studio), "feedback" (AI Revision & History)
  const [activeStudioTab, setActiveStudioTab] = useState<"content" | "media" | "feedback">("content");

  const [activeChannelTab, setActiveChannelTab] = useState<ChannelType>(
    item.channel || "Instagram Feed"
  );
  const [languageView, setLanguageView] = useState<"bilingual" | "kr" | "en">(
    item.includeEnglish ? "bilingual" : "kr"
  );
  const [showMetaDetails, setShowMetaDetails] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [refineNotice, setRefineNotice] = useState<string | null>(null);

  // Direct Revision & Feedback Scope Controls
  const [feedbackScope, setFeedbackScope] = useState<"all" | "text" | "image" | "video">("all");
  const [activePromptCategory, setActivePromptCategory] = useState<"all" | "text" | "image" | "video">("all");
  const [autoRegenerateMedia, setAutoRegenerateMedia] = useState(true);
  const [isMediaRegenerating, setIsMediaRegenerating] = useState(false);
  const [mediaStatusText, setMediaStatusText] = useState("");

  // Local editable text states
  const [editableCopy, setEditableCopy] = useState(item.copywriting?.feedText || "");
  const [editableCopyEn, setEditableCopyEn] = useState(item.copywriting?.feedTextEn || "");
  const [editableThreads, setEditableThreads] = useState(item.copywriting?.threadsText || "");
  const [editableThreadsEn, setEditableThreadsEn] = useState(item.copywriting?.threadsTextEn || "");

  useEffect(() => {
    setEditableCopy(item.copywriting?.feedText || "");
    setEditableCopyEn(item.copywriting?.feedTextEn || "");
    setEditableThreads(item.copywriting?.threadsText || "");
    setEditableThreadsEn(item.copywriting?.threadsTextEn || "");
    if (item.includeEnglish && languageView === "kr") {
      setLanguageView("bilingual");
    }
  }, [item]);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleStatusChange = (newStatus: ContentStatus) => {
    onUpdateItem({
      ...item,
      status: newStatus,
    });
  };

  // Toggle English inclusion
  const handleToggleEnglish = async () => {
    const nextInclude = !item.includeEnglish;
    const updated: ContentItem = {
      ...item,
      includeEnglish: nextInclude,
    };
    onUpdateItem(updated);

    if (nextInclude) {
      setLanguageView("bilingual");
      if (!item.copywriting?.feedTextEn) {
        await handleGenerateEnglish(updated);
      }
    } else {
      setLanguageView("kr");
    }
  };

  // Trigger English Generation via Gemini
  const handleGenerateEnglish = async (targetItem: ContentItem = item) => {
    setIsTranslating(true);
    try {
      const res = await fetch("/api/content/translate-en", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentItem: targetItem }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const enData = data.data;
        const updatedItem: ContentItem = {
          ...targetItem,
          includeEnglish: true,
          copywriting: {
            ...targetItem.copywriting,
            feedTextEn: enData.feedTextEn || targetItem.copywriting?.feedTextEn,
            threadsTextEn: enData.threadsTextEn || targetItem.copywriting?.threadsTextEn,
            hashtagsEn: enData.hashtagsEn || targetItem.copywriting?.hashtagsEn,
            reelsStructure: {
              ...(targetItem.copywriting?.reelsStructure || {
                hook: "",
                scenes: [],
                caption: "",
              }),
              ...(enData.reelsStructureEn ? {
                hookEn: enData.reelsStructureEn.hookEn,
                scenesEn: enData.reelsStructureEn.scenesEn,
                captionEn: enData.reelsStructureEn.captionEn,
                ctaEn: enData.reelsStructureEn.ctaEn,
              } : {}),
            },
            blogDraft: {
              ...(targetItem.copywriting?.blogDraft || { title: "", outline: "" }),
              titleEn: enData.blogDraftEn?.titleEn || targetItem.copywriting?.blogDraft?.titleEn,
              outlineEn: enData.blogDraftEn?.outlineEn || targetItem.copywriting?.blogDraft?.outlineEn,
            },
          },
        };
        onUpdateItem(updatedItem);
        setEditableCopyEn(updatedItem.copywriting?.feedTextEn || "");
        setEditableThreadsEn(updatedItem.copywriting?.threadsTextEn || "");
      }
    } catch (e) {
      console.error("Failed to generate English copy:", e);
    } finally {
      setIsTranslating(false);
    }
  };

  // AI Refine or Feedback
  const handleRefine = async (
    customPrompt?: string,
    actionType: "modify" | "feedback" | "finalize" = "modify",
    forcedScope?: "all" | "text" | "image" | "video"
  ) => {
    const requestText = customPrompt || promptInput;
    if (!requestText.trim()) return;

    const currentScope = forcedScope || feedbackScope;
    setIsRefining(true);
    setRefineNotice(null);

    try {
      const res = await fetch("/api/content/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentContent: item,
          userRequest: requestText,
          refinementType: actionType,
          targetScope: currentScope,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const refined: ContentItem = data.data;

        const isVideoReq =
          currentScope === "video" ||
          refined.shouldRegenerateMedia === "video" ||
          refined.mediaType === "video" ||
          /영상|릴스|동영상|비디오|reels|video|무빙|숏츠|카메라/i.test(requestText);

        const isImageReq =
          !isVideoReq &&
          (currentScope === "image" ||
            refined.shouldRegenerateMedia === "image" ||
            refined.mediaType === "image" ||
            /이미지|사진|포토|스틸|image|photo|컷|화보/i.test(requestText));

        const detectedScope: "all" | "text" | "image" | "video" = isVideoReq
          ? "video"
          : isImageReq
          ? "image"
          : currentScope;

        let nextImageUrl = item.imageUrl;
        let nextImageSource = item.imageSource;
        let nextImageFileName = item.imageFileName;
        let nextMediaType: "image" | "video" =
          refined.mediaType || (isVideoReq ? "video" : isImageReq ? "image" : item.mediaType || "image");

        // Optional Automatic AI Media Regeneration
        if (autoRegenerateMedia && (isVideoReq || isImageReq) && actionType !== "finalize") {
          setIsMediaRegenerating(true);
          if (isVideoReq) {
            setMediaStatusText("🎬 릴스 비디오(Veo 3.1)를 렌더링하고 있습니다...");
            try {
              const videoPrompt =
                refined.visualDirection?.promptEn ||
                `${refined.topic || item.topic}, cinematic ambient motion, 4k`;

              const startRes = await fetch("/api/video/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  prompt: videoPrompt,
                  aspectRatio: refined.visualDirection?.aspectRatio || "9:16",
                }),
              });
              const startData = await startRes.json();
              if (startData.success && startData.operationName) {
                let done = false;
                for (let i = 0; i < 4; i++) {
                  await new Promise((r) => setTimeout(r, 2500));
                  const sRes = await fetch("/api/video/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ operationName: startData.operationName }),
                  });
                  const sData = await sRes.json();
                  if (sData.done) {
                    done = true;
                    break;
                  }
                }
                if (done) {
                  const dlRes = await fetch("/api/video/download", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ operationName: startData.operationName }),
                  });
                  if (dlRes.ok) {
                    const blob = await dlRes.blob();
                    nextImageUrl = URL.createObjectURL(blob);
                    nextImageSource = "ai";
                    nextImageFileName = `ai-refined-video-${Date.now()}.mp4`;
                    nextMediaType = "video";
                  }
                } else {
                  const fbVideo = AESTHETIC_STOCK_VIDEOS[0];
                  nextImageUrl = fbVideo.url;
                  nextImageSource = "stock";
                  nextImageFileName = fbVideo.title;
                  nextMediaType = "video";
                }
              }
            } catch (vErr) {
              console.warn("Video auto-generate fallback:", vErr);
            }
          } else if (isImageReq) {
            setMediaStatusText("📸 AI 이미지를 렌더링하고 있습니다...");
            try {
              const imgPrompt =
                refined.visualDirection?.promptEn ||
                `${refined.topic || item.topic}, ${refined.visualDirection?.props || "aesthetic props"}, 8k`;
              const imgRes = await fetch("/api/image/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: imgPrompt }),
              });
              const imgData = await imgRes.json();
              if (imgData.success && imgData.imageUrl) {
                nextImageUrl = imgData.imageUrl;
                nextImageSource = "ai";
                nextImageFileName = `ai-refined-photo-${Date.now()}.png`;
                nextMediaType = "image";
              }
            } catch (iErr) {
              console.warn("Image auto-generate fallback:", iErr);
            }
          }
          setIsMediaRegenerating(false);
          setMediaStatusText("");
        }

        const newHistory: FeedbackEntry = {
          id: `fb-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          userPrompt: requestText,
          actionType,
          targetScope: detectedScope,
          previousTextSnippet: item.copywriting?.feedText?.slice(0, 60) + "...",
          mediaModified: isVideoReq || isImageReq,
          mediaType: nextMediaType,
        };

        const updatedItem: ContentItem = {
          ...refined,
          imageUrl: nextImageUrl,
          imageSource: nextImageSource,
          imageFileName: nextImageFileName,
          mediaType: nextMediaType,
          visualDirection: {
            ...item.visualDirection,
            ...(refined.visualDirection || {}),
            aspectRatio: isVideoReq
              ? "9:16"
              : refined.visualDirection?.aspectRatio || item.visualDirection?.aspectRatio || "4:5",
          },
          feedbackHistory: [newHistory, ...(item.feedbackHistory || [])],
          status: actionType === "finalize" ? "최종 완료" : "피드백 확인",
        };

        onUpdateItem(updatedItem);

        if (updatedItem.copywriting?.feedText) {
          setEditableCopy(updatedItem.copywriting.feedText);
        }
        if (updatedItem.copywriting?.feedTextEn) {
          setEditableCopyEn(updatedItem.copywriting.feedTextEn);
        }
        if (updatedItem.copywriting?.threadsText) {
          setEditableThreads(updatedItem.copywriting.threadsText);
        }
        if (updatedItem.copywriting?.threadsTextEn) {
          setEditableThreadsEn(updatedItem.copywriting.threadsTextEn);
        }
        setPromptInput("");

        if (isVideoReq) {
          setActiveChannelTab("Instagram Reels");
        } else if (/스레드|threads/i.test(requestText)) {
          setActiveChannelTab("Threads");
        } else if (/블로그|blog/i.test(requestText)) {
          setActiveChannelTab("Blog");
        }

        setRefineNotice(data.warning || "✨ 요청하신 수정 내용이 즉시 반영되었습니다.");
        setTimeout(() => setRefineNotice(null), 4000);
      }
    } catch (err) {
      console.error("Refinement failed:", err);
      setRefineNotice("수정 요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setTimeout(() => setRefineNotice(null), 4000);
    } finally {
      setIsRefining(false);
      setIsMediaRegenerating(false);
    }
  };

  const handleSaveTextChanges = () => {
    onUpdateItem({
      ...item,
      copywriting: {
        ...item.copywriting,
        feedText: editableCopy,
        feedTextEn: editableCopyEn,
        threadsText: editableThreads,
        threadsTextEn: editableThreadsEn,
      },
    });
    setCopiedSection("saved");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* 1. Studio Header: Modern & Minimal */}
      <div className="bg-white border border-neutral-200/80 p-5 sm:p-6 rounded-2xl shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <button
              onClick={onBackToCalendar}
              className="p-2 sm:p-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors rounded-xl shrink-0 mt-0.5 shadow-2xs"
              title="플랜 목록으로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                  {item.date.slice(5)} ({item.dayOfWeek})
                </span>
                <span className="text-[11px] sm:text-xs font-medium px-2.5 py-0.5 bg-neutral-100 text-neutral-700 rounded-full">
                  {item.contentType}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-white ${
                    item.depthLayer === "PRODUCT"
                      ? "bg-rose-500"
                      : item.depthLayer === "STORY"
                      ? "bg-amber-500"
                      : "bg-neutral-600"
                  }`}
                >
                  {item.depthLayer}
                </span>
                {item.includeEnglish && (
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-900 text-amber-300 rounded-full flex items-center space-x-1">
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={1.75} />
                    <span>EN</span>
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-xl font-bold text-neutral-900 mt-1.5 tracking-tight break-words">
                {item.topic}
              </h1>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
            {/* English Toggle */}
            <div className="flex items-center space-x-2 bg-neutral-50/80 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs">
              <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" strokeWidth={1.75} />
              <span className="text-neutral-600 text-[11px] font-medium">영문:</span>
              <button
                type="button"
                onClick={handleToggleEnglish}
                className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors ${
                  item.includeEnglish ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    item.includeEnglish ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Status Selector */}
            <div className="flex items-center space-x-1.5 bg-neutral-50/80 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-neutral-500 text-[11px]">상태:</span>
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(e.target.value as ContentStatus)}
                className="font-bold text-neutral-900 bg-transparent focus:outline-hidden cursor-pointer text-xs"
              >
                <option value="기획">기획</option>
                <option value="작성 중">작성 중</option>
                <option value="수정 필요">수정 필요</option>
                <option value="피드백 확인">피드백 확인</option>
                <option value="최종 완료">최종 완료</option>
                <option value="게시 완료">게시 완료</option>
              </select>
            </div>

            {/* Final Publish Modal Trigger */}
            <button
              onClick={() => onOpenPublishModal(item)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" strokeWidth={1.75} />
              <span>최종 게시본</span>
            </button>
          </div>
        </div>

        {/* Minimal Meta Accordion / Summary */}
        <div className="mt-4 pt-3 border-t border-neutral-100 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-neutral-600 truncate max-w-xl">
              <span className="font-semibold text-neutral-800 shrink-0">핵심:</span>
              <span className="truncate text-neutral-600 text-xs">{item.coreMessage}</span>
            </div>
            <button
              onClick={() => setShowMetaDetails(!showMetaDetails)}
              className="text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center space-x-1 shrink-0 ml-2 font-medium transition-colors"
            >
              <span>{showMetaDetails ? "접기" : "기획 배경"}</span>
              {showMetaDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showMetaDetails && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-100 bg-neutral-50/70 p-3.5 rounded-xl border border-neutral-200/60">
              <div>
                <span className="font-semibold text-neutral-700 block mb-0.5 text-[11px]">콘텐츠 목적</span>
                <p className="text-neutral-600 text-xs leading-relaxed">{item.purpose}</p>
              </div>
              <div>
                <span className="font-semibold text-neutral-700 block mb-0.5 text-[11px]">브랜드 스토리 접점</span>
                <p className="text-neutral-600 text-xs leading-relaxed">{item.culturalReference?.title || "브랜드 헤리티지 및 일상 감성 연결"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Studio Workspace Tabs (Clutter-Free Tab Navigation) */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 bg-white px-3 rounded-t-2xl overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 sm:space-x-2 py-1.5 shrink-0">
          <button
            onClick={() => setActiveStudioTab("content")}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeStudioTab === "content"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" strokeWidth={1.75} />
            <span>카피 & 채널</span>
          </button>

          <button
            onClick={() => setActiveStudioTab("media")}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeStudioTab === "media"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
            <span>미디어 & 비주얼</span>
            {item.mediaType === "video" && (
              <span className="text-[9px] sm:text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                Reels
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveStudioTab("feedback")}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeStudioTab === "feedback"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" strokeWidth={1.75} />
            <span>AI 피드백</span>
            {(item.feedbackHistory || []).length > 0 && (
              <span className="text-[9px] sm:text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-full font-semibold">
                {(item.feedbackHistory || []).length}
              </span>
            )}
          </button>
        </div>

        {/* Global Save Button */}
        <div className="hidden sm:flex items-center space-x-2 pr-3 shrink-0">
          <button
            onClick={handleSaveTextChanges}
            className="text-xs text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            {copiedSection === "saved" ? "✓ 저장 완료" : "텍스트 저장"}
          </button>
        </div>
      </div>

      {/* 3. Tab Contents: Clean, Spacious, Highly Readable */}
      <div className="bg-white border border-neutral-200/80 border-t-0 rounded-b-2xl p-4 sm:p-7 shadow-2xs min-h-[480px]">
        {/* TAB 1: Copy & Channels Editor */}
        {activeStudioTab === "content" && (
          <div className="space-y-4 sm:space-y-5">
            {/* Channel Sub-Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {(
                  [
                    "Instagram Feed",
                    "Instagram Reels",
                    "Instagram Stories",
                    "Threads",
                    "Blog",
                  ] as ChannelType[]
                ).map((tab) => {
                  const isActive = activeChannelTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveChannelTab(tab)}
                      className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {tab === "Instagram Feed" && <Instagram className="w-3.5 h-3.5 shrink-0" />}
                      {tab === "Instagram Reels" && <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                      {tab === "Instagram Stories" && <Smartphone className="w-3.5 h-3.5 shrink-0" />}
                      {tab === "Threads" && <Quote className="w-3.5 h-3.5 shrink-0" />}
                      {tab === "Blog" && <FileText className="w-3.5 h-3.5 shrink-0" />}
                      <span>{tab.replace("Instagram ", "")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Language Switch for Feed/Threads */}
              {item.includeEnglish && (
                <div className="flex items-center space-x-1 bg-neutral-100 p-0.5 rounded-md text-xs self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => setLanguageView("bilingual")}
                    className={`px-2 sm:px-2.5 py-1 rounded-sm font-medium transition-colors text-xs ${
                      languageView === "bilingual"
                        ? "bg-white text-neutral-900 font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    한·영 병기
                  </button>
                  <button
                    onClick={() => setLanguageView("kr")}
                    className={`px-2 py-1 rounded-sm font-medium transition-colors text-xs ${
                      languageView === "kr"
                        ? "bg-white text-neutral-900 font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    KR
                  </button>
                  <button
                    onClick={() => setLanguageView("en")}
                    className={`px-2 py-1 rounded-sm font-medium transition-colors text-xs ${
                      languageView === "en"
                        ? "bg-white text-neutral-900 font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    EN
                  </button>
                </div>
              )}
            </div>

            {/* 1-1. Instagram Feed Channel View */}
            {activeChannelTab === "Instagram Feed" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800">
                    인스타그램 피드 본문 (줄바꿈 & 캡션)
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${editableCopy}\n\n${(item.hashtags || []).join(" ")}`,
                          "feedKr"
                        )
                      }
                      className="flex items-center space-x-1 text-xs text-neutral-700 hover:text-neutral-900 font-medium bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-sm transition-colors"
                    >
                      {copiedSection === "feedKr" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedSection === "feedKr" ? "복사됨" : "한국어 복사"}</span>
                    </button>

                    {item.includeEnglish && (
                      <button
                        onClick={() => {
                          const enTags = (item.copywriting?.hashtagsEn || []).join(" ");
                          copyToClipboard(`${editableCopyEn}\n\n${enTags}`, "feedEn");
                        }}
                        className="flex items-center space-x-1 text-xs text-neutral-900 font-semibold bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-sm border border-amber-200 transition-colors"
                      >
                        {copiedSection === "feedEn" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedSection === "feedEn" ? "복사됨" : "영문 복사"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {item.includeEnglish && languageView === "bilingual" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-neutral-700 block">🇰🇷 한국어 본문</span>
                      <textarea
                        rows={12}
                        value={editableCopy}
                        onChange={(e) => setEditableCopy(e.target.value)}
                        className="w-full p-4 border border-neutral-300 rounded-md bg-neutral-50/50 text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-y"
                        placeholder="한국어 피드 본문이 여기에 표시됩니다."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800 flex items-center space-x-1">
                          <Globe className="w-3 h-3 text-neutral-600" />
                          <span>🌐 English Version</span>
                        </span>
                        {!editableCopyEn && (
                          <button
                            onClick={() => handleGenerateEnglish(item)}
                            disabled={isTranslating}
                            className="text-[11px] text-amber-700 hover:underline font-semibold"
                          >
                            {isTranslating ? "생성 중..." : "+ AI 영문 생성"}
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={12}
                        value={editableCopyEn}
                        onChange={(e) => setEditableCopyEn(e.target.value)}
                        className="w-full p-4 border border-neutral-300 rounded-md bg-neutral-50/50 text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-y"
                        placeholder={isTranslating ? "영문 카피를 생성하고 있습니다..." : "English editorial copy will appear here."}
                      />
                    </div>
                  </div>
                ) : item.includeEnglish && languageView === "en" ? (
                  <textarea
                    rows={12}
                    value={editableCopyEn}
                    onChange={(e) => setEditableCopyEn(e.target.value)}
                    className="w-full p-4 border border-neutral-300 rounded-md bg-neutral-50/50 text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-y"
                    placeholder="English editorial copy will appear here."
                  />
                ) : (
                  <textarea
                    rows={12}
                    value={editableCopy}
                    onChange={(e) => setEditableCopy(e.target.value)}
                    className="w-full p-4 border border-neutral-300 rounded-md bg-neutral-50/50 text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-y"
                    placeholder="인스타그램 피드용 본문이 여기에 표시됩니다."
                  />
                )}

                {/* Hashtags Section */}
                <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-700 flex items-center space-x-1">
                      <Hash className="w-3.5 h-3.5 text-neutral-500" />
                      <span>추천 해시태그 (Korean & Global)</span>
                    </span>
                    <button
                      onClick={() => {
                        const allTags = [
                          ...(item.hashtags || []),
                          ...(item.includeEnglish && item.copywriting?.hashtagsEn
                            ? item.copywriting.hashtagsEn
                            : []),
                        ];
                        copyToClipboard(allTags.join(" "), "tags");
                      }}
                      className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium"
                    >
                      {copiedSection === "tags" ? "✓ 복사됨" : "전체 복사"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.hashtags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs text-neutral-700 bg-white px-2 py-0.5 rounded-sm border border-neutral-200 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.includeEnglish &&
                      (item.copywriting?.hashtagsEn || []).map((tag, i) => (
                        <span
                          key={`en-${i}`}
                          className="text-xs text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-sm border border-neutral-300 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 1-2. Instagram Reels Channel View */}
            {activeChannelTab === "Instagram Reels" && (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
                  <span className="font-bold text-neutral-900 text-xs block mb-1">
                    ⚡ 첫 3초 시선 끄는 훅(Hook) 문구
                  </span>
                  <p className="font-bold text-neutral-900 text-sm sm:text-base">
                    "{item.copywriting?.reelsStructure?.hook || item.coreMessage}"
                  </p>
                  {item.includeEnglish && item.copywriting?.reelsStructure?.hookEn && (
                    <p className="font-medium text-neutral-600 text-xs mt-1 italic">
                      EN: "{item.copywriting.reelsStructure.hookEn}"
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <span className="font-bold text-neutral-800 text-xs flex items-center space-x-1.5">
                    <Film className="w-3.5 h-3.5 text-neutral-700" strokeWidth={1.75} />
                    <span>영상 씬(Scene) 구성 스토리보드</span>
                  </span>
                  <div className="space-y-2">
                    {(
                      item.copywriting?.reelsStructure?.scenes || [
                        "Scene 1: 자연광이 들어오는 공간 속 패브릭의 질감 클로즈업",
                        "Scene 2: 디자이너의 스케치와 컬러 조색 비하인드",
                        "Scene 3: 실제 주거 공간에 자연스럽게 녹아든 라이프스타일 풀샷",
                      ]
                    ).map((scene, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-md flex items-start space-x-3"
                      >
                        <span className="font-mono font-bold text-neutral-400 text-xs shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">{scene}</p>
                          {item.includeEnglish &&
                            item.copywriting?.reelsStructure?.scenesEn &&
                            item.copywriting.reelsStructure.scenesEn[idx] && (
                              <p className="text-xs text-neutral-500 italic">
                                EN: {item.copywriting.reelsStructure.scenesEn[idx]}
                              </p>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md space-y-2">
                  <span className="font-semibold text-neutral-700 text-xs block">릴스 캡션 & 행동 유도</span>
                  <p className="text-xs text-neutral-800">
                    {item.copywriting?.reelsStructure?.caption || item.copywriting?.feedText?.slice(0, 120) + "..."}
                  </p>
                  {item.copywriting?.reelsStructure?.cta && (
                    <div className="pt-2 border-t border-neutral-200 text-neutral-600 text-xs flex items-center space-x-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" strokeWidth={1.75} />
                      <span><strong>CTA:</strong> {item.copywriting.reelsStructure.cta}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 1-3. Instagram Stories Channel View */}
            {activeChannelTab === "Instagram Stories" && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-neutral-800 flex items-center space-x-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-neutral-700" strokeWidth={1.75} />
                  <span>인스타그램 스토리 (1~4 슬라이드 템플릿)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(
                    item.copywriting?.storiesFlow || [
                      { step: 1, title: "오늘 보고 있는 것", text: item.topic },
                      { step: 2, title: "흥미로운 디테일", text: item.coreMessage },
                      { step: 3, title: "디자인 연결", text: "우리 브랜드 제품과 연결되는 지점" },
                      { step: 4, title: "팔로워 질문", text: "여러분은 어떤 느낌을 더 선호하시나요?", pollQuestion: "A vs B" },
                    ]
                  ).map((slide, idx) => (
                    <div
                      key={idx}
                      className="bg-neutral-900 text-white p-4 rounded-md flex flex-col justify-between aspect-4/5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="font-mono font-bold">Story 0{slide.step || idx + 1}</span>
                        <span>{slide.title}</span>
                      </div>
                      <div className="my-auto text-center py-2">
                        <p className="text-xs font-medium leading-relaxed text-neutral-100">{slide.text}</p>
                      </div>
                      {slide.pollQuestion && (
                        <div className="bg-neutral-800 p-2 text-center rounded-sm text-xs text-amber-300 flex items-center justify-center space-x-1 border border-neutral-700">
                          <BarChart3 className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.75} />
                          <span>{slide.pollQuestion}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1-4. Threads Channel View */}
            {activeChannelTab === "Threads" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">
                      스레드(Threads) 전용 담백한 문장
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      광고성을 배제한 디렉터의 진솔한 제작 사유
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(editableThreads || "", "threadsKr")}
                    className="flex items-center space-x-1 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-sm"
                  >
                    {copiedSection === "threadsKr" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === "threadsKr" ? "복사됨" : "복사"}</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={editableThreads}
                  onChange={(e) => setEditableThreads(e.target.value)}
                  className="w-full p-4 border border-neutral-300 rounded-md bg-neutral-50/50 text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-y"
                  placeholder="스레드용 정갈하고 담백한 문장이 여기에 표시됩니다."
                />
              </div>
            )}

            {/* 1-5. Blog Channel View */}
            {activeChannelTab === "Blog" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
                  <span className="text-xs font-bold text-neutral-600 block mb-1">블로그 아티클 제목 제안</span>
                  <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                    {item.copywriting?.blogDraft?.title || `[Brand Journal] ${item.topic}`}
                  </h3>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md space-y-2">
                  <span className="text-xs font-bold text-neutral-700 block">심층 목차 및 에세이 개요</span>
                  <pre className="text-xs text-neutral-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {item.copywriting?.blogDraft?.outline ||
                      `1. 시작하며: 우리가 주목한 일상의 장면\n2. 리서치와 문화적 배경: ${item.culturalReference?.title || "소재 탐구"}\n3. 브랜드의 시선: 왜 이것이 중요한가\n4. 현대 공간을 위한 패브릭 연출 & 실용적 팁\n5. 맺음말`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Visual & Media Studio */}
        {activeStudioTab === "media" && (
          <div className="space-y-5">
            <ImageStudio
              topic={item.topic}
              visualDirection={item.visualDirection}
              imageUrl={item.imageUrl}
              mediaType={item.mediaType}
              imageSource={item.imageSource}
              imageFileName={item.imageFileName}
              onUpdateImage={(newUrl, source, fileName, mediaType) => {
                onUpdateItem({
                  ...item,
                  imageUrl: newUrl,
                  imageSource: source,
                  imageFileName: fileName,
                  mediaType: mediaType || (fileName && /\.(mp4|webm|mov|m4v)$/i.test(fileName) ? "video" : "image"),
                });
              }}
              onUpdateVisualDirection={(newVd) => {
                onUpdateItem({
                  ...item,
                  visualDirection: newVd,
                });
              }}
            />
          </div>
        )}

        {/* TAB 3: AI Refinement, Natural Language Revisions & Feedback History */}
        {activeStudioTab === "feedback" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* AI Prompt Box */}
            <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-lg space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-neutral-900 text-sm">
                  자연어 수정 및 피드백 요청
                </h3>
              </div>

              {/* Scope Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">수정 대상 선택</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-white border border-neutral-200 rounded-md text-xs">
                  {(
                    [
                      { id: "all", label: "전체 (글+미디어)", icon: Wand2 },
                      { id: "text", label: "본문 & 카피", icon: PenLine },
                      { id: "image", label: "이미지 수정", icon: Camera },
                      { id: "video", label: "릴스 & 동영상", icon: Film },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setFeedbackScope(s.id);
                        setActivePromptCategory(s.id);
                      }}
                      className={`py-2 px-2 font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                        feedbackScope === s.id
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                      }`}
                    >
                      <s.icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 block">추천 피드백 제안</label>
                <div className="flex flex-wrap gap-1.5">
                  {(QUICK_PROMPT_CATEGORIES[activePromptCategory] || QUICK_PROMPT_CATEGORIES.all).map(
                    (preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleRefine(preset.label, preset.action, preset.scope)}
                        disabled={isRefining || isMediaRegenerating}
                        className="text-xs px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-md transition-colors disabled:opacity-50 text-left flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" strokeWidth={1.75} />
                        <span>{preset.label.replace(/^[✨✍️📸🎬🌿🎨\s]+/, "")}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRefine(undefined, "feedback");
                }}
                className="space-y-3 pt-2 border-t border-neutral-200"
              >
                <div className="relative">
                  <textarea
                    rows={3}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="원하는 수정 사항을 자유롭게 입력하세요 (예: '첫 문장은 유지하고 린넨 질감과 릴스 영상 연출 방향을 보강해줘')"
                    className="w-full p-3.5 border border-neutral-300 rounded-md bg-white text-xs sm:text-sm text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 resize-none pr-12 leading-relaxed"
                  />
                  <button
                    type="submit"
                    disabled={isRefining || isMediaRegenerating || !promptInput.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:opacity-40 transition-colors shadow-xs"
                    title="피드백 전송"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>

                {isMediaRegenerating && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-md flex items-center space-x-2 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-700 shrink-0" />
                    <span>{mediaStatusText || "미디어를 생성하고 있습니다..."}</span>
                  </div>
                )}

                {refineNotice && (
                  <div className="p-2.5 bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs rounded-md flex items-center space-x-2">
                    <Info className="w-4 h-4 text-neutral-500 shrink-0" strokeWidth={1.75} />
                    <span>{refineNotice}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Feedback History Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 text-xs flex items-center space-x-1.5">
                  <Clock3 className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.75} />
                  <span>수정 & 피드백 이력</span>
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {(item.feedbackHistory || []).length}개의 기록
                </span>
              </div>

              {(!item.feedbackHistory || item.feedbackHistory.length === 0) ? (
                <div className="p-6 text-center text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-md text-xs">
                  아직 수정 이력이 없습니다. 위 입력창에서 자연어로 피드백을 요청해보세요.
                </div>
              ) : (
                <div className="space-y-2">
                  {item.feedbackHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-md space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-neutral-700 flex items-center space-x-1">
                          {entry.actionType === "finalize" ? (
                            <>
                              <Sparkles className="w-3 h-3 text-amber-500" strokeWidth={2} />
                              <span>최종 확정</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-3 h-3 text-neutral-500" strokeWidth={1.75} />
                              <span>피드백 반영</span>
                            </>
                          )}
                        </span>
                        <span className="text-neutral-400 font-mono">{entry.timestamp}</span>
                      </div>
                      <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                        "{entry.userPrompt}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
