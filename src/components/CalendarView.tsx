import React, { useState } from "react";
import {
  ContentItem,
  ContentPlan,
  ContentStatus,
  ContentType,
  ChannelType,
} from "../types";
import {
  CalendarDays,
  Filter,
  Plus,
  Sparkles,
  ChevronRight,
  Clock3,
  Instagram,
  CheckCircle2,
  AlertCircle,
  Eye,
  BarChart3,
  Globe,
  Film,
  Play,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  UploadCloud,
  SlidersHorizontal,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface CalendarViewProps {
  plan: ContentPlan;
  onSelectItem: (item: ContentItem) => void;
  onStatusChange: (itemId: string, newStatus: ContentStatus) => void;
  onAddNewItem: () => void;
  onOpenWizard: (type: "weekly" | "monthly") => void;
  onToggleItemEnglish?: (itemId: string, include: boolean) => void;
}

const STATUS_CONFIG: Record<
  ContentStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  기획: {
    label: "기획",
    bg: "bg-neutral-50",
    text: "text-neutral-600",
    border: "border-neutral-200",
  },
  "작성 중": {
    label: "작성 중",
    bg: "bg-neutral-100",
    text: "text-neutral-700 font-medium",
    border: "border-neutral-300",
  },
  "수정 필요": {
    label: "수정 필요",
    bg: "bg-neutral-100",
    text: "text-neutral-800 font-medium",
    border: "border-neutral-300",
  },
  "피드백 확인": {
    label: "피드백 확인",
    bg: "bg-neutral-100",
    text: "text-neutral-700 font-medium",
    border: "border-neutral-300",
  },
  "최종 완료": {
    label: "최종 완료",
    bg: "bg-neutral-100",
    text: "text-neutral-800 font-medium",
    border: "border-neutral-300",
  },
  "게시 완료": {
    label: "게시 완료",
    bg: "bg-neutral-800",
    text: "text-white font-medium",
    border: "border-neutral-800",
  },
};

const TYPE_COLORS: Record<ContentType, string> = {
  제품: "bg-neutral-100 text-neutral-800 border-neutral-300",
  라이프스타일: "bg-neutral-50 text-neutral-700 border-neutral-200",
  정보: "bg-neutral-50 text-neutral-600 border-neutral-200",
  "브랜드 스토리": "bg-neutral-100 text-neutral-800 border-neutral-300",
  "영감 및 리서치": "bg-neutral-100 text-neutral-700 border-neutral-200 font-medium",
  "공감 및 참여": "bg-neutral-50 text-neutral-600 border-neutral-200",
  판매: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

const CHANNEL_BADGES: Record<ChannelType, string> = {
  "Instagram Feed": "Feed",
  "Instagram Reels": "Reels",
  "Instagram Stories": "Stories",
  Threads: "Threads",
  Blog: "Blog",
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  plan,
  onSelectItem,
  onStatusChange,
  onAddNewItem,
  onOpenWizard,
  onToggleItemEnglish,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [selectedEnglishFilter, setSelectedEnglishFilter] = useState<string>("all");
  const [showMetrics, setShowMetrics] = useState(false);

  // Calculate ratio distribution
  const typeCounts = (plan.items || []).reduce((acc, item) => {
    acc[item.contentType] = (acc[item.contentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalItems = plan.items?.length || 1;

  // Filter items
  const filteredItems = (plan.items || []).filter((item) => {
    if (selectedTypeFilter !== "all" && item.contentType !== selectedTypeFilter) return false;
    if (selectedChannelFilter !== "all" && item.channel !== selectedChannelFilter) return false;
    if (selectedStatusFilter !== "all" && item.status !== selectedStatusFilter) return false;
    if (selectedEnglishFilter === "en_included" && !item.includeEnglish) return false;
    if (selectedEnglishFilter === "kr_only" && item.includeEnglish) return false;
    return true;
  });

  // Calculate 3-layer balance
  const layerCounts = (plan.items || []).reduce(
    (acc, item) => {
      acc[item.depthLayer] = (acc[item.depthLayer] || 0) + 1;
      return acc;
    },
    { PRODUCT: 0, STORY: 0, INSPIRATION: 0 } as Record<string, number>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Banner: Plan Overview */}
      <div className="bg-white border border-neutral-200/80 p-5 sm:p-6 rounded-2xl shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-neutral-900 text-white rounded-full">
                {plan.planType === "weekly" ? "주간 플랜 (7일)" : "월간 플랜"}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {plan.startDate} ~ {plan.endDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {plan.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 line-clamp-1 leading-relaxed">
              {plan.summary}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-start lg:self-center">
            <button
              onClick={() => onOpenWizard("weekly")}
              className="flex items-center space-x-1.5 px-3.5 py-2 border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
              <span>새 플랜 기획</span>
            </button>
            <button
              onClick={onAddNewItem}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>날짜 추가</span>
            </button>
          </div>
        </div>

        {/* Compact 3-Layer Balance Bar */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-neutral-800">3대 브랜드 층위 밸런스</span>
              <span className="text-neutral-300">|</span>
              <span className="text-[11px] text-neutral-500">
                Product {Math.round((layerCounts.PRODUCT / totalItems) * 100)}% · Story {Math.round((layerCounts.STORY / totalItems) * 100)}% · Inspiration {Math.round((layerCounts.INSPIRATION / totalItems) * 100)}%
              </span>
            </div>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center space-x-1 font-medium transition-colors"
            >
              <span>{showMetrics ? "지표 접기" : "지표 상세"}</span>
              {showMetrics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(layerCounts.PRODUCT / totalItems) * 100}%` }}
              className="bg-rose-400 h-full"
              title="PRODUCT"
            />
            <div
              style={{ width: `${(layerCounts.STORY / totalItems) * 100}%` }}
              className="bg-amber-400 h-full"
              title="STORY"
            />
            <div
              style={{ width: `${(layerCounts.INSPIRATION / totalItems) * 100}%` }}
              className="bg-neutral-400 h-full"
              title="INSPIRATION"
            />
          </div>

          {showMetrics && (
            <div className="mt-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-neutral-700 font-medium">Product ({layerCounts.PRODUCT}건)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-neutral-700 font-medium">Story ({layerCounts.STORY}건)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span className="text-neutral-700 font-medium">Inspiration ({layerCounts.INSPIRATION}건)</span>
                </span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>편중 없는 균형 피드 구성</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Filter & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 border border-neutral-200/80 rounded-xl text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-neutral-600 flex items-center space-x-1.5 text-xs shrink-0 pr-1">
            <Filter className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.75} />
            <span>필터</span>
          </span>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50/80 border border-neutral-200 rounded-lg text-neutral-800 text-xs font-medium focus:outline-hidden max-w-[130px] sm:max-w-none truncate hover:bg-neutral-100 transition-colors"
          >
            <option value="all">모든 유형 ({plan.items?.length})</option>
            <option value="영감 및 리서치">영감 및 리서치</option>
            <option value="브랜드 스토리">브랜드 스토리</option>
            <option value="라이프스타일">라이프스타일</option>
            <option value="정보">정보</option>
            <option value="제품">제품</option>
            <option value="공감 및 참여">공감 및 참여</option>
            <option value="판매">판매</option>
          </select>

          <select
            value={selectedChannelFilter}
            onChange={(e) => setSelectedChannelFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50/80 border border-neutral-200 rounded-lg text-neutral-800 text-xs font-medium focus:outline-hidden max-w-[110px] sm:max-w-none truncate hover:bg-neutral-100 transition-colors"
          >
            <option value="all">모든 채널</option>
            <option value="Instagram Feed">Instagram Feed</option>
            <option value="Instagram Reels">Instagram Reels</option>
            <option value="Instagram Stories">Instagram Stories</option>
            <option value="Threads">Threads</option>
            <option value="Blog">Blog</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50/80 border border-neutral-200 rounded-lg text-neutral-800 text-xs font-medium focus:outline-hidden max-w-[100px] sm:max-w-none truncate hover:bg-neutral-100 transition-colors"
          >
            <option value="all">모든 상태</option>
            <option value="기획">기획</option>
            <option value="작성 중">작성 중</option>
            <option value="수정 필요">수정 필요</option>
            <option value="피드백 확인">피드백 확인</option>
            <option value="최종 완료">최종 완료</option>
            <option value="게시 완료">게시 완료</option>
          </select>

          <select
            value={selectedEnglishFilter}
            onChange={(e) => setSelectedEnglishFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50/80 border border-neutral-200 rounded-lg text-neutral-800 text-xs font-medium focus:outline-hidden max-w-[110px] sm:max-w-none truncate hover:bg-neutral-100 transition-colors"
          >
            <option value="all">언어: 전체</option>
            <option value="en_included">영문 포함</option>
            <option value="kr_only">한국어 전용</option>
          </select>
        </div>

        <div className="text-neutral-500 text-xs font-medium self-end sm:self-auto">
          콘텐츠 <strong className="text-neutral-900 font-bold">{filteredItems.length}</strong> / {plan.items?.length}개
        </div>
      </div>

      {/* 3. Daily Content Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG["기획"];
          const typeBadge = TYPE_COLORS[item.contentType] || "bg-neutral-100 text-neutral-700 border-neutral-200";

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 hover:border-neutral-400/80 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              <div>
                {/* Header: Date, Day & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-neutral-900 text-sm">
                      {item.date.slice(5)} ({item.dayOfWeek})
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeBadge}`}>
                      {item.contentType}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <select
                      value={item.status}
                      onChange={(e) => onStatusChange(item.id, e.target.value as ContentStatus)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md border cursor-pointer ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border} focus:outline-hidden`}
                    >
                      <option value="기획">기획</option>
                      <option value="작성 중">작성 중</option>
                      <option value="수정 필요">수정 필요</option>
                      <option value="피드백 확인">피드백 확인</option>
                      <option value="최종 완료">최종 완료</option>
                      <option value="게시 완료">게시 완료</option>
                    </select>
                  </div>
                </div>

                {/* Topic Title */}
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base mt-3.5 line-clamp-2 group-hover:text-neutral-700 transition-colors tracking-tight">
                  {item.topic}
                </h3>

                {/* Visual Image / Video Thumbnail */}
                {item.imageUrl && (
                  <div className="mt-3.5 relative aspect-16/9 w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-200/80">
                    {item.mediaType === "video" || /\.(mp4|webm|mov|m4v)/i.test(item.imageUrl) ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.imageUrl}
                          muted
                          playsInline
                          loop
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                          <div className="p-2.5 bg-black/60 rounded-full text-white backdrop-blur-xs shadow-xs">
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" strokeWidth={1.75} />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-neutral-900/90 text-amber-300 font-mono font-bold text-[9px] rounded-md flex items-center space-x-1 shadow-2xs">
                          <Film className="w-3 h-3" strokeWidth={1.75} />
                          <span>REELS</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.topic}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-neutral-900/85 backdrop-blur-xs text-white font-medium text-[9px] rounded-md flex items-center space-x-1 shadow-2xs">
                      {item.imageSource === "upload" ? (
                        <>
                          <UploadCloud className="w-2.5 h-2.5 text-neutral-300" strokeWidth={1.75} />
                          <span>업로드</span>
                        </>
                      ) : item.imageSource === "ai" ? (
                        <>
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" strokeWidth={1.75} />
                          <span>AI 생성</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-2.5 h-2.5 text-neutral-300" strokeWidth={1.75} />
                          <span>스톡</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Core Message */}
                <p className="text-xs text-neutral-500 mt-2.5 line-clamp-2 leading-relaxed">
                  {item.coreMessage}
                </p>
              </div>

              {/* Card Footer: Channel & Jump button */}
              <div className="pt-3.5 mt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 bg-neutral-100 font-medium text-neutral-700 text-[11px] rounded-full">
                    {CHANNEL_BADGES[item.channel] || item.channel}
                  </span>

                  {item.includeEnglish && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 text-[10px] bg-neutral-900 text-amber-300 rounded-full font-bold shadow-2xs">
                      <Globe className="w-2.5 h-2.5" strokeWidth={1.75} />
                      <span>EN</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-neutral-800 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
                  <span>편집</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
