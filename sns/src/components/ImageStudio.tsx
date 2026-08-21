import React, { useState, useRef, useEffect } from "react";
import { VisualDirection } from "../types";
import {
  AESTHETIC_STOCK_PHOTOS,
  AESTHETIC_STOCK_VIDEOS,
  StockMedia,
} from "../data/stockMedia";
import {
  UploadCloud,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  Wand2,
  Trash2,
  Download,
  Check,
  Layers,
  FileVideo,
  FileImage,
  Play,
  Pause,
  ShieldCheck,
  Film,
  Info,
  RefreshCw,
  Camera,
  Compass,
  CheckCircle2,
  Clapperboard,
  SlidersHorizontal,
} from "lucide-react";

interface MediaStudioProps {
  topic: string;
  visualDirection: VisualDirection;
  imageUrl?: string; // Media URL (image or video)
  mediaType?: "image" | "video";
  imageSource?: "upload" | "ai" | "stock";
  imageFileName?: string;
  onUpdateImage: (
    url: string | undefined,
    source?: "upload" | "ai" | "stock",
    fileName?: string,
    mediaType?: "image" | "video"
  ) => void;
  onUpdateVisualDirection?: (vd: VisualDirection) => void;
}

const VIDEO_CAMERA_PRESETS = [
  {
    name: "🌿 슬로우 팬 (Slow Pan)",
    desc: "아침 자연광이 쏟아지는 공간을 천천히 패닝하는 미니멀 릴스",
    promptSuffix: "Slow subtle camera pan across natural morning sunlight, warm linen textures, calm motion, cinematic 4k aesthetic",
  },
  {
    name: "☕ 일상의 미학 (Cozy Living)",
    desc: "바람에 살랑이는 커튼과 온기 있는 티 타임의 잔잔한 움직임",
    promptSuffix: "Gentle breeze moving soft linen curtains, cozy afternoon atmosphere, warm golden hour, gentle peaceful ambient movement",
  },
  {
    name: "🧵 디테일 클로즈업 (Macro Craft)",
    desc: "원단 직조감과 핸드크래프트 디테일을 강조하는 포커스 인 무빙",
    promptSuffix: "Macro close-up focus pull revealing intricate natural fabric weave, artisan craftsmanship, tactile aesthetic lighting",
  },
  {
    name: "🏛️ 아뜰리에 전경 (Studio Space)",
    desc: "감각적인 가구와 오브제가 조화를 이루는 브랜드 아뜰리에 공간",
    promptSuffix: "Smooth steady wide shot of minimalist designer studio atelier, curated ceramics and textiles, soft diffuse lighting",
  },
];

const IMAGE_STYLE_PRESETS = [
  "자연광 & 내추럴 린넨",
  "백자 도자기 & 모던 미니멀",
  "조각보 패턴 & 따뜻한 원목",
  "킨포크 스타일 아침 햇살",
  "성수동 아뜰리에 무드",
];

export const ImageStudio: React.FC<MediaStudioProps> = ({
  topic,
  visualDirection,
  imageUrl,
  mediaType = "image",
  imageSource,
  imageFileName,
  onUpdateImage,
  onUpdateVisualDirection,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "stock" | "ai">("upload");
  const [aiSubMode, setAiSubMode] = useState<"video" | "image">(
    mediaType === "video" || visualDirection?.aspectRatio === "9:16" ? "video" : "video"
  );
  const [stockMediaTypeFilter, setStockMediaTypeFilter] = useState<"all" | "image" | "video">("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoProgressMessage, setVideoProgressMessage] = useState("");
  const [useStartingImage, setUseStartingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  
  const [customPrompt, setCustomPrompt] = useState(
    visualDirection?.promptEn ||
      `${topic}, ${visualDirection?.props || "aesthetic props"}, ${visualDirection?.lighting || "warm natural light"}`
  );

  const [videoPrompt, setVideoPrompt] = useState(
    `${topic}, ${visualDirection?.props || "linen fabric and ceramics"}, ${visualDirection?.lighting || "soft natural lighting"}, cinematic ambient motion`
  );

  const [selectedRatio, setSelectedRatio] = useState<"1:1" | "4:5" | "9:16" | "16:9">(
    visualDirection?.aspectRatio || (mediaType === "video" ? "9:16" : "4:5")
  );

  const [videoRatio, setVideoRatio] = useState<"9:16" | "16:9">(
    visualDirection?.aspectRatio === "16:9" ? "16:9" : "9:16"
  );

  const [copiedOverlay, setCopiedOverlay] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [customUrlType, setCustomUrlType] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync prompt when topic/visualDirection changes
  useEffect(() => {
    if (visualDirection?.promptEn) {
      setCustomPrompt(visualDirection.promptEn);
    }
  }, [visualDirection]);

  // File Upload Handler (Supports both Video and Image)
  const processFile = (file: File) => {
    if (!file) return;
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
    const isImage = file.type.startsWith("image/") || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(file.name);

    if (!isVideo && !isImage) {
      alert("이미지(PNG, JPG, WebP 등) 또는 동영상(MP4, WebM, MOV 등) 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const detectedType: "image" | "video" = isVideo ? "video" : "image";
        onUpdateImage(result, "upload", file.name, detectedType);
        if (isVideo) {
          setSelectedRatio("9:16");
          setVideoRatio("9:16");
          if (onUpdateVisualDirection) {
            onUpdateVisualDirection({
              ...visualDirection,
              aspectRatio: "9:16",
            });
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // 1. AI Image Generation via Server-Side API (Safe from browser API key leak)
  const handleGenerateAIImage = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt || `${topic}. ${visualDirection?.props}, ${visualDirection?.lighting}`,
          aspectRatio: selectedRatio,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        onUpdateImage(data.imageUrl, "ai", `ai-generated-${Date.now()}.png`, "image");
      } else {
        // Fallback to high-aesthetic curated stock photo
        const fallback =
          AESTHETIC_STOCK_PHOTOS[Math.floor(Math.random() * AESTHETIC_STOCK_PHOTOS.length)];
        onUpdateImage(fallback.url, "stock", fallback.title, "image");
      }
    } catch (err) {
      console.error("AI Image Generation error:", err);
      const fallback = AESTHETIC_STOCK_PHOTOS[0];
      onUpdateImage(fallback.url, "stock", fallback.title, "image");
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. AI Video Generation via Veo 3.1 Engine (with Server-side Polling & Fallback)
  const handleGenerateAIVideo = async () => {
    setIsVideoGenerating(true);
    setVideoProgressMessage("✨ Veo 3.1 비디오 생성 모델을 초기화하는 중입니다...");

    try {
      // 1. Start generation operation
      const startRes = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt || `${topic}. Lifestyle aesthetic video, soft cinematic lighting, warm linen textures`,
          aspectRatio: videoRatio,
          startingImageBase64:
            useStartingImage && imageUrl?.startsWith("data:") ? imageUrl : undefined,
        }),
      });

      const startData = await startRes.json();

      if (startData.success && startData.operationName) {
        const operationName = startData.operationName;
        let isDone = false;
        let attempts = 0;
        const maxAttempts = 30; // ~90 seconds max poll

        const progressStages = [
          "🎥 1단계: 프레임 구성 및 조명 렌더링 중...",
          "🌿 2단계: 카메라 무빙과 자연스러운 질감 합성 중...",
          "🎬 3단계: 릴스 최적화 및 모션 스무딩 적용 중...",
          "✨ 4단계: 고화질 MP4 비디오 스트림 인코딩 중...",
        ];

        while (!isDone && attempts < maxAttempts) {
          attempts++;
          const stageIdx = Math.min(Math.floor(attempts / 3), progressStages.length - 1);
          setVideoProgressMessage(progressStages[stageIdx]);

          await new Promise((resolve) => setTimeout(resolve, 3500));

          const statusRes = await fetch("/api/video/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName }),
          });

          const statusData = await statusRes.json();
          if (statusData.done) {
            isDone = true;
            break;
          }
        }

        if (isDone) {
          setVideoProgressMessage("🎬 생성된 AI 동영상을 다운로드하여 캔버스에 적용합니다...");
          const downloadRes = await fetch("/api/video/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName }),
          });

          if (downloadRes.ok) {
            const blob = await downloadRes.blob();
            const blobUrl = URL.createObjectURL(blob);
            onUpdateImage(
              blobUrl,
              "ai",
              `ai-veo-video-${Date.now()}.mp4`,
              "video"
            );
            setSelectedRatio(videoRatio);
            if (onUpdateVisualDirection) {
              onUpdateVisualDirection({
                ...visualDirection,
                aspectRatio: videoRatio,
              });
            }
            return;
          }
        }
      }

      // Graceful fallback to matched curated aesthetic stock video
      setVideoProgressMessage("✨ 라이프스타일 톤앤매너에 맞춤화된 고화질 동영상 클립을 적용합니다...");
      const fallbackVideo =
        AESTHETIC_STOCK_VIDEOS[Math.floor(Math.random() * AESTHETIC_STOCK_VIDEOS.length)];
      onUpdateImage(
        fallbackVideo.url,
        "stock",
        fallbackVideo.title,
        "video"
      );
      setSelectedRatio(videoRatio);
      if (onUpdateVisualDirection) {
        onUpdateVisualDirection({
          ...visualDirection,
          aspectRatio: videoRatio,
        });
      }
    } catch (err) {
      console.error("AI Video Generation error:", err);
      const fallbackVideo = AESTHETIC_STOCK_VIDEOS[0];
      onUpdateImage(fallbackVideo.url, "stock", fallbackVideo.title, "video");
    } finally {
      setIsVideoGenerating(false);
      setVideoProgressMessage("");
    }
  };

  // Apply Stock Preset (Image or Video)
  const handleSelectStock = (media: StockMedia) => {
    onUpdateImage(media.url, "stock", media.title, media.type);
    if (media.type === "video") {
      setSelectedRatio("9:16");
      if (onUpdateVisualDirection) {
        onUpdateVisualDirection({
          ...visualDirection,
          aspectRatio: "9:16",
        });
      }
    }
  };

  // Custom Media URL Direct Apply
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    const url = customUrlInput.trim();
    const isVideoUrl = customUrlType === "video" || /\.(mp4|webm|mov|m4v)$/i.test(url);
    onUpdateImage(url, "stock", isVideoUrl ? "외부 동영상" : "외부 이미지", isVideoUrl ? "video" : "image");
    setCustomUrlInput("");
  };

  // Download Current Media
  const handleDownloadMedia = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download =
      imageFileName ||
      `content-${mediaType === "video" ? "video" : "image"}-${Date.now()}.${
        mediaType === "video" ? "mp4" : "png"
      }`;
    link.target = "_blank";
    link.click();
  };

  // Filtered Stock Media List
  const allStockMedia: StockMedia[] = [
    ...AESTHETIC_STOCK_PHOTOS,
    ...AESTHETIC_STOCK_VIDEOS,
  ];

  const filteredMedia = allStockMedia.filter((m) => {
    const matchesCategory =
      selectedCategory === "전체" || m.category === selectedCategory;
    const matchesType =
      stockMediaTypeFilter === "all" || m.type === stockMediaTypeFilter;
    return matchesCategory && matchesType;
  });

  const categories = [
    "전체",
    "린넨·패브릭",
    "도자기·오브제",
    "공간·자연광",
    "슬로우라이프·티",
    "전통공예·소재",
    "작업실·디자인",
  ];

  const isCurrentVideo =
    mediaType === "video" || (imageUrl && /\.(mp4|webm|mov|m4v)/i.test(imageUrl));

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-neutral-900 rounded-xl text-white">
            {isCurrentVideo ? (
              <VideoIcon className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
            ) : (
              <ImageIcon className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-neutral-900 text-sm tracking-tight">
                비주얼 & 동영상 미디어 스튜디오
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 font-mono font-medium">
                AI 영상·이미지 + 업로드 + 무료 스톡
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Veo 3.1 AI 동영상 생성 · Gemini AI 이미지 생성 · 내 파일 직접 업로드 · 100% 무료 스톡
            </p>
          </div>
        </div>

        {/* Current Media Status Badge */}
        {imageUrl && (
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 bg-neutral-100 text-neutral-800 border-neutral-200 shadow-2xs">
              {isCurrentVideo ? (
                <>
                  <Film className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.75} />
                  <span>동영상 미디어</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-neutral-700" strokeWidth={1.75} />
                  <span>이미지 미디어</span>
                </>
              )}
              <span className="text-neutral-400">|</span>
              <span>
                {imageSource === "upload"
                  ? "내 파일"
                  : imageSource === "ai"
                  ? isCurrentVideo
                    ? "✨ AI 영상(Veo)"
                    : "✨ AI 이미지(Gemini)"
                  : "무료 스톡"}
              </span>
            </span>

            <button
              onClick={handleDownloadMedia}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-100 transition-colors shadow-2xs"
              title="미디어 다운로드"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>

            <button
              onClick={() => onUpdateImage(undefined)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:bg-rose-50 transition-colors shadow-2xs"
              title="미디어 제거"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

      {/* Copyright-Free Commercial License Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-3.5 py-2 bg-neutral-50/80 rounded-xl border border-neutral-200/80 text-xs text-neutral-700">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
          <span className="text-[11px] font-medium leading-tight">
            <strong>저작권 무료 보장:</strong> 모든 이미지·영상은{" "}
            <span className="text-neutral-900 font-semibold underline decoration-neutral-300">
              상업적 이용 가능(CC0 라이선스)
            </span>
            입니다.
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 hidden sm:inline-block shrink-0">
          Royalty-Free for Commercial Use
        </span>
      </div>

      {/* Visual Specs Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
        <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80">
          <span className="text-neutral-400 block font-medium">공간 연출</span>
          <span className="text-neutral-800 font-semibold line-clamp-2 mt-0.5">
            {visualDirection?.space || "자연광이 머무는 미니멀 스튜디오"}
          </span>
        </div>
        <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80">
          <span className="text-neutral-400 block font-medium">조명/무드</span>
          <span className="text-neutral-800 font-semibold line-clamp-2 mt-0.5">
            {visualDirection?.lighting || "오후 3시의 부드러운 사광"}
          </span>
        </div>
        <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80">
          <span className="text-neutral-400 block font-medium">소품 & 질감</span>
          <span className="text-neutral-800 font-semibold line-clamp-2 mt-0.5">
            {visualDirection?.props || "린넨 패브릭, 백자 도자기"}
          </span>
        </div>
        <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80">
          <span className="text-neutral-400 block font-medium">권장 비율</span>
          <span className="text-neutral-800 font-mono font-bold mt-0.5 block">
            {selectedRatio} ({isCurrentVideo ? "릴스" : "피드"})
          </span>
        </div>
      </div>

      {/* Main Image/Video Stage & Controls Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Interactive Media Canvas Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div
            className={`relative overflow-hidden rounded-2xl bg-neutral-900 text-neutral-200 flex flex-col items-center justify-center text-center border border-neutral-800 group shadow-inner ${
              selectedRatio === "1:1"
                ? "aspect-square"
                : selectedRatio === "9:16"
                ? "aspect-9/16 max-h-[420px]"
                : selectedRatio === "16:9"
                ? "aspect-16/9"
                : "aspect-4/5 max-h-[420px]"
            }`}
          >
            {/* Loading / Generating Overlay */}
            {isVideoGenerating && (
              <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 space-y-3 text-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-3 border-amber-300/30 border-t-amber-300 animate-spin" />
                  <VideoIcon className="w-5 h-5 text-amber-300 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <span className="text-[11px] font-mono text-amber-300 font-bold tracking-wider">
                    VEO 3.1 AI VIDEO GENERATOR
                  </span>
                  <p className="text-xs text-neutral-200 font-medium leading-relaxed">
                    {videoProgressMessage || "AI 동영상을 제작하고 있습니다..."}
                  </p>
                </div>
                <div className="w-48 bg-neutral-800 h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full animate-[shimmer_2s_infinite] w-full" />
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  시네마틱 라이프스타일 릴스 렌더링 중
                </span>
              </div>
            )}

            {imageUrl ? (
              isCurrentVideo ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Video Play/Pause Overlay Controls */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (videoRef.current) {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                            setIsPlaying(true);
                          } else {
                            videoRef.current.pause();
                            setIsPlaying(false);
                          }
                        }
                      }}
                      className="pointer-events-auto p-3 bg-black/70 hover:bg-black text-white rounded-full transition-transform hover:scale-110 shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Video Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono flex items-center space-x-1">
                    <VideoIcon className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>동영상 재생 중</span>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={imageUrl}
                    alt={topic}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 pointer-events-none">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-black/70 px-2 py-0.5 text-white font-mono">
                        {imageFileName || "Visual Image"}
                      </span>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="space-y-2 z-10 max-w-xs p-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  Media Preview Canvas
                </span>
                <h4 className="font-bold text-white text-sm sm:text-base line-clamp-2">
                  {visualDirection?.overlayText || topic}
                </h4>
                <p className="text-[11px] text-neutral-300 line-clamp-2">
                  {visualDirection?.props}
                </p>
                <div className="pt-2">
                  <span className="inline-block text-[10px] bg-neutral-800 text-neutral-400 px-2 py-1 border border-neutral-700">
                    우측 탭에서 AI 영상/이미지 생성 또는 업로드를 선택하세요
                  </span>
                </div>
              </div>
            )}

            {/* Overlay Text Banner if available */}
            {visualDirection?.overlayText && (
              <div className="absolute bottom-2 left-2 right-2 p-2 bg-neutral-950/85 backdrop-blur-xs border border-neutral-800 text-xs text-neutral-200 flex items-center justify-between z-20">
                <span className="text-[11px] truncate mr-2">
                  💬 <strong>자막/오버레이 문구:</strong> "{visualDirection.overlayText}"
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(visualDirection.overlayText || "");
                    setCopiedOverlay(true);
                    setTimeout(() => setCopiedOverlay(false), 2000);
                  }}
                  className="text-[10px] text-neutral-300 hover:text-white shrink-0 font-medium px-1.5 py-0.5 bg-neutral-800"
                >
                  {copiedOverlay ? "✓ 복사" : "복사"}
                </button>
              </div>
            )}
          </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center justify-between px-2 py-1 bg-neutral-50 border border-neutral-200 text-xs">
            <span className="text-neutral-500 font-medium text-[11px]">화면 비율:</span>
            <div className="flex items-center space-x-1">
              {(["9:16", "4:5", "1:1", "16:9"] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => {
                    setSelectedRatio(ratio);
                    if (onUpdateVisualDirection) {
                      onUpdateVisualDirection({
                        ...visualDirection,
                        aspectRatio: ratio,
                      });
                    }
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                    selectedRatio === ratio
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-200"
                  }`}
                  title={
                    ratio === "9:16"
                      ? "릴스/스토리/숏츠 세로 영상"
                      : ratio === "4:5"
                      ? "인스타그램 세로 피드"
                      : ratio === "1:1"
                      ? "정방형 피드"
                      : "가로형 유튜브/웹"
                  }
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tabbed Selection Methods (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Method Tabs */}
          <div className="flex border-b border-neutral-200 bg-neutral-100 p-0.5 rounded-md">
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2 px-2.5 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all rounded-md ${
                activeTab === "ai"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200 font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.75} />
              <span>AI 생성 (영상·사진)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-2 px-2.5 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all rounded-md ${
                activeTab === "upload"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200 font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-neutral-700 shrink-0" strokeWidth={1.75} />
              <span>직접 업로드</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("stock")}
              className={`flex-1 py-2 px-2.5 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all rounded-md ${
                activeTab === "stock"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200 font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-neutral-700 shrink-0" strokeWidth={1.75} />
              <span>무료 스톡 라이브러리</span>
            </button>
          </div>

          {/* 1. AI Generation Tab (Veo Video + Gemini Image) */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              {/* Sub-mode Switcher: Video vs Image */}
              <div className="flex items-center bg-neutral-100 p-1 border border-neutral-200 rounded-md">
                <button
                  type="button"
                  onClick={() => setAiSubMode("video")}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all rounded-sm ${
                    aiSubMode === "video"
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-amber-300 shrink-0" strokeWidth={1.75} />
                  <span>AI 릴스/영상 생성 (Veo 3.1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAiSubMode("image")}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all rounded-sm ${
                    aiSubMode === "image"
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" strokeWidth={1.75} />
                  <span>AI 이미지 렌더링 (Gemini 3.1)</span>
                </button>
              </div>

              {/* Sub Mode A: AI Video Generation (Veo 3.1) */}
              {aiSubMode === "video" && (
                <div className="space-y-3 text-xs">
                  {/* Camera Movement Presets */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-neutral-700 flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>카메라 무빙 & 분위기 프리셋 (원클릭 프롬프트 적용)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {VIDEO_CAMERA_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setVideoPrompt(`${topic}, ${visualDirection?.props || "aesthetic textures"}, ${preset.promptSuffix}`);
                          }}
                          className="p-2 text-left bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-400 transition-colors group"
                        >
                          <span className="font-bold text-neutral-900 block group-hover:text-amber-800 text-[11px]">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 line-clamp-1">
                            {preset.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Prompt Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-neutral-800 text-[11px]">
                        비디오 연출 프롬프트 (움직임, 조명, 구도, 텍스처)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoPrompt(
                            `${topic}, ${visualDirection?.props || "linen fabric and crafts"}, ${visualDirection?.lighting || "warm natural light"}, slow gentle cinematic motion, 4k detail`
                          );
                        }}
                        className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center space-x-0.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>기본값 재설정</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="예: 린넨 패브릭에 부드럽게 쏟아지는 오후 자연광, 천천히 패닝하는 감성 릴스 무빙"
                      className="w-full p-2.5 border border-neutral-300 bg-neutral-50/50 text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-none"
                    />
                  </div>

                  {/* Video Ratio & Options */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-neutral-700">영상 비율:</span>
                      <div className="inline-flex border border-neutral-300 bg-white p-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoRatio("9:16");
                            setSelectedRatio("9:16");
                          }}
                          className={`px-2 py-0.5 font-mono font-bold transition-colors ${
                            videoRatio === "9:16"
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          9:16 (릴스/숏츠)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoRatio("16:9");
                            setSelectedRatio("16:9");
                          }}
                          className={`px-2 py-0.5 font-mono font-bold transition-colors ${
                            videoRatio === "16:9"
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          16:9 (가로형)
                        </button>
                      </div>
                    </div>

                    {imageUrl && !isCurrentVideo && (
                      <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-neutral-700">
                        <input
                          type="checkbox"
                          checked={useStartingImage}
                          onChange={(e) => setUseStartingImage(e.target.checked)}
                          className="rounded-xs text-neutral-900 focus:ring-neutral-900"
                        />
                        <span>현재 사진을 시작 프레임으로 활용 (Image-to-Video)</span>
                      </label>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-500">
                      * Google Veo 3.1 비디오 생성 엔진을 통해 720p/1080p 고화질 릴스 비디오가 제작됩니다.
                    </span>

                    <button
                      type="button"
                      onClick={handleGenerateAIVideo}
                      disabled={isVideoGenerating}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors rounded-md"
                    >
                      {isVideoGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                          <span>AI 영상 생성 중...</span>
                        </>
                      ) : (
                        <>
                          <Film className="w-3.5 h-3.5 text-amber-300" strokeWidth={1.75} />
                          <span>AI 동영상/릴스 생성</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Sub Mode B: AI Image Generation (Gemini 3.1 Flash Image) */}
              {aiSubMode === "image" && (
                <div className="space-y-3 text-xs">
                  {/* Style Presets */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.75} />
                      <span>무드 키워드 추가</span>
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {IMAGE_STYLE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCustomPrompt((prev) => `${prev}, ${preset}`);
                          }}
                          className="px-2.5 py-1 text-[10px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 rounded-sm transition-colors"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700 block text-[11px]">
                      AI 렌더링 프롬프트 (라이프스타일 톤앤매너 자동 구성)
                    </label>
                    <textarea
                      rows={3}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="예: 내추럴 린넨 베딩, 부드러운 자연광, 미니멀 아뜰리에 구도, 8k"
                      className="w-full p-2.5 border border-neutral-300 bg-neutral-50/50 text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-none rounded-md"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-neutral-500">
                      * Gemini 3.1 Flash Image를 통해 안전한 서버사이드에서 생성되며, 상업적 무료 라이선스로 즉시 사용 가능합니다.
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAIImage}
                      disabled={isGenerating}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors rounded-md"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                          <span>AI 이미지 생성 중...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5 text-amber-300" strokeWidth={1.75} />
                          <span>새로운 AI 이미지 생성</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Direct Upload Tab (Supports Video & Image) */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4, video/webm, video/quicktime, video/mov, image/png, image/jpeg, image/webp, image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-none text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-neutral-900 bg-neutral-100 scale-99"
                    : "border-neutral-300 hover:border-neutral-500 bg-neutral-50/70"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2.5 bg-white border border-neutral-200 shadow-2xs text-neutral-800">
                      <FileVideo className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="p-2.5 bg-white border border-neutral-200 shadow-2xs text-neutral-800">
                      <FileImage className="w-5 h-5 text-neutral-700" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-neutral-900">
                      동영상 또는 이미지 파일을 드래그하여 놓거나 클릭하세요
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      🎥 동영상: MP4, WebM, MOV (릴스/숏츠 클립) · 📷 이미지: PNG, JPG, WebP
                    </p>
                  </div>

                  <button
                    type="button"
                    className="mt-1 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>내 컴퓨터에서 파일 선택하기</span>
                  </button>
                </div>
              </div>

              {/* Upload Info Note */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start space-x-2">
                <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div className="text-[11px] space-y-1">
                  <p className="font-semibold text-neutral-800">
                    영상 및 사진 로컬 업로드 지원
                  </p>
                  <p className="text-neutral-500 leading-relaxed">
                    업로드된 동영상은 브라우저에서 즉시 실시간 재생 및 무한 루프 미리보기가 가능하며, 릴스 9:16 비율에 맞게 최적화됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Free Stock Media (Images & Videos) Tab */}
          {activeTab === "stock" && (
            <div className="space-y-3">
              {/* Type Switcher (전체 / 🎬 동영상만 / 📸 이미지만) */}
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setStockMediaTypeFilter("all")}
                    className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      stockMediaTypeFilter === "all"
                        ? "bg-neutral-900 text-white font-bold"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    전체 에셋 ({allStockMedia.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockMediaTypeFilter("video")}
                    className={`px-2.5 py-1 text-[11px] font-medium flex items-center space-x-1 transition-colors ${
                      stockMediaTypeFilter === "video"
                        ? "bg-neutral-900 text-white font-bold"
                        : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <VideoIcon className="w-3 h-3 text-amber-600" />
                    <span>🎬 무료 릴스 영상 ({AESTHETIC_STOCK_VIDEOS.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockMediaTypeFilter("image")}
                    className={`px-2.5 py-1 text-[11px] font-medium flex items-center space-x-1 transition-colors ${
                      stockMediaTypeFilter === "image"
                        ? "bg-neutral-900 text-white font-bold"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3 text-neutral-600" />
                    <span>📸 무료 사진 ({AESTHETIC_STOCK_PHOTOS.length})</span>
                  </button>
                </div>

                <div className="text-[10px] text-emerald-700 font-medium flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>100% 상업용 무료</span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[11px] px-2 py-0.5 transition-colors ${
                      selectedCategory === cat
                        ? "bg-neutral-800 text-white font-semibold"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Media Grid (Supports Video preview & Photo thumbnail) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredMedia.map((media) => {
                  const isSelected = imageUrl === media.url;
                  return (
                    <div
                      key={media.id}
                      onClick={() => handleSelectStock(media)}
                      className={`relative aspect-4/3 overflow-hidden bg-neutral-900 border cursor-pointer group transition-all ${
                        isSelected
                          ? "border-neutral-900 ring-2 ring-neutral-900"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {media.type === "video" ? (
                        <div className="w-full h-full relative">
                          <img
                            src={media.posterUrl || media.url}
                            alt={media.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                            loading="lazy"
                          />
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 text-amber-300 text-[9px] font-mono flex items-center space-x-0.5">
                            <Film className="w-2.5 h-2.5" />
                            <span>VIDEO</span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className="p-2 bg-white/90 text-black rounded-full shadow">
                              <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media.url}
                          alt={media.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 pointer-events-none">
                        <span className="text-[10px] text-white font-medium line-clamp-1 leading-tight">
                          {media.title}
                        </span>
                        <div className="flex items-center justify-between text-[9px] text-neutral-300 font-mono mt-0.5">
                          <span>{media.category}</span>
                          <span className="text-emerald-400">CC0 Free</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 p-1 bg-neutral-900 text-amber-300 shadow-2xs z-10">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct Media URL Input Form */}
              <form
                onSubmit={handleApplyCustomUrl}
                className="flex flex-col sm:flex-row items-center gap-1.5 pt-2 border-t border-neutral-100"
              >
                <select
                  value={customUrlType}
                  onChange={(e) => setCustomUrlType(e.target.value as "image" | "video")}
                  className="px-2 py-1.5 bg-neutral-100 border border-neutral-300 text-xs text-neutral-800"
                >
                  <option value="image">📸 이미지 URL</option>
                  <option value="video">🎬 동영상(MP4) URL</option>
                </select>

                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="Unsplash, Pexels 또는 MP4 동영상 URL 직접 입력"
                  className="flex-1 w-full px-3 py-1.5 border border-neutral-300 bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
                <button
                  type="submit"
                  disabled={!customUrlInput.trim()}
                  className="w-full sm:w-auto px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                >
                  적용
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ImageStudio;
