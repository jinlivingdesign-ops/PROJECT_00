import React, { useState, useRef } from "react";
import { InspirationLog } from "../types";
import { AESTHETIC_STOCK_PHOTOS } from "../data/stockPhotos";
import {
  BookOpen,
  Plus,
  Sparkles,
  Compass,
  Tag,
  CalendarDays,
  Layers,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Share2,
  UploadCloud,
  Image as ImageIcon,
  Film,
  X,
  MapPin,
  Lightbulb,
} from "lucide-react";

interface InspirationArchiveProps {
  inspirations: InspirationLog[];
  onAddInspiration: (log: InspirationLog) => void;
  onDeleteInspiration: (id: string) => void;
  onOpenWizardWithInspiration: (inspire: InspirationLog) => void;
}

export const InspirationArchive: React.FC<InspirationArchiveProps> = ({
  inspirations,
  onAddInspiration,
  onDeleteInspiration,
  onOpenWizardWithInspiration,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [locationOrSource, setLocationOrSource] = useState("");
  const [category, setCategory] = useState<InspirationLog["category"]>("도시답사");
  const [observation, setObservation] = useState("");
  const [discovery, setDiscovery] = useState("");
  const [brandPerspective, setBrandPerspective] = useState("");
  const [designLink, setDesignLink] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [imageSource, setImageSource] = useState<"upload" | "ai" | "stock" | undefined>(undefined);
  const [imageFileName, setImageFileName] = useState<string | undefined>(undefined);
  const [isGeneratingSeries, setIsGeneratingSeries] = useState<string | null>(null);
  const [generatedSeriesMap, setGeneratedSeriesMap] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setMediaType(isVideo ? "video" : "image");
          setImageSource("upload");
          setImageFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !observation.trim()) return;

    const newLog: InspirationLog = {
      id: `inspire-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title,
      locationOrSource,
      category,
      observation,
      discovery,
      brandPerspective,
      designLink,
      imageUrl,
      mediaType,
      imageSource,
      imageFileName,
      tags: tagInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
    };

    onAddInspiration(newLog);
    setTitle("");
    setLocationOrSource("");
    setObservation("");
    setDiscovery("");
    setBrandPerspective("");
    setDesignLink("");
    setTagInput("");
    setImageUrl(undefined);
    setMediaType("image");
    setImageSource(undefined);
    setImageFileName(undefined);
    setIsAdding(false);
  };

  const handleGenerateSeries = async (item: InspirationLog) => {
    setIsGeneratingSeries(item.id);
    try {
      const res = await fetch("/api/content/inspire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inspirationNote: `${item.title} - ${item.observation}. ${item.discovery}`,
          locationOrTopic: item.locationOrSource,
          brandContext: item.brandPerspective,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedSeriesMap((prev) => ({
          ...prev,
          [item.id]: data.data,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSeries(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-neutral-900 text-amber-300">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.75} />
            </span>
            <span className="text-xs font-semibold text-neutral-600 tracking-wide">
              INSPIRATION & RESEARCH ARCHIVE
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900 mt-1 tracking-tight">
            영감 및 리서치 스크랩북
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            제품을 만들기 이전의 조사, 관찰, 도시 답사, 전시, 문화 레퍼런스를 기록하고 브랜드 스토리로 발전시킵니다.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} />
          <span>새 영감 기록하기</span>
        </button>
      </div>

      {/* 4-Step Framework Explainer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          <span className="font-mono font-bold text-neutral-400 block text-[11px]">STEP 01</span>
          <strong className="text-neutral-900 block mt-0.5 font-semibold">관찰 (Observation)</strong>
          <p className="text-neutral-500 text-[11px] mt-1">우리가 무엇을 보고 있는가</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          <span className="font-mono font-bold text-neutral-400 block text-[11px]">STEP 02</span>
          <strong className="text-neutral-900 block mt-0.5 font-semibold">발견 (Discovery)</strong>
          <p className="text-neutral-500 text-[11px] mt-1">왜 이것이 흥미로운가</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          <span className="font-mono font-bold text-neutral-400 block text-[11px]">STEP 03</span>
          <strong className="text-neutral-900 block mt-0.5 font-semibold">브랜드 관점 (Perspective)</strong>
          <p className="text-neutral-500 text-[11px] mt-1">우리 브랜드는 어떻게 해석하는가</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          <span className="font-mono font-bold text-neutral-400 block text-[11px]">STEP 04</span>
          <strong className="text-neutral-900 block mt-0.5 font-semibold">디자인 연결 (Design Link)</strong>
          <p className="text-neutral-500 text-[11px] mt-1">어떤 제품과 콘텐츠로 이어지는가</p>
        </div>
      </div>

      {/* Add Inspiration Form Modal / Collapsible */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-900 text-sm">
              새로운 영감 & 리서치 기록
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-neutral-700 block mb-1">
                영감 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 도쿄 긴자 텍스타일 숍 자연광 VMD 답사"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-neutral-900"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as InspirationLog["category"])
                }
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="도시답사">도시답사</option>
                <option value="소재연구">소재연구</option>
                <option value="전시/예술">전시/예술</option>
                <option value="건축/공간">건축/공간</option>
                <option value="패턴/컬러">패턴/컬러</option>
                <option value="일상관찰">일상관찰</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              장소 또는 출처 / 도록
            </label>
            <input
              type="text"
              value={locationOrSource}
              onChange={(e) => setLocationOrSource(e.target.value)}
              placeholder="예: 도쿄 긴자 골목길, 국립박물관 특별전 도록 등"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                1. 관찰 (무엇을 보았는가)
              </label>
              <textarea
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="예: 창가로 들어오는 자연광에 패브릭의 잔주름이 빛나는 모습"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white resize-none leading-relaxed"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                2. 발견 (왜 흥미로운가)
              </label>
              <textarea
                rows={2}
                value={discovery}
                onChange={(e) => setDiscovery(e.target.value)}
                placeholder="예: 빳빳함보다 자연스러운 구김이 주는 편안한 여유"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                3. 브랜드 관점 (우리만의 해석)
              </label>
              <textarea
                rows={2}
                value={brandPerspective}
                onChange={(e) => setBrandPerspective(e.target.value)}
                placeholder="예: 완벽한 호텔 베딩 대신 일상의 온기를 주는 린넨 철학"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white resize-none leading-relaxed"
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                4. 디자인 연결 (어떤 제품/콘텐츠로)
              </label>
              <textarea
                rows={2}
                value={designLink}
                onChange={(e) => setDesignLink(e.target.value)}
                placeholder="예: 워시드 린넨 베딩 촬영 가이드 및 Threads 사유글"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Image Attachment Section */}
          <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-800 flex items-center space-x-1.5 text-xs">
                <ImageIcon className="w-3.5 h-3.5 text-neutral-600" strokeWidth={1.75} />
                <span>영감 사진 / 레퍼런스 이미지 첨부</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl(undefined);
                    setImageSource(undefined);
                    setImageFileName(undefined);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-red-600 flex items-center space-x-0.5 transition-colors"
                >
                  <X className="w-3 h-3" strokeWidth={1.75} />
                  <span>삭제</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4, video/webm, video/quicktime, video/mov, image/png, image/jpeg, image/webp"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {imageUrl ? (
              <div className="relative h-28 w-full overflow-hidden rounded-xl border border-neutral-200 bg-black">
                {mediaType === "video" || /\.(mp4|webm|mov|m4v)/i.test(imageUrl) ? (
                  <video
                    src={imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt="Inspiration Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-black/70 text-white text-[9px] font-mono rounded-md">
                  {imageSource === "upload" ? (mediaType === "video" ? "🎬 내 영상" : "📷 내 사진") : "감성 프리셋"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50 text-xs font-medium shadow-2xs transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.75} />
                  <span>내 사진/동영상 업로드</span>
                </button>

                <span className="text-[11px] text-neutral-400">또는 추천 프리셋:</span>

                <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                  {AESTHETIC_STOCK_PHOTOS.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setImageUrl(p.url);
                        setMediaType("image");
                        setImageSource("stock");
                        setImageFileName(p.title);
                      }}
                      className="shrink-0 text-[10px] px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-700 transition-colors"
                    >
                      {p.category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="예: 도쿄, 린넨, 자연광, VMD"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs transition-colors"
            >
              영감 저장하기
            </button>
          </div>
        </form>
      )}

      {/* Inspirations List */}
      <div className="space-y-4">
        {inspirations.map((item) => {
          const generatedSeries = generatedSeriesMap[item.id];
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-neutral-100">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    {item.date}
                  </span>
                  {item.locationOrSource && (
                    <span className="text-xs text-neutral-500 truncate max-w-[200px]">
                      📍 {item.locationOrSource}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 sm:pt-0">
                  <button
                    onClick={() => handleGenerateSeries(item)}
                    disabled={isGeneratingSeries === item.id}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isGeneratingSeries === item.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                        <span>시리즈 기획 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.75} />
                        <span>AI 시리즈 기획</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenWizardWithInspiration(item)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium transition-colors shadow-2xs"
                  >
                    <span>플랜 만들기</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>

                  <button
                    onClick={() => onDeleteInspiration(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-50 transition-colors ml-auto sm:ml-0"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Title & Attached Photo */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <h2 className="font-bold text-neutral-900 text-base sm:text-lg flex-1 tracking-tight">
                  {item.title}
                </h2>
                {item.imageUrl && (
                  <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden border border-neutral-200 shrink-0 bg-black shadow-2xs">
                    {item.mediaType === "video" || /\.(mp4|webm|mov|m4v)/i.test(item.imageUrl) ? (
                      <video
                        src={item.imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 bg-black/75 text-white text-[8px] font-mono rounded-md">
                      {item.imageSource === "upload"
                        ? item.mediaType === "video"
                          ? "내 영상"
                          : "내 파일"
                        : "프리셋"}
                    </span>
                  </div>
                )}
              </div>

              {/* 4-Step Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-200/60">
                  <span className="font-semibold text-neutral-700 flex items-center space-x-1.5 mb-1">
                    <Compass className="w-3.5 h-3.5 text-neutral-500 shrink-0" strokeWidth={1.75} />
                    <span>1. 관찰 (Observation)</span>
                  </span>
                  <p className="text-neutral-700 leading-relaxed">{item.observation}</p>
                </div>
                <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-200/60">
                  <span className="font-semibold text-neutral-700 flex items-center space-x-1.5 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.75} />
                    <span>2. 발견 (Discovery)</span>
                  </span>
                  <p className="text-neutral-700 leading-relaxed">{item.discovery}</p>
                </div>
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-900 flex items-center space-x-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.75} />
                    <span>3. 브랜드 관점 (Perspective)</span>
                  </span>
                  <p className="text-amber-950 leading-relaxed">
                    {item.brandPerspective}
                  </p>
                </div>
                <div className="p-3.5 bg-neutral-100/90 rounded-xl border border-neutral-200/80">
                  <span className="font-semibold text-neutral-900 flex items-center space-x-1.5 mb-1">
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-700 shrink-0" strokeWidth={1.75} />
                    <span>4. 디자인 연결 (Design Link)</span>
                  </span>
                  <p className="text-neutral-900 leading-relaxed">
                    {item.designLink}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Generated Series Ideas (if triggered) */}
              {generatedSeries && (
                <div className="mt-3 p-5 bg-neutral-900 text-neutral-100 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>{generatedSeries.inspirationTitle || "연계 콘텐츠 시리즈"}</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">AI GENERATED ARC</span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {generatedSeries.coreObservation} → {generatedSeries.brandConnection}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {(generatedSeries.seriesIdeas || []).map((idea: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-800/90 rounded-xl border border-neutral-700/80 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="font-bold text-amber-300">Step 0{idea.step || idx + 1}</span>
                          <span className="bg-neutral-700 px-2 py-0.5 rounded-md text-white font-medium">{idea.channel}</span>
                        </div>
                        <p className="font-semibold text-white text-xs line-clamp-1">{idea.topic}</p>
                        <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">{idea.sampleCopy || idea.angle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
