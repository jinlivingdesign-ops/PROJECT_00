import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CalendarView } from "./components/CalendarView";
import { ContentDetailStudio } from "./components/ContentDetailStudio";
import { InspirationArchive } from "./components/InspirationArchive";
import { PlanWizardModal } from "./components/PlanWizardModal";
import { PublishReadyModal } from "./components/PublishReadyModal";
import { ContentPlan, ContentItem, InspirationLog, ContentStatus } from "./types";
import { INITIAL_WEEKLY_PLAN, INITIAL_INSPIRATIONS } from "./data/initialData";
import {
  Sparkles,
  Calendar as CalendarIcon,
  Layers,
  BookOpen,
  Clock,
  Plus,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function App() {
  // 1. Persistence State
  const [currentPlan, setCurrentPlan] = useState<ContentPlan>(() => {
    try {
      const saved = localStorage.getItem("aura_content_plan");
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_PLAN;
    } catch {
      return INITIAL_WEEKLY_PLAN;
    }
  });

  const [inspirations, setInspirations] = useState<InspirationLog[]>(() => {
    try {
      const saved = localStorage.getItem("aura_inspirations");
      return saved ? JSON.parse(saved) : INITIAL_INSPIRATIONS;
    } catch {
      return INITIAL_INSPIRATIONS;
    }
  });

  // 2. View & Navigation State
  const [currentView, setCurrentView] = useState<"calendar" | "editor" | "inspirations">("calendar");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(() => {
    return currentPlan.items?.[0] || null;
  });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<"weekly" | "monthly">("weekly");
  const [publishModalItem, setPublishModalItem] = useState<ContentItem | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aura_content_plan", JSON.stringify(currentPlan));
    } catch (e) {
      console.error(e);
    }
  }, [currentPlan]);

  useEffect(() => {
    try {
      localStorage.setItem("aura_inspirations", JSON.stringify(inspirations));
    } catch (e) {
      console.error(e);
    }
  }, [inspirations]);

  // Handler: Open wizard
  const handleOpenWizard = (type: "weekly" | "monthly") => {
    setWizardType(type);
    setIsWizardOpen(true);
  };

  // Handler: Select today's item
  const handleSelectToday = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const found = currentPlan.items?.find((item) => item.date === todayStr);
    if (found) {
      setSelectedItem(found);
      setCurrentView("editor");
    } else if (currentPlan.items && currentPlan.items.length > 0) {
      // Default to first item
      setSelectedItem(currentPlan.items[0]);
      setCurrentView("editor");
    }
  };

  // Handler: Update a single item
  const handleUpdateItem = (updated: ContentItem) => {
    setSelectedItem(updated);
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === updated.id ? updated : it)),
    }));
  };

  // Handler: Update status from calendar
  const handleStatusChange = (itemId: string, newStatus: ContentStatus) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              status: newStatus,
              publishedAt:
                newStatus === "게시 완료"
                  ? new Date().toISOString()
                  : it.publishedAt,
            }
          : it
      ),
    }));
    if (selectedItem?.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Handler: Toggle English inclusion for an item from Calendar
  const handleToggleItemEnglish = (itemId: string, include: boolean) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              includeEnglish: include,
            }
          : it
      ),
    }));
    if (selectedItem?.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, includeEnglish: include } : null));
    }
  };

  // Handler: Add a new custom day to current plan
  const handleAddNewItem = () => {
    const lastItem = currentPlan.items[currentPlan.items.length - 1];
    const newDate = new Date();
    if (lastItem) {
      const d = new Date(lastItem.date);
      d.setDate(d.getDate() + 1);
      newDate.setTime(d.getTime());
    }
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      date: newDate.toISOString().slice(0, 10),
      dayOfWeek: days[newDate.getDay()],
      topic: "새로운 브랜드 이야기와 제품 소개",
      purpose: "브랜드 철학과 감각적인 일상 연결",
      contentType: "라이프스타일",
      channel: "Instagram Feed",
      status: "기획",
      coreMessage: "자연스러운 일상의 편안함과 소재의 온기를 전합니다.",
      depthLayer: "STORY",
      copywriting: {
        feedText: "일상 속에서 마주하는 작은 쉼표. 공간과 마음을 정돈하는 텍스타일 이야기.",
      },
      visualDirection: {
        space: "따스한 자연광이 드는 창가",
        props: "린넨 패브릭과 내추럴 오브제",
        lighting: "은은한 오후 사광",
        composition: "정갈하고 미니멀한 구도",
        aspectRatio: "4:5",
        overlayText: "Everyday Warmth & Texture",
      },
      hashtags: ["#라이프스타일", `#${currentPlan.brandName || "브랜드"}`],
    };

    setCurrentPlan((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setSelectedItem(newItem);
    setCurrentView("editor");
  };

  // Handler: Add new inspiration
  const handleAddInspiration = (log: InspirationLog) => {
    setInspirations([log, ...inspirations]);
  };

  // Handler: Delete inspiration
  const handleDeleteInspiration = (id: string) => {
    setInspirations(inspirations.filter((i) => i.id !== id));
  };

  // Handler: Pipe inspiration into plan generator
  const handleOpenWizardWithInspiration = (inspire: InspirationLog) => {
    setIsWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 flex flex-col font-sans selection:bg-neutral-200">
      {/* Top Main Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenWizard={handleOpenWizard}
        onSelectToday={handleSelectToday}
        onNewInspiration={() => setCurrentView("inspirations")}
        brandName={currentPlan.brandName}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 1. Calendar & Schedule View */}
        {currentView === "calendar" && (
          <CalendarView
            plan={currentPlan}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setCurrentView("editor");
            }}
            onStatusChange={handleStatusChange}
            onAddNewItem={handleAddNewItem}
            onOpenWizard={handleOpenWizard}
            onToggleItemEnglish={handleToggleItemEnglish}
          />
        )}

        {/* 2. Detail Content & Multi-Channel Studio */}
        {currentView === "editor" && selectedItem && (
          <ContentDetailStudio
            item={selectedItem}
            onUpdateItem={handleUpdateItem}
            onBackToCalendar={() => setCurrentView("calendar")}
            onOpenPublishModal={(item) => setPublishModalItem(item)}
          />
        )}

        {/* 3. Inspirations Archive Notebook */}
        {currentView === "inspirations" && (
          <InspirationArchive
            inspirations={inspirations}
            onAddInspiration={handleAddInspiration}
            onDeleteInspiration={handleDeleteInspiration}
            onOpenWizardWithInspiration={handleOpenWizardWithInspiration}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-4 px-4 text-center text-xs text-neutral-400">
        <p className="font-medium">
          SNS 콘텐츠 에디터 스튜디오 • Lifestyle Brand SNS Content & Storytelling System
        </p>
      </footer>

      {/* Modals */}
      <PlanWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        defaultType={wizardType}
        onPlanCreated={(newPlan) => {
          setCurrentPlan(newPlan);
          setSelectedItem(newPlan.items[0] || null);
          setCurrentView("calendar");
        }}
      />

      <PublishReadyModal
        item={publishModalItem}
        isOpen={!!publishModalItem}
        onClose={() => setPublishModalItem(null)}
        onMarkPublished={(itemId) => {
          handleStatusChange(itemId, "게시 완료");
        }}
      />
    </div>
  );
}
