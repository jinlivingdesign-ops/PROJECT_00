import React from "react";
import {
  CalendarDays,
  Sparkles,
  Compass,
  SlidersHorizontal,
  Clock3,
  Flame,
  ArrowRight,
} from "lucide-react";

interface HeaderProps {
  currentView: "calendar" | "editor" | "inspirations";
  setCurrentView: (view: "calendar" | "editor" | "inspirations") => void;
  onOpenWizard: (type: "weekly" | "monthly") => void;
  onSelectToday: () => void;
  onNewInspiration: () => void;
  brandName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenWizard,
  onSelectToday,
  onNewInspiration,
  brandName,
}) => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${
    ["일", "월", "화", "수", "목", "금", "토"][today.getDay()]
  })`;

  return (
    <header className="border-b border-neutral-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand & Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0 rounded-lg shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 truncate">
                <span className="font-bold text-neutral-900 text-sm sm:text-base tracking-tight truncate">
                  SNS 에디터 스튜디오
                </span>
                {brandName && (
                  <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full border border-neutral-200/80 hidden sm:inline-block">
                    {brandName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Modern Segmented Control */}
          <nav className="flex items-center bg-neutral-100/90 p-1 rounded-lg border border-neutral-200/60 overflow-x-auto no-scrollbar shrink-0">
            <button
              id="nav-calendar-btn"
              onClick={() => setCurrentView("calendar")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 ${
                currentView === "calendar"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>콘텐츠 플랜</span>
            </button>

            <button
              id="nav-editor-btn"
              onClick={() => setCurrentView("editor")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 ${
                currentView === "editor"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>제작 스튜디오</span>
            </button>

            <button
              id="nav-inspiration-btn"
              onClick={() => setCurrentView("inspirations")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 ${
                currentView === "inspirations"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>영감 & 리서치</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="quick-today-btn"
              onClick={onSelectToday}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 text-xs font-medium rounded-lg transition-colors shadow-2xs"
              title="오늘 날짜 콘텐츠 보기"
            >
              <Clock3 className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.75} />
              <span>오늘 콘텐츠</span>
            </button>

            <button
              id="create-plan-dropdown-btn"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
              onClick={() => onOpenWizard("weekly")}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" strokeWidth={1.75} />
              <span className="hidden sm:inline">계획 만들기</span>
              <span className="sm:hidden">생성</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
