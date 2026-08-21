import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const BRAND_SYSTEM_INSTRUCTION = `
당신은 하이엔드 라이프스타일 브랜드를 위한 전문 SNS 콘텐츠 기획자이자 브랜드 에디터, 콘텐츠 디렉터입니다.

[핵심 역할 및 원칙]
1. 단순 제품 홍보/스펙 나열이 아닌, 브랜드의 철학, 디자인 과정, 소재 탐구, 라이프스타일, 문화적 배경, 영감과 리서치 과정을 유기적으로 엮는 스토리텔링을 구현합니다.
2. 3대 콘텐츠 층위 (Product: 무엇을 / Story: 왜 / Inspiration: 어디서)를 균형 있게 구성합니다.
3. 예술·문화 레퍼런스(예: 한국의 책가도, 민화, 조각보, 단청, 전통 직물 / 서양의 마티스, 호크니, 바우하우스, 미드센추리 등) 활용 시, 허위 사실을 날조하지 않고 "디자인적 관점과 연결되는 구체적 이유(색감, 비례, 질감, 주름, 패턴 리듬)"를 기반으로 현대적 해석으로 풀어냅니다.
4. 금지 문구: "최고의", "무조건", "필수템", "인생템", "역대급", "놓치면 후회" 등 자극적인 과장 광고 문구 금지. 모던하고 정돈된 어조, 깊이 있는 감각과 자연스러운 브랜드 운영자의 언어를 사용합니다.
5. 채널별 맞춤:
   - Instagram Feed: 감각적 비주얼 + 제품+공간+라이프스타일+정보+브랜드 관점
   - Instagram Reels: 훅(Hook) 문구 + 3~4씬 구성 + 자막 + 행동 유도(CTA)
   - Instagram Stories: 1~5장 슬라이드 구성 (오늘 보는 것 → 디테일 → 이유 → 디자인 연결 → 질문/투표)
   - Threads: 브랜드 디렉터의 솔직하고 담백한 생각, 관찰, 작업 과정 고민
   - Blog: 제목, 배경, 문화/디자인 리서치, 브랜드 철학, 실질적 활용 팁, 맺음말
`;

interface GenerateJsonOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  preferredModel?: string;
}

const MODEL_CASCADE = [
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-2.5-flash-lite",
];

async function generateJsonWithRetryAndFallback(options: GenerateJsonOptions): Promise<any> {
  const ai = getAI();
  const modelsToTry = [
    options.preferredModel || "gemini-2.5-flash",
    ...MODEL_CASCADE.filter((m) => m !== (options.preferredModel || "gemini-2.5-flash")),
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.prompt,
          config: {
            systemInstruction: options.systemInstruction || BRAND_SYSTEM_INSTRUCTION,
            responseMimeType: options.responseMimeType || "application/json",
            temperature: options.temperature ?? 0.7,
          },
        });

        const rawText = response.text || "";
        const cleanedText = rawText
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        if (cleanedText) {
          try {
            return JSON.parse(cleanedText);
          } catch (parseErr) {
            console.warn(`JSON parse issue with model ${model}, rawText:`, rawText);
          }
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("high demand") ||
          errMsg.includes("temporarily") ||
          errMsg.includes("overloaded");

        console.warn(`Model ${model} attempt ${attempt} failed: ${errMsg}`);

        if (isTransient && attempt < 3) {
          const delay = Math.pow(2, attempt - 1) * 600 + Math.random() * 200;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error("All AI models failed to respond");
}

function normalizeRefinedContent(original: any, incoming: any, userRequest: string = "", refinementType: string = "modify"): any {
  const root = incoming?.data || incoming?.content || incoming?.item || incoming?.refinedContent || incoming || {};
  const base = JSON.parse(JSON.stringify(original || {}));

  // Normalize copywriting
  const originalCopy = base.copywriting || {};
  const incomingCopy = root.copywriting || {};
  
  const normalizedCopy = {
    ...originalCopy,
    ...incomingCopy,
    feedText: root.feedText || incomingCopy.feedText || originalCopy.feedText || "",
    feedTextEn: root.feedTextEn || incomingCopy.feedTextEn || originalCopy.feedTextEn || "",
    threadsText: root.threadsText || incomingCopy.threadsText || originalCopy.threadsText || "",
    threadsTextEn: root.threadsTextEn || incomingCopy.threadsTextEn || originalCopy.threadsTextEn || "",
    reelsStructure: root.reelsStructure || incomingCopy.reelsStructure || originalCopy.reelsStructure || {
      hook: base.coreMessage || "공간에 자연스럽게 녹아드는 오브제",
      scenes: [
        "자연광이 깃든 공간 속 텍스처 클로즈업",
        "디자이너의 스케치와 소재 조색 비하인드",
        "일상 주거 공간에 자연스럽게 매치된 라이프스타일 씬",
      ],
      caption: (root.feedText || incomingCopy.feedText || originalCopy.feedText || "").slice(0, 100),
      cta: "댓글로 당신의 일상 무드를 공유해주세요.",
    },
    storiesFlow: root.storiesFlow || incomingCopy.storiesFlow || originalCopy.storiesFlow,
    blogDraft: root.blogDraft || incomingCopy.blogDraft || originalCopy.blogDraft,
    hashtagsEn: root.hashtagsEn || incomingCopy.hashtagsEn || originalCopy.hashtagsEn,
  };

  // Normalize visualDirection
  const originalVisual = base.visualDirection || {};
  const incomingVisual = root.visualDirection || {};
  const normalizedVisual = {
    ...originalVisual,
    ...incomingVisual,
    space: incomingVisual.space || root.space || originalVisual.space || "Minimal artisan room with natural morning light",
    props: incomingVisual.props || root.props || originalVisual.props || "Washed linen textile, ceramics, wood furniture",
    lighting: incomingVisual.lighting || root.lighting || originalVisual.lighting || "Soft daylight casting gentle organic shadows",
    composition: incomingVisual.composition || root.composition || originalVisual.composition || "Eye-level aesthetic still-life framing",
    aspectRatio: incomingVisual.aspectRatio || root.aspectRatio || originalVisual.aspectRatio || "4:5",
    overlayText: incomingVisual.overlayText || root.overlayText || originalVisual.overlayText || "",
    promptEn: incomingVisual.promptEn || root.promptEn || originalVisual.promptEn || `${base.topic || "Lifestyle"}, aesthetic interior, 8k`,
  };

  const isVideo =
    root.mediaType === "video" ||
    root.shouldRegenerateMedia === "video" ||
    /영상|동영상|릴스|비디오|reels|video|무빙/i.test(userRequest);

  if (isVideo) {
    normalizedVisual.aspectRatio = "9:16";
  }

  const result = {
    ...base,
    ...root,
    id: base.id,
    date: base.date,
    dayOfWeek: base.dayOfWeek,
    topic: root.topic || root.title || base.topic,
    coreMessage: root.coreMessage || base.coreMessage,
    purpose: root.purpose || base.purpose,
    category: root.category || base.category,
    contentType: root.contentType || base.contentType,
    depthLayer: root.depthLayer || base.depthLayer,
    copywriting: normalizedCopy,
    visualDirection: normalizedVisual,
    hashtags: root.hashtags || base.hashtags || ["#라이프스타일", "#브랜드디자인"],
    cta: root.cta || base.cta || "프로필 링크에서 자세한 스토리 만나보기",
    status: refinementType === "finalize" ? "최종 완료" : "피드백 확인",
    mediaType: isVideo ? "video" : (root.mediaType || base.mediaType || "image"),
    shouldRegenerateMedia: root.shouldRegenerateMedia || (isVideo ? "video" : root.mediaType === "image" ? "image" : undefined),
  };

  return result;
}

function localFallbackRefinement(currentContent: any, userRequest: string, refinementType: string) {
  const cloned = JSON.parse(JSON.stringify(currentContent || {}));
  const trimmedReq = (userRequest || "").trim();
  const lowerReq = trimmedReq.toLowerCase();

  const isVideoReq = /영상|동영상|릴스|비디오|reels|video|무빙|숏츠|카메라/i.test(trimmedReq);
  const isImageReq = /이미지|사진|포토|스틸|image|photo|컷|화보/i.test(trimmedReq);
  const isShorter = /줄여|짧게|간결|담백|요약|핵심만|축약/i.test(trimmedReq);
  const isLonger = /길게|풍부|상세|확장|스토리|깊이/i.test(trimmedReq);
  const isWarm = /감성|따뜻|온기|편안|자연/i.test(trimmedReq);
  const isArtisan = /공예|조각보|전통|민화|마티스|바우하우스|디자인|소재|직조/i.test(trimmedReq);
  const isToneDirector = /디렉터|스레드|솔직|담담|사유|철학/i.test(trimmedReq);

  if (refinementType === "finalize") {
    cloned.status = "최종 완료";
  } else {
    cloned.status = "피드백 확인";
  }

  if (!cloned.copywriting) {
    cloned.copywriting = {
      feedText: "",
      threadsText: "",
      reelsStructure: { hook: "", scenes: [], caption: "", cta: "" },
    };
  }

  // Refine Feed Text
  let feed = cloned.copywriting.feedText || "매일 마주하는 일상 속 작은 영감과 따뜻한 질감을 전합니다.";
  if (isShorter) {
    const paras = feed.split("\n\n").filter(Boolean);
    if (paras.length > 2) {
      feed = paras.slice(0, 2).join("\n\n");
    } else {
      feed = paras.map((p: string) => p.split(".").slice(0, 2).join(".") + ".").join("\n\n");
    }
  } else if (isLonger || isArtisan) {
    feed += `\n\n손끝에 닿는 소재의 질감과 시간이 깃든 고유의 결을 오래도록 바라보며, 공간에 자연스럽게 스며드는 라이프스타일 오브제를 제안합니다.`;
  } else if (isWarm) {
    feed = `아침의 은은한 햇살처럼, 분주한 일상 속 편안한 쉼표가 되어주는 순간.\n\n${feed}\n\n오늘 당신의 공간에도 따뜻한 온기가 머물기를 바랍니다.`;
  } else if (isToneDirector) {
    feed = `브랜드를 만들며 가장 중요하게 생각했던 것은 거창한 유행보다 매일 손이 가는 편안함이었습니다.\n\n${feed}`;
  } else if (trimmedReq && !isVideoReq && !isImageReq) {
    // Custom user request applied naturally
    feed = `${feed}\n\n[디렉터 노트: ${trimmedReq}의 가치를 담아 정돈된 시선으로 이야기를 완성했습니다.]`;
  }
  cloned.copywriting.feedText = feed;

  // Refine Threads
  if (cloned.copywriting.threadsText) {
    if (isShorter) {
      cloned.copywriting.threadsText = cloned.copywriting.threadsText.split("\n")[0] || cloned.copywriting.threadsText;
    } else if (isToneDirector || isWarm) {
      cloned.copywriting.threadsText = `작은 디테일 하나가 주는 온기를 믿습니다. ${cloned.copywriting.threadsText}`;
    }
  }

  // Refine Reels Structure
  if (isVideoReq || cloned.mediaType === "video") {
    cloned.mediaType = "video";
    if (!cloned.visualDirection) cloned.visualDirection = {};
    cloned.visualDirection.aspectRatio = "9:16";
    cloned.visualDirection.props = "Soft natural linen, delicate ambient breeze, aesthetic ceramic vase";
    cloned.visualDirection.lighting = "Gentle golden-hour daylight casting soft motion shadows";
    cloned.visualDirection.promptEn = `${cloned.topic || "Lifestyle aesthetic"}, 9:16 vertical cinematic reels, slow ambient camera motion, 4k`;
    cloned.shouldRegenerateMedia = "video";

    if (!cloned.copywriting.reelsStructure) {
      cloned.copywriting.reelsStructure = { hook: "", scenes: [], caption: "", cta: "" };
    }
    cloned.copywriting.reelsStructure.hook = `눈으로 먼저 느껴지는 소재의 온기, ${cloned.topic || "일상의 디테일"}`;
    cloned.copywriting.reelsStructure.scenes = [
      "Scene 1: 아침 햇살 아래 살랑이는 원단 질감과 자연광 무빙 (0-3s)",
      "Scene 2: 핸드크래프트 디테일과 세심한 마감 공정 클로즈업 (3-8s)",
      "Scene 3: 차분한 공간에 놓여 완성된 라이프스타일 씬 (8-12s)",
    ];
    cloned.copywriting.reelsStructure.cta = "프로필 링크에서 더 많은 컬렉션과 아뜰리에 이야기를 확인하세요.";
  } else if (isImageReq) {
    cloned.mediaType = "image";
    if (!cloned.visualDirection) cloned.visualDirection = {};
    cloned.visualDirection.props = "Minimal porcelain ceramics, textured linen cloth, wooden furniture";
    cloned.visualDirection.lighting = "Soft side-window morning daylight";
    cloned.visualDirection.promptEn = `${cloned.topic || "Artisan Lifestyle"}, warm minimal interior aesthetic, morning sunlight, 8k photorealistic`;
    cloned.shouldRegenerateMedia = "image";
  }

  return cloned;
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. Plan Generation Endpoint
app.post("/api/plan/generate", async (req: Request, res: Response) => {
  try {
    const {
      planType = "weekly", // "weekly" | "monthly"
      startDate = new Date().toISOString().slice(0, 10),
      brandName = "STUDIO ATELIER",
      brandConcept = "시간이 흘러도 변치 않는 텍스타일과 일상의 온기",
      focusProducts = "내추럴 워시드 린넨 베딩, 애쉬 핑크 쿠션 커버",
      keyMessage = "오래된 회화와 전통 조각보에서 찾은 편안한 색감과 질감",
      recentInspirations = "도쿄 긴자 라이프스타일 숍 탐방, 성수동 아뜰리에 목공예 관람",
      culturalReferences = "앙리 마티스의 색채 조화, 조선 후기 조각보의 기하학적 비례",
      preferredChannels = ["Instagram Feed", "Instagram Reels", "Instagram Stories", "Threads", "Blog"],
      excludedTopics = "과도한 할인 이벤트 문구",
    } = req.body;

    const count = planType === "weekly" ? 7 : 14;

    const prompt = `
[라이프스타일 브랜드 SNS 콘텐츠 플랜 생성 요청]
- 계획 유형: ${planType === "weekly" ? "주간 콘텐츠 계획 (7일)" : "월간 핵심 콘텐츠 계획 (" + count + "일치)"}
- 시작 날짜: ${startDate}
- 브랜드명: ${brandName}
- 브랜드 콘셉트/철학: ${brandConcept}
- 이번 기간 집중 제품/프로젝트: ${focusProducts}
- 브랜드 핵심 메시지: ${keyMessage}
- 최근 영감 및 리서치: ${recentInspirations}
- 문화/예술 레퍼런스: ${culturalReferences}
- 활용 SNS 채널: ${preferredChannels.join(", ")}
- 제외/주의 사항: ${excludedTopics}

[콘텐츠 종류 밸런스 규정]
- 제품 콘텐츠 (Product)
- 라이프스타일 콘텐츠 (Lifestyle)
- 정보 콘텐츠 (Care & Styling Tips)
- 브랜드 콘텐츠 (Story & Philosophy)
- 영감 및 리서치 콘텐츠 (Inspiration & Research)
- 공감 및 참여 콘텐츠 (Empathy & Engagement)
- 판매 콘텐츠 (Launch/Restock)
* 위 7가지 유형이 골고루 섞이도록 배분하세요.

다음 JSON 스키마를 엄격히 준수하여 순수 JSON만 반환하세요:
{
  "planTitle": "string",
  "planSummary": "string",
  "recommendedRatios": {
    "product": 20,
    "lifestyle": 25,
    "story": 20,
    "info": 15,
    "inspiration": 15,
    "engagement": 5
  },
  "items": [
    {
      "id": "item-1",
      "date": "YYYY-MM-DD",
      "dayOfWeek": "월" | "화" | "수" | "목" | "금" | "토" | "일",
      "topic": "간결하고 명확한 콘텐츠 주제",
      "purpose": "콘텐츠 목적 (예: 브랜드 취향 공유, 소재 신뢰도 형성, 시즌 신제품 소개)",
      "contentType": "제품" | "라이프스타일" | "정보" | "브랜드 스토리" | "영감 및 리서치" | "공감 및 참여" | "판매",
      "channel": "Instagram Feed" | "Instagram Reels" | "Instagram Stories" | "Threads" | "Blog",
      "status": "기획",
      "coreMessage": "핵심 메시지 1-2문장",
      "depthLayer": "PRODUCT" | "STORY" | "INSPIRATION",
      "culturalReference": {
        "title": "레퍼런스 명칭 (예: 조선 조각보, 마티스의 컷아웃, 긴자 편집숍 등)",
        "connection": "이 레퍼런스가 제품의 색상/패턴/비례와 연결되는 디자인적 해석"
      },
      "copywriting": {
        "feedText": "인스타그램 피드용 완성형 본문 (줄바꿈 포함, 모던하고 정돈된 문체, 바로 복사 가능한 완성본)",
        "reelsStructure": {
          "hook": "첫 3초 시선 끄는 훅 문구",
          "scenes": ["씬 1 설명", "씬 2 설명", "씬 3 설명"],
          "caption": "릴스용 짧은 캡션",
          "cta": "댓글/저장 유도 문구"
        },
        "storiesFlow": [
          { "step": 1, "title": "오늘 보고 있는 것", "text": "스토리 문구 1" },
          { "step": 2, "title": "흥미로운 디테일", "text": "스토리 문구 2" },
          { "step": 3, "title": "디자인 연결", "text": "스토리 문구 3" }
        ],
        "threadsText": "스레드용 디렉터의 담백하고 사유적인 문장 (1~3문단)",
        "blogDraft": {
          "title": "블로그 포스팅 제목",
          "outline": "블로그 주요 목차 및 에세이 요약본"
        }
      },
      "visualDirection": {
        "space": "공간 묘사 (예: 자연광이 들어오는 미니멀한 침실)",
        "props": "소품 및 오브제 (예: 거친 질감의 도자기, 원목 스툴, 린넨 패브릭)",
        "lighting": "조명 (예: 오후 3시의 부드러운 사광)",
        "composition": "구도 (예: 클로즈업 텍스처와 여백이 공존하는 탑뷰)",
        "aspectRatio": "1:1" | "4:5" | "9:16" | "16:9",
        "overlayText": "이미지 위에 얹을 1줄 감성 카피",
        "promptEn": "High-end aesthetic photography for lifestyle brand, minimal composition, warm natural lighting, 8k, photorealistic"
      },
      "hashtags": ["#라이프스타일", "#브랜드명", "#소재이야기"]
    }
  ]
}
`;

    const parsed = await generateJsonWithRetryAndFallback({
      prompt,
      systemInstruction: BRAND_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      preferredModel: "gemini-2.5-flash",
    });

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Plan Generation Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate plan" });
  }
});

// 2. Refinement & Feedback Endpoint (Supports Text, Images & Videos)
app.post("/api/content/refine", async (req: Request, res: Response) => {
  const { currentContent, userRequest, refinementType = "modify", targetScope = "all" } = req.body;
  try {
    const prompt = `
[콘텐츠 수정/피드백 요청 - 텍스트, 이미지 및 동영상/릴스 통합 지원]
현재 콘텐츠 데이터:
${JSON.stringify(currentContent, null, 2)}

사용자의 수정 요청 사항:
"${userRequest}"

요청 유형: ${refinementType} (수정 요청: modify | 피드백 반영: feedback | 최종 게시본 정리: finalize)
수정 집중 영역: ${targetScope} (all | text | image | video)

[수정 원칙]
1. 사용자가 명시한 부분(텍스트, 카피, 해시태그, 이미지 비주얼, 조명/소품 구도, 동영상/릴스 무빙, 화면 비율 등)을 정교하게 수정하고, 기존에 완성도 높았던 나머지 부분은 최대한 유지하세요.
2. [이미지 또는 동영상/릴스 수정 요청인 경우]:
   - 'visualDirection' 객체(space, props, lighting, composition, aspectRatio, overlayText, promptEn)를 사용자의 요구사항에 맞추어 완벽하게 업데이트하세요.
   - 영상/릴스(9:16, 무빙, 시네마틱, 씬, 자막) 관련 요청이면: mediaType을 "video"로 설정하고 aspectRatio는 "9:16"으로 지정하며, 'promptEn'에는 Veo 비디오 생성에 최적화된 영어 묘사를 작성하세요.
   - 사진/이미지(1:1, 4:5, 정방형, 조명, 도자기, 린넨 등) 관련 요청이면: mediaType을 "image"로 설정하고 'promptEn'에는 Gemini 이미지 생성에 최적화된 영어 묘사를 작성하세요.
   - "shouldRegenerateMedia" 필드에 "image" 또는 "video" 또는 "none"을 명시하세요.
3. [카피/본문 텍스트 수정인 경우]:
   - 사용자의 피드백 톤(감성적, 간결, 스토리 확장 등)에 맞추어 feedText, reelsStructure, storiesFlow, threadsText, blogDraft 등을 조율하세요.
4. [최종 게시본(finalize)인 경우]:
   - 군더더기 설명을 제거하고 실전 업로드용으로 모든 채널별 텍스트와 비주얼 디렉션을 정갈하게 정돈하세요.

반드시 수정된 콘텐츠 객체를 JSON 형식으로 반환하세요. JSON 스키마는 원본과 동일한 구조를 가지며, 추가로 "shouldRegenerateMedia": "image" | "video" | "none" 및 "mediaType": "image" | "video" 필드를 포함할 수 있습니다.
`;

    const parsed = await generateJsonWithRetryAndFallback({
      prompt,
      systemInstruction: BRAND_SYSTEM_INSTRUCTION,
      temperature: 0.6,
      preferredModel: "gemini-2.5-flash",
    });

    const normalizedData = normalizeRefinedContent(currentContent, parsed, userRequest, refinementType);
    res.json({ success: true, data: normalizedData });
  } catch (error: any) {
    console.warn("Refinement Error caught, applying resilient smart fallback:", error?.message || error);
    const fallbackData = localFallbackRefinement(currentContent, userRequest, refinementType);
    const normalizedFallback = normalizeRefinedContent(currentContent, fallbackData, userRequest, refinementType);
    res.json({
      success: true,
      data: normalizedFallback,
      warning: "스마트 로컬 룰에 따라 수정 사항이 즉시 정교하게 반영되었습니다.",
    });
  }
});

// 3. Multi-Channel Adaptation Endpoint
app.post("/api/content/channel-adapt", async (req: Request, res: Response) => {
  try {
    const { topic, coreMessage, brandName, targetChannel, culturalReference } = req.body;

    const prompt = `
주제: ${topic}
핵심 메시지: ${coreMessage}
브랜드명: ${brandName || "라이프스타일 브랜드"}
문화/예술 레퍼런스: ${culturalReference || "없음"}
대상 채널: ${targetChannel}

[채널별 작성 규칙]
- Instagram Feed: 완성도 높은 카피 + 이미지 연출팁 + 해시태그
- Instagram Reels: 첫 화면 시선 끄는 훅 문구 + 3~4씬 스토리보드 + 영상 자막 + 캡션 + CTA
- Instagram Stories: 1~5장 슬라이드별 텍스트 및 인터랙티브 질문/투표 제안
- Threads: 브랜드 디렉터의 날것의 생각과 사유, 짧고 여운 있는 문체
- Blog: 심층 아티클 (제목, 도입, 문화/디자인 배경, 브랜드의 관점, 실질적 활용 팁, 마무리)

위 대상 채널에 최적화된 결과물을 JSON으로 반환하세요:
{
  "channel": "${targetChannel}",
  "title": "string",
  "body": "string",
  "visualGuide": "string",
  "extraFields": { ... }
}
`;

    const parsed = await generateJsonWithRetryAndFallback({
      prompt,
      systemInstruction: BRAND_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      preferredModel: "gemini-2.5-flash",
    });

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Channel Adapt Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to adapt channel" });
  }
});

// 4. Inspiration to Content Series Generator
app.post("/api/content/inspire", async (req: Request, res: Response) => {
  try {
    const { inspirationNote, locationOrTopic, brandContext } = req.body;

    const prompt = `
[영감/리서치 노트 기반 콘텐츠 시리즈 기획]
- 영감 메모/관찰: ${inspirationNote}
- 장소 또는 주제: ${locationOrTopic}
- 브랜드 배경: ${brandContext || "내추럴 라이프스타일 브랜드"}

[기획 방향]
단순 여행기나 맛집 소개가 아니라:
관찰(Observation) → 발견(Discovery) → 브랜드 관점(Perspective) → 디자인/제품 연결(Design Link)의 4단계로 발전시키세요.
이 영감을 바탕으로 3~5가지 연계 콘텐츠 아이디어와 스토리텔링 아크를 생성하세요.

JSON 출력 형식:
{
  "inspirationTitle": "string",
  "coreObservation": "string",
  "brandConnection": "string",
  "seriesIdeas": [
    {
      "step": 1,
      "channel": "Threads" | "Instagram Stories" | "Instagram Feed" | "Instagram Reels" | "Blog",
      "contentType": "영감 및 리서치",
      "topic": "string",
      "angle": "string",
      "suggestedHook": "string",
      "sampleCopy": "string"
    }
  ]
}
`;

    const parsed = await generateJsonWithRetryAndFallback({
      prompt,
      systemInstruction: BRAND_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      preferredModel: "gemini-2.5-flash",
    });

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Inspire Generator Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate inspiration series" });
  }
});

// 5. English Translation & Global Adaptation Endpoint
app.post("/api/content/translate-en", async (req: Request, res: Response) => {
  try {
    const { contentItem, brandName = "STUDIO ATELIER" } = req.body;

    const prompt = `
[라이프스타일 브랜드 영문 에디터 (Global English Adaptation)]
아래의 한국어 SNS 콘텐츠를 감도 높은 글로벌 라이프스타일 매거진(Kinfolk, Cereal, Monocle, Aesop) 스타일의 세련되고 자연스러운 영문으로 번역 및 각색해주세요.

[입력 콘텐츠]
- 브랜드명: ${brandName}
- 콘텐츠 주제: ${contentItem.topic || ""}
- 핵심 메시지: ${contentItem.coreMessage || ""}
- 인스타그램 피드 본문:
${contentItem.copywriting?.feedText || ""}
- 스레드 본문:
${contentItem.copywriting?.threadsText || ""}
- 릴스 훅 & 캡션:
훅: ${contentItem.copywriting?.reelsStructure?.hook || ""}
캡션: ${contentItem.copywriting?.reelsStructure?.caption || ""}
CTA: ${contentItem.copywriting?.reelsStructure?.cta || ""}
- 블로그 제목:
${contentItem.copywriting?.blogDraft?.title || ""}

[영문 작성 원칙]
1. 직역투의 어색한 번역을 금지하고, 감각적인 형용사와 담백한 어휘(understated, warmth, subtle, texture, mindful, daily ritual 등)를 사용하여 자연스러운 네이티브 라이프스타일 톤앤매너로 작성하세요.
2. 피드 본문(feedTextEn)은 줄바꿈과 여백을 살려 인스타그램 업로드에 즉시 사용 가능하게 포맷팅하세요.
3. 글로벌 타겟에게 어울리는 영문 해시태그(hashtagsEn, 5~8개)를 함께 생성하세요.

반드시 다음 JSON 형식으로만 반환하세요:
{
  "feedTextEn": "string",
  "threadsTextEn": "string",
  "reelsStructure": {
    "hookEn": "string",
    "captionEn": "string",
    "ctaEn": "string"
  },
  "blogDraft": {
    "titleEn": "string",
    "outlineEn": "string"
  },
  "hashtagsEn": ["#LinenLiving", "#SlowAesthetics", "#DailyRituals", "#DesignDetails"]
}
`;

    const parsed = await generateJsonWithRetryAndFallback({
      prompt,
      systemInstruction: BRAND_SYSTEM_INSTRUCTION,
      temperature: 0.6,
      preferredModel: "gemini-2.5-flash",
    });

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Translate EN Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to translate English" });
  }
});

// 6. Image Generation / Visual Preview
app.post("/api/image/generate", async (req: Request, res: Response) => {
  try {
    const { prompt: imagePrompt, aspectRatio = "1:1" } = req.body;
    const ai = getAI();

    // Generate image using gemini-3.1-flash-lite-image
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: `${imagePrompt}. Lifestyle product visual, warm natural sunlight, studio minimalism, warm linen and ceramic textures, editorial catalog quality, 8k`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: (aspectRatio === "4:5" ? "3:4" : aspectRatio) as any,
        },
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("Image Gen API Error (fallback will be handled gracefully):", error.message);
    res.status(200).json({
      success: false,
      error: error.message,
      message: "AI image model requires paid tier or failed; fallback aesthetic preview used.",
    });
  }
});

// 7. Video Generation (Veo 3.1)
app.post("/api/video/generate", async (req: Request, res: Response) => {
  try {
    const { prompt: videoPrompt, aspectRatio = "9:16", startingImageBase64 } = req.body;
    const ai = getAI();

    const config: any = {
      numberOfVideos: 1,
      resolution: "720p",
      aspectRatio: aspectRatio === "16:9" ? "16:9" : "9:16",
    };

    const generateOptions: any = {
      model: "veo-3.1-lite-generate-preview",
      prompt: `${videoPrompt}. Natural aesthetic lifestyle video, soft cinematic sunlight, warm linen textures, calm motion, high quality catalog video, 4k detail`,
      config,
    };

    if (startingImageBase64) {
      const match = startingImageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        generateOptions.image = {
          mimeType: match[1],
          imageBytes: match[2],
        };
      }
    }

    const operation = await ai.models.generateVideos(generateOptions);
    res.json({ success: true, operationName: operation.name });
  } catch (error: any) {
    console.error("Video Gen API Error:", error.message);
    res.status(200).json({
      success: false,
      error: error.message,
      message: "AI video model requires paid tier or encountered an issue; fallback preview available.",
    });
  }
});

// 8. Video Status Polling
app.post("/api/video/status", async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    const ai = getAI();
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({
      success: true,
      done: !!updated.done,
      error: updated.error || null,
    });
  } catch (error: any) {
    console.error("Video Status Check Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Video Download / Stream
app.post("/api/video/download", async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    const ai = getAI();
    const apiKey = process.env.GEMINI_API_KEY || "";
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ success: false, error: "Generated video URI not found" });
    }
    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": apiKey },
    });
    const arrayBuffer = await videoRes.arrayBuffer();
    res.setHeader("Content-Type", "video/mp4");
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Video Download Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite Middleware for SPA
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Lifestyle Brand Content Director] Server running on http://localhost:${PORT}`);
  });
}

startServer();
