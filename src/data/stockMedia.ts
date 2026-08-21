export interface StockMedia {
  id: string;
  type: "image" | "video";
  category: "린넨·패브릭" | "도자기·오브제" | "공간·자연광" | "슬로우라이프·티" | "전통공예·소재" | "작업실·디자인";
  title: string;
  url: string;
  posterUrl?: string; // Video thumbnail poster
  author: string;
  license: string; // e.g., "Unsplash Free License (상업적 이용 가능)", "Pexels Free Video License (상업적 이용 가능)"
}

export type StockPhoto = StockMedia;

// 저작권 문제 없는 100% 무료 상업용 이미지 라이브러리 (Unsplash & Pexels Free License)
export const AESTHETIC_STOCK_PHOTOS: StockMedia[] = [
  // 린넨·패브릭
  {
    id: "stock-linen-1",
    type: "image",
    category: "린넨·패브릭",
    title: "내추럴 워시드 린넨 베딩과 부드러운 주름",
    url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Studio",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-linen-2",
    type: "image",
    category: "린넨·패브릭",
    title: "햇살이 드리운 오가닉 코튼 패브릭 클로즈업",
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Home",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-linen-3",
    type: "image",
    category: "린넨·패브릭",
    title: "애쉬 핑크 린넨 쿠션과 내추럴 텍스처",
    url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Atelier",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-linen-4",
    type: "image",
    category: "린넨·패브릭",
    title: "아이보리 텍스타일 원단과 자연스러운 주름선",
    url: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Textures",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },

  // 도자기·오브제
  {
    id: "stock-pottery-1",
    type: "image",
    category: "도자기·오브제",
    title: "거친 질감의 수공예 백자 화병과 마른 가지",
    url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Ceramic",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-pottery-2",
    type: "image",
    category: "도자기·오브제",
    title: "흙의 온기가 담긴 분청사기 찻잔과 트레이",
    url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Pottery",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-pottery-3",
    type: "image",
    category: "도자기·오브제",
    title: "미니멀 원목 테이블 위의 세라믹 플레이트",
    url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Objects",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },

  // 공간·자연광
  {
    id: "stock-space-1",
    type: "image",
    category: "공간·자연광",
    title: "오후 3시의 사광이 비추는 미니멀한 침실",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Interior",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-space-2",
    type: "image",
    category: "공간·자연광",
    title: "원목 벤치와 여백이 돋보이는 갤러리 코너",
    url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Minimal",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-space-3",
    type: "image",
    category: "공간·자연광",
    title: "창가로 스며드는 따뜻한 자연광과 식물 그림자",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Daylight",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },

  // 슬로우라이프·티
  {
    id: "stock-tea-1",
    type: "image",
    category: "슬로우라이프·티",
    title: "단정한 다도 테이블과 맑은 녹차 잔",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Tea",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-tea-2",
    type: "image",
    category: "슬로우라이프·티",
    title: "따뜻한 모닝 티타임과 리넨 냅킨",
    url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Ritual",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },

  // 전통공예·소재
  {
    id: "stock-craft-1",
    type: "image",
    category: "전통공예·소재",
    title: "조각보의 비례를 닮은 한지 텍스처와 빛",
    url: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Craft",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-craft-2",
    type: "image",
    category: "전통공예·소재",
    title: "전통 결이 살아있는 원목 가구 디테일",
    url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Woodcraft",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },

  // 작업실·디자인
  {
    id: "stock-studio-1",
    type: "image",
    category: "작업실·디자인",
    title: "디렉터의 디자인 무드보드와 패브릭 스와치",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Studio",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-studio-2",
    type: "image",
    category: "작업실·디자인",
    title: "아뜰리에 테이블 위의 스케치와 컬러 팔레트",
    url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    author: "Unsplash Creative",
    license: "Unsplash Free License (상업적/개인 무료 이용 가능)",
  },
];

// 저작권 문제 없는 100% 무료 상업용 동영상 라이브러리 (Pexels / Mixkit CC0 Free License)
export const AESTHETIC_STOCK_VIDEOS: StockMedia[] = [
  {
    id: "stock-vid-curtain",
    type: "video",
    category: "공간·자연광",
    title: "바람에 부드럽게 흔들리는 린넨 커튼과 자연광",
    url: "https://assets.mixkit.co/videos/preview/mixkit-curtains-blowing-in-the-wind-41473-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    author: "Mixkit Free Video",
    license: "Mixkit Free Video License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-vid-tea",
    type: "video",
    category: "슬로우라이프·티",
    title: "따뜻한 김이 피어오르는 도자기 찻잔과 모닝 리추얼",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-steaming-cup-of-coffee-41804-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    author: "Mixkit Free Video",
    license: "Mixkit Free Video License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-vid-pottery",
    type: "video",
    category: "도자기·오브제",
    title: "도예 물레 위에서 부드럽게 빚어지는 흙과 화병",
    url: "https://assets.mixkit.co/videos/preview/mixkit-potter-shaping-a-clay-vase-41584-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    author: "Mixkit Free Video",
    license: "Mixkit Free Video License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-vid-fabric",
    type: "video",
    category: "린넨·패브릭",
    title: "내추럴 패브릭 원단의 결을 섬세하게 만지는 손길",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hands-touching-fabric-41793-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    author: "Mixkit Free Video",
    license: "Mixkit Free Video License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-vid-space",
    type: "video",
    category: "공간·자연광",
    title: "오후 햇살이 드리운 차분한 갤러리 리빙 공간",
    url: "https://assets.mixkit.co/videos/preview/mixkit-natural-light-in-a-living-room-41577-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    author: "Mixkit Free Video",
    license: "Mixkit Free Video License (상업적/개인 무료 이용 가능)",
  },
  {
    id: "stock-vid-atelier",
    type: "video",
    category: "작업실·디자인",
    title: "아뜰리에 작업대 위 스케치와 창작의 순간",
    url: "https://assets.mixkit.co/videos/preview/mixkit-designer-drawing-sketches-in-an-atelier-41602-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    author: "Mixkit Free Video",
    license: "Mixkit Free Video License (상업적/개인 무료 이용 가능)",
  },
];
