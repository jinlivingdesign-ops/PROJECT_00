import React, { useState } from "react";
import {
  Sparkles,
  X,
  CalendarDays,
  Layers,
  Compass,
  Palette,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wand2,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { ContentPlan } from "../types";

interface PlanWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: ContentPlan) => void;
  defaultType?: "weekly" | "monthly";
}

const PRESETS = [
  {
    name: "🌿 프리미엄 텍스타일 & 도쿄 긴자 리서치",
    brandName: "STUDIO ATELIER",
    brandConcept: "시간이 지나도 변치 않는 텍스타일과 일상의 온기",
    focusProducts: "워시드 린넨 베딩, 애쉬 핑크 & 오트 쿠션 커버",
    keyMessage: "자연스러운 주름과 오래된 회화의 색채에서 찾은 편안함",
    recentInspirations: "도쿄 긴자 텍스타일 숍 자연광 VMD, 국립박물관 전통 직물전",
    culturalReferences: "조선 조각보의 비대칭 균형, 앙리 마티스의 그레이시 컬러 팔레트",
    preferredChannels: ["Instagram Feed", "Instagram Reels", "Instagram Stories", "Threads", "Blog"],
    excludedTopics: "파격 세일, 마감 임박 등 자극적인 광고 문구",
  },
  {
    name: "🏺 세라믹 & 오브제 아뜰리에 (조선 책가도 & 미드센추리)",
    brandName: "ATELIER 숨(SOUM)",
    brandConcept: "비움과 채움의 미학을 담은 수공예 오브제와 테이블웨어",
    focusProducts: "달항아리 모티프 화병, 러스틱 매트 플레이트",
    keyMessage: "손끝의 미세한 흔적이 빚어내는 공간의 여백과 조용한 위로",
    recentInspirations: "성수동 공예 갤러리 전시, 교토 전통 가옥의 다도 공간",
    culturalReferences: "조선 백자의 담백한 곡선, 미드센추리 모던 가구와의 오브제 조화",
    preferredChannels: ["Instagram Feed", "Instagram Reels", "Threads"],
    excludedTopics: "공장형 대량생산 느낌의 설명",
  },
  {
    name: "🍵 티 & 슬로우 리빙 (한국 전통 다도 & 미니멀 웰니스)",
    brandName: "ON:CHASIL (온찻실)",
    brandConcept: "차를 우리는 시간 동안 회복하는 온전한 나만의 쉼",
    focusProducts: "계절 잎차 세트, 린넨 티매트, 내열 유리 다관",
    keyMessage: "물소리와 차향으로 하루의 속도를 늦추는 작은 의식",
    recentInspirations: "지리산 하동 야생 차밭 답사, 빗소리를 들으며 진행한 블렌딩 테스트",
    culturalReferences: "한국 전통 다도의 비움의 철학, 계절의 절기(소서/처서)와 텍스처",
    preferredChannels: ["Instagram Feed", "Instagram Stories", "Blog"],
    excludedTopics: "의학적/과장된 효능 효능 강조",
  },
];

export const PlanWizardModal: React.FC<PlanWizardModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
  defaultType = "weekly",
}) => {
  const [planType, setPlanType] = useState<"weekly" | "monthly">(defaultType);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [brandName, setBrandName] = useState("STUDIO ATELIER");
  const [brandConcept, setBrandConcept] = useState(
    "시간이 지나도 변치 않는 텍스타일과 일상의 온기"
  );
  const [focusProducts, setFocusProducts] = useState(
    "워시드 린넨 베딩 세트, 애쉬 핑크 쿠션 커버"
  );
  const [keyMessage, setKeyMessage] = useState(
    "자연스러운 주름과 오래된 회화의 색채에서 찾은 편안함"
  );
  const [recentInspirations, setRecentInspirations] = useState(
    "도쿄 긴자 텍스타일 숍 VMD 답사, 국립박물관 조각보 관람"
  );
  const [culturalReferences, setCulturalReferences] = useState(
    "조선 조각보의 비대칭 균형, 앙리 마티스의 차분한 회화 색조"
  );
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "Instagram Feed",
    "Instagram Reels",
    "Instagram Stories",
    "Threads",
    "Blog",
  ]);
  const [excludedTopics, setExcludedTopics] = useState(
    "파격 할인, 한정 수량 마감 임박 등 자극적 문구"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const toggleChannel = (ch: string) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setBrandName(preset.brandName);
    setBrandConcept(preset.brandConcept);
    setFocusProducts(preset.focusProducts);
    setKeyMessage(preset.keyMessage);
    setRecentInspirations(preset.recentInspirations);
    setCulturalReferences(preset.culturalReferences);
    setSelectedChannels(preset.preferredChannels);
    setExcludedTopics(preset.excludedTopics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType,
          startDate,
          brandName,
          brandConcept,
          focusProducts,
          keyMessage,
          recentInspirations,
          culturalReferences,
          preferredChannels: selectedChannels,
          excludedTopics,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const generated = data.data;
        const newPlan: ContentPlan = {
          id: `plan-${Date.now()}`,
          title:
            generated.planTitle ||
            `${brandName} ${planType === "weekly" ? "주간" : "월간"} 콘텐츠 계획`,
          planType,
          startDate,
          endDate:
            generated.items?.[generated.items.length - 1]?.date || startDate,
          brandName,
          brandConcept,
          focusProducts,
          keyMessage,
          recentInspirations,
          culturalReferences,
          summary: generated.planSummary || "브랜드 깊이와 취향을 담은 콘텐츠 계획",
          items: (generated.items || []).map((item: any, idx: number) => ({
            ...item,
            id: item.id || `item-${Date.now()}-${idx}`,
            status: item.status || "기획",
            hashtags: item.hashtags || ["#라이프스타일", `#${brandName}`],
            visualDirection: {
              space: item.visualDirection?.space || "자연광이 드는 미니멀한 공간",
              props: item.visualDirection?.props || "소재와 어우러지는 단정한 소품",
              lighting: item.visualDirection?.lighting || "부드러운 오후 사광",
              composition: item.visualDirection?.composition || "정돈된 구도",
              aspectRatio: item.visualDirection?.aspectRatio || "4:5",
              overlayText: item.visualDirection?.overlayText || "",
              promptEn: item.visualDirection?.promptEn || "Lifestyle aesthetic editorial photography, warm sunlight",
            },
          })),
          createdAt: new Date().toISOString(),
          ratioBreakdown: generated.recommendedRatios || {
            product: 20,
            lifestyle: 25,
            story: 20,
            info: 15,
            inspiration: 15,
            engagement: 5,
          },
        };

        onPlanCreated(newPlan);
        onClose();
      } else {
        throw new Error(data.error || "플랜 생성에 실패했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "서버 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        id="plan-wizard-dialog"
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-neutral-200/90 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-neutral-200/80 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-neutral-900 text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 truncate tracking-tight">
                새 콘텐츠 계획 만들기
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-500 hidden sm:block truncate mt-0.5">
                제품, 스토리, 영감 리서치가 균형 잡힌 주간/월간 플랜을 기획합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200/60 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs sm:text-sm text-neutral-800">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              빠른 브랜드 템플릿 불러오기 (선택)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="text-left p-3 rounded-xl border border-neutral-200/90 bg-neutral-50/70 hover:bg-white hover:border-neutral-400 transition-all text-xs text-neutral-700 shadow-2xs hover:shadow-xs"
                >
                  <p className="font-semibold text-neutral-900 text-xs line-clamp-1">{p.name}</p>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">
                    {p.keyMessage}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form id="plan-wizard-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Type & Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  계획 주기
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlanType("weekly")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      planType === "weekly"
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    주간 계획 (7일)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanType("monthly")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      planType === "monthly"
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    월간 계획 (핵심 일정)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  시작 기준일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Brand Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  브랜드명
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="예: ATELIER 아뜰리에, 숨 SOUM"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  브랜드 철학 / 핵심 콘셉트
                </label>
                <input
                  type="text"
                  value={brandConcept}
                  onChange={(e) => setBrandConcept(e.target.value)}
                  placeholder="예: 시간이 지나도 변치 않는 텍스타일과 일상의 온기"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Focus Products & Key Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  이번 기간 집중 소개 제품 / 프로젝트
                </label>
                <input
                  type="text"
                  value={focusProducts}
                  onChange={(e) => setFocusProducts(e.target.value)}
                  placeholder="예: 워시드 린넨 베딩, 애쉬 핑크 쿠션 커버"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  전달하고 싶은 핵심 메시지
                </label>
                <input
                  type="text"
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  placeholder="예: 자연스러운 주름과 오래된 회화의 색채에서 찾은 편안함"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Inspirations & Cultural References */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  최근 영감, 리서치, 답사, 방문지
                </label>
                <textarea
                  rows={2}
                  value={recentInspirations}
                  onChange={(e) => setRecentInspirations(e.target.value)}
                  placeholder="예: 도쿄 긴자 텍스타일 숍 자연광 VMD, 국립중앙박물관 공예전"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 resize-none leading-relaxed shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  문화 / 예술 / 역사적 레퍼런스
                </label>
                <textarea
                  rows={2}
                  value={culturalReferences}
                  onChange={(e) => setCulturalReferences(e.target.value)}
                  placeholder="예: 조선 조각보의 비대칭 균형, 앙리 마티스의 차분한 회화 색조"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 resize-none leading-relaxed shadow-2xs"
                />
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                활용할 SNS 채널 (복수 선택)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Instagram Feed",
                  "Instagram Reels",
                  "Instagram Stories",
                  "Threads",
                  "Blog",
                ].map((ch) => {
                  const isSel = selectedChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors shadow-2xs ${
                        isSel
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      {isSel ? "✓ " : "+ "}
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Excluded Topics */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                제외하고 싶은 톤 / 내용
              </label>
              <input
                type="text"
                value={excludedTopics}
                onChange={(e) => setExcludedTopics(e.target.value)}
                placeholder="예: 파격 세일, 마감 임박 등 자극적 문구, 무리한 효능 강조"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 shadow-2xs"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center space-x-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-neutral-200/80">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-medium transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <span>Gemini가 브랜드 스토리를 기획 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" strokeWidth={1.75} />
                    <span>콘텐츠 플랜 생성하기</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
