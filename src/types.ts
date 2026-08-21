export type ContentStatus =
  | "기획"
  | "작성 중"
  | "수정 필요"
  | "피드백 확인"
  | "최종 완료"
  | "게시 완료";

export type ContentType =
  | "제품"
  | "라이프스타일"
  | "정보"
  | "브랜드 스토리"
  | "영감 및 리서치"
  | "공감 및 참여"
  | "판매";

export type ChannelType =
  | "Instagram Feed"
  | "Instagram Reels"
  | "Instagram Stories"
  | "Threads"
  | "Blog";

export type DepthLayer = "PRODUCT" | "STORY" | "INSPIRATION";

export interface CulturalReference {
  title: string;
  connection: string;
}

export interface ReelsStoryScene {
  step?: number;
  scene?: string;
  subtitle?: string;
  visual?: string;
}

export interface StoriesSlide {
  step: number;
  title: string;
  text: string;
  pollQuestion?: string;
}

export interface BlogDraft {
  title: string;
  outline: string;
  fullBody?: string;
  titleEn?: string;
  outlineEn?: string;
}

export interface Copywriting {
  feedText: string;
  feedTextEn?: string;
  reelsStructure?: {
    hook: string;
    hookEn?: string;
    scenes: string[];
    scenesEn?: string[];
    caption: string;
    captionEn?: string;
    cta?: string;
    ctaEn?: string;
  };
  storiesFlow?: StoriesSlide[];
  threadsText?: string;
  threadsTextEn?: string;
  blogDraft?: BlogDraft;
  hashtagsEn?: string[];
}

export interface VisualDirection {
  space: string;
  props: string;
  lighting: string;
  composition: string;
  aspectRatio: "1:1" | "4:5" | "9:16" | "16:9";
  overlayText?: string;
  promptEn?: string;
}

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  userPrompt: string;
  actionType: "modify" | "feedback" | "finalize";
  targetScope?: "all" | "text" | "image" | "video";
  previousTextSnippet?: string;
  mediaModified?: boolean;
  mediaType?: "image" | "video";
}

export interface ContentItem {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // 월, 화, 수, 목, 금, 토, 일
  topic: string;
  purpose: string;
  contentType: ContentType;
  channel: ChannelType;
  status: ContentStatus;
  coreMessage: string;
  depthLayer: DepthLayer;
  culturalReference?: CulturalReference;
  copywriting: Copywriting;
  visualDirection: VisualDirection;
  hashtags: string[];
  includeEnglish?: boolean; // 영문 버전 포함 여부 개별 선택
  imageUrl?: string;
  mediaType?: "image" | "video";
  shouldRegenerateMedia?: "image" | "video";
  imageSource?: "upload" | "ai" | "stock";
  imageFileName?: string;
  feedbackHistory?: FeedbackEntry[];
  publishedAt?: string;
  notes?: string;
}

export interface ContentPlan {
  id: string;
  title: string;
  planType: "weekly" | "monthly";
  startDate: string;
  endDate: string;
  brandName: string;
  brandConcept: string;
  focusProducts: string;
  keyMessage: string;
  recentInspirations: string;
  culturalReferences: string;
  summary: string;
  items: ContentItem[];
  createdAt: string;
  ratioBreakdown?: {
    product: number;
    lifestyle: number;
    story: number;
    info: number;
    inspiration: number;
    engagement: number;
  };
}

export interface InspirationLog {
  id: string;
  date: string;
  title: string;
  locationOrSource: string; // e.g. "도쿄 긴자 텍스타일 샵", "조선 조각보 도록", "성수동 목공방"
  category: "도시답사" | "소재연구" | "전시/예술" | "건축/공간" | "패턴/컬러" | "일상관찰";
  observation: string; // 우리가 무엇을 보았는가
  discovery: string; // 왜 흥미로운가
  brandPerspective: string; // 우리 브랜드의 관점
  designLink: string; // 앞으로 어떤 디자인/제품으로 연결되는가
  tags: string[];
  sampleSeriesIdea?: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
  imageSource?: "upload" | "ai" | "stock";
  imageFileName?: string;
}
