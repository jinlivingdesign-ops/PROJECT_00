import { ContentPlan, InspirationLog } from "../types";

export const INITIAL_INSPIRATIONS: InspirationLog[] = [
  {
    id: "inspire-1",
    date: "2026-08-18",
    title: "도쿄 긴자 라이프스타일 편집숍의 자연광 연출과 린넨 진열",
    locationOrSource: "도쿄 긴자 노에비아 빌딩 인근 셀렉트숍",
    category: "도시답사",
    observation:
      "진열대 위에 제품을 빽빽이 채우기보다, 한 겹의 린넨이 자연광을 투과하는 각도에 따라 창가에 걸려 바람에 흔들리는 모습을 연출하고 있었습니다.",
    discovery:
      "원단의 스펙보다 '햇살이 비쳤을 때 방 안에 퍼지는 온기'를 고객이 먼저 체감하게 하는 시각적 연출의 힘.",
    brandPerspective:
      "우리 브랜드의 린넨 역시 단순 패브릭이 아니라 아침 햇살을 받아들이는 매개체로 조명해야 한다는 관점을 얻었습니다.",
    designLink:
      "신제품 워시드 린넨 커튼과 베딩 촬영 시, 인위적인 스튜디오 조명 대신 오후 3시 사광을 활용한 비주얼 연출 및 스토리 제작.",
    tags: ["도쿄리서치", "린넨", "자연광", "VMD"],
    sampleSeriesIdea: "빛과 직물 시리즈: 아침 8시와 오후 4시의 패브릭 톤 차이",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80",
    imageSource: "stock",
    imageFileName: "도쿄 긴자 린넨 VMD",
  },
  {
    id: "inspire-2",
    date: "2026-08-14",
    title: "조선 조각보의 비례와 기하학적 그리드에서 발견한 균형미",
    locationOrSource: "국립중앙박물관 한국 전통 공예 특별전",
    category: "전시/예술",
    observation:
      "천 조각을 이어 붙이는 조각보의 화면 분할이 몬드리안의 추상화보다 훨씬 유기적이고 따뜻한 비대칭 균형을 이루고 있었습니다.",
    discovery:
      "자투리 천을 아끼는 실용성에서 출발했음에도 현대 미니멀리즘 인테리어에 완벽히 녹아드는 색면 분할의 미학.",
    brandPerspective:
      "전통을 박제된 박물관 유물이 아닌, 현대의 모던한 쿠션 및 블랭킷 패턴의 그리드 비율로 재해석할 수 있습니다.",
    designLink:
      "톤온톤 배색의 3분할 린넨 쿠션 커버 디자인 및 '전통 공예의 현대적 해석' 브랜드 스토리텔링 릴스 제작.",
    tags: ["조각보", "전통공예", "그리드디자인", "패치워크"],
    sampleSeriesIdea: "한국의 선과 면: 조각보가 가르쳐준 공간의 균형",
    imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80",
    imageSource: "stock",
    imageFileName: "조선 조각보와 한지 텍스처",
  },
  {
    id: "inspire-3",
    date: "2026-08-10",
    title: "앙리 마티스의 후기 컷아웃과 차분한 애쉬 핑크의 발견",
    locationOrSource: "서양 회화 색채 아카이브 도록",
    category: "패턴/컬러",
    observation:
      "마티스가 말년에 사용한 색지들은 선명한 원색뿐 아니라, 세월이 묻은 듯 탁하면서도 깊이 있는 파스텔 톤들이 조화롭게 중첩되어 있었습니다.",
    discovery:
      "너무 밝은 핑크는 쉽게 질리지만, 그레이시한 잿빛이 감도는 애쉬 핑크는 원목 가구와 자연스러운 조화를 만듭니다.",
    brandPerspective:
      "회화 속 오래된 직물의 색감을 현대 한국 주거 공간(화이트/오크/월넛 인테리어)에 녹아들도록 컬러 팔레트를 정립.",
    designLink:
      "F/W 시즌 시그니처 컬러 'Ash Pink' 런칭 콘텐츠 및 컬러 조색 비하인드 스토리 전개.",
    tags: ["마티스", "애쉬핑크", "컬러연구", "텍스타일"],
    sampleSeriesIdea: "우리가 찾던 핑크: 너무 달콤하지 않고 오래 머무는 색",
  },
];

export const INITIAL_WEEKLY_PLAN: ContentPlan = {
  id: "plan-aug-week4",
  title: "8월 4주차: 빛과 텍스타일, 그리고 오래된 색의 위로",
  planType: "weekly",
  startDate: "2026-08-24",
  endDate: "2026-08-30",
  brandName: "STUDIO ATELIER",
  brandConcept: "시간이 지나도 변치 않는 텍스타일과 일상의 온기",
  focusProducts: "워시드 린넨 베딩 세트, 애쉬 핑크 & 오트 쿠션 커버",
  keyMessage: "자연스러운 주름과 오래된 예술 작품의 색채에서 길어 올린 편안함",
  recentInspirations: "도쿄 긴자 린넨 VMD 리서치, 국립박물관 조각보 전시",
  culturalReferences: "조선 조각보의 비대칭 균형, 앙리 마티스의 그레이시 컬러 팔레트",
  summary:
    "단순 제품 판매를 지양하고, 여행 리서치에서 얻은 관찰과 전통 조각보·서양 회화의 컬러 스토리를 유기적으로 연결하여 브랜드의 깊이를 구축하는 7일 플랜입니다.",
  createdAt: "2026-08-20T14:00:00Z",
  ratioBreakdown: {
    product: 20,
    lifestyle: 25,
    story: 20,
    info: 15,
    inspiration: 15,
    engagement: 5,
  },
  items: [
    {
      id: "item-1",
      date: "2026-08-24",
      dayOfWeek: "월",
      topic: "도쿄 긴자에서 마주한 린넨의 자연스러운 주름과 빛",
      purpose: "브랜드가 세상을 바라보는 시선과 취향 공유 (신뢰 및 친밀감 형성)",
      contentType: "영감 및 리서치",
      channel: "Threads",
      status: "최종 완료",
      coreMessage:
        "완벽하게 다려진 패브릭보다, 아침 햇살에 살짝 구겨진 린넨의 결이 주는 편안함에 주목합니다.",
      depthLayer: "INSPIRATION",
      includeEnglish: true,
      culturalReference: {
        title: "도쿄 긴자 텍스타일 숍 VMD 리서치",
        connection:
          "인위적인 정형성 대신 패브릭이 공기와 햇빛을 머금는 자연스러움을 디자인 철학으로 수용",
      },
      copywriting: {
        feedText: `지난주 도쿄 출장 중 가장 오래 머문 곳은 긴자의 한적한 골목에 자리한 작은 텍스타일 숍이었습니다.

그곳에는 빳빳하게 다려진 원단 대신, 창가로 쏟아지는 오후 빛을 받아 부드럽게 잔주름을 드리운 린넨들이 걸려 있었습니다.

"패브릭은 매일 쓰는 사람의 시간과 주름을 닮아갈 때 가장 아름답습니다."
숍 마스터의 짧은 한마디가 오래 귓가에 남았습니다.

우리가 워시드 린넨을 만들며 매번 원단을 미리 부드럽게 세탁해 자연스러운 결을 살려내는 이유도 여기에 있습니다.

완벽한 정돈보다 조금은 흐트러진 편안함이 머무는 공간, 이번 주 여러분의 침실에는 어떤 빛이 스며들고 있나요?`,
        feedTextEn: `During a quiet afternoon in Ginza, we came across a small textile studio tucked away in a quiet alley.

Instead of stiff, pressed fabrics, the window was dressed with gently crumpled washed linen catching the soft afternoon light.

"Fabric is at its most beautiful when it embraces the time and natural wrinkles of the person living with it."
The shop master's words stayed with us for days.

This is precisely why we pre-wash every piece of our linen—to preserve its effortless texture and breathability.

A home that welcomes natural ease rather than strict perfection. What kind of light is filling your bedroom this week?`,
        threadsText: `도쿄 긴자의 작은 패브릭 숍을 둘러보다가 문득 든 생각.
완벽하게 주름 하나 없이 펴진 원단보다, 햇살을 받아 자연스럽게 구겨진 린넨의 결이 훨씬 더 사람의 마음을 무장해제시킨다는 것.

우리가 만드는 베딩도 그런 느낌이면 좋겠습니다. 각 잡힌 호텔 베딩의 긴장감 대신, 고단한 하루 끝에 몸을 파묻었을 때 깊은 숨을 쉬게 만드는 온기 같은 것.`,
        threadsTextEn: `A thought from a quiet fabric studio in Ginza:
Natural wrinkles in sunlit linen disarm us far more gently than a rigid, spotless press. We hope our bedding feels like an exhale at the end of a long day.`,
        hashtagsEn: ["#SlowLiving", "#LinenLiving", "#GinzaResearch", "#TextileDesign", "#DailyRituals"],
        storiesFlow: [
          {
            step: 1,
            title: "Today's Research",
            text: "도쿄 긴자 골목길에서 마주한 텍스타일의 결",
          },
          {
            step: 2,
            title: "Detail Focus",
            text: "빛에 따라 달라지는 린넨 특유의 슬럽(slub) 텍스처",
          },
          {
            step: 3,
            title: "Brand Note",
            text: "완벽한 다림질보다 자연스러운 주름이 주는 일상의 여유",
          },
          {
            step: 4,
            title: "Question",
            text: "여러분은 빳빳한 호텔식 베딩 vs 자연스러운 워시드 린넨 중 어떤 촉감을 더 선호하시나요?",
            pollQuestion: "내 침실 취향은?",
          },
        ],
      },
      visualDirection: {
        space: "따스한 오후 사광이 드리우는 화이트 & 오크 톤의 미니멀한 침실 창가",
        props: "자연스럽게 걸쳐진 린넨 패브릭, 도자기 화병에 꽂힌 들꽃 한 줄기",
        lighting: "자연광 (오후 3시의 부드럽고 긴 그림자 연출)",
        composition: "원단의 섬세한 조직감과 공기감이 느껴지는 사이드 앵글",
        aspectRatio: "4:5",
        overlayText: "빛과 공기를 머금은 린넨의 결",
        promptEn:
          "Minimalist Japanese style interior, soft afternoon sunlight streaming through window onto textured linen fabric, ceramic vase, calm warm palette, editorial photograph, 8k",
      },
      imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80",
      imageSource: "stock",
      hashtags: ["#AuraHome", "#린넨라이프", "#도쿄리서치", "#패브릭디자인", "#일상의영감"],
    },
    {
      id: "item-2",
      date: "2026-08-25",
      dayOfWeek: "화",
      topic: "환절기 린넨 패브릭의 적정 습도와 통기성 관리법",
      purpose: "고객에게 실질적인 유익함을 주는 정보 제공 (전문성과 신뢰도 강화)",
      contentType: "정보",
      channel: "Blog",
      status: "피드백 확인",
      coreMessage:
        "린넨은 여름뿐 아니라 공기층을 품어 환절기에도 쾌적한 수면 환경을 만드는 천연 통기 섬유입니다.",
      depthLayer: "PRODUCT",
      copywriting: {
        feedText: `린넨은 흔히 '여름 원단'으로만 알고 계시지만, 사실 섬유 내부에 중공(미세한 공기 구멍)을 품고 있어 스스로 온습도를 조절하는 지혜로운 소재입니다.

낮에는 아직 덥고 밤에는 선선한 환절기, 쾌적한 숙면을 위한 린넨 관리 팁 3가지를 정리해 드립니다.

1. 미온수 울코스 단독 세탁
강한 마찰을 줄이고 30도 이하의 미온수로 세탁해 본연의 부드러움을 오래 유지하세요.

2. 그늘에서의 자연 건조
직사광선 대신 바람이 잘 통하는 그늘에서 말리면 섬유가 바스락거리지 않고 촉촉한 유연성을 유지합니다.

3. 잔여 수분이 있을 때 가볍게 탁탁 털기
다림질 없이 탈수 직후 결 방향으로 가볍게 털어 널어주시면 린넨 특유의 기분 좋은 주름이 자연스럽게 자리 잡습니다.

작은 관리의 차이가 매일 밤 피부에 닿는 기분을 바꿉니다.`,
        blogDraft: {
          title: "환절기 숙면을 위한 린넨 패브릭 가이드: 왜 사계절 린넨을 선택해야 할까?",
          outline:
            "1. 린넨 섬유의 구조적 비밀 (천연 공기 통로)\n2. 환절기 체온 유지와 땀 흡수 메커니즘\n3. 오래 쓰는 세탁 및 건조 루틴\n4. 계절에 어울리는 린넨 레이어링 스타일링",
        },
      },
      visualDirection: {
        space: "정돈된 원목 세탁실 선반 또는 정갈한 베딩 벤치",
        props: "돌돌 말아놓은 린넨 패브릭 롤, 천연 세탁 비누, 유리 계량컵",
        lighting: "맑고 깨끗한 아침 자연광",
        composition: "차분하고 실용적인 정보를 전달하는 탑다운 & 아이레벨 컷",
        aspectRatio: "1:1",
        overlayText: "Care Note: 린넨을 오래 사랑하는 방법",
        promptEn:
          "Clean minimalist laundry aesthetic, neatly folded linen bed sheets, glass bottle with organic soap, light oak wood surface, soft diffused light, architectural digest vibe",
      },
      hashtags: ["#패브릭관리법", "#린넨세탁법", "#환절기인테리어", "#숙면루틴", "#LinenCare"],
      includeEnglish: false,
    },
    {
      id: "item-3",
      date: "2026-08-26",
      dayOfWeek: "수",
      topic: "Ash Pink & Oat: 오래된 회화에서 건져 올린 은은한 색조",
      purpose: "신제품 컬러 스토리 전달 (제품의 미학적 가치와 스토리텔링)",
      contentType: "제품",
      channel: "Instagram Feed",
      status: "작성 중",
      coreMessage:
        "선명한 원색 대신 시간의 흔적이 깃든 탁하고 따뜻한 핑크가 현대 공간에 스며듭니다.",
      depthLayer: "STORY",
      includeEnglish: true,
      culturalReference: {
        title: "앙리 마티스의 후기 회화 속 패브릭 색조",
        connection:
          "회화 속 세월이 지난 듯한 그레이시 핑크를 한국 주거 원목 톤에 어울리도록 정교하게 톤다운 조색",
      },
      copywriting: {
        feedText: `신제품 컬러를 정할 때, 저희가 가장 경계했던 것은 '너무 눈에 띄는 화려함'이었습니다.

앙리 마티스의 후기 회화 도록을 넘기다 오래된 직물에서 보이는 부드럽고 탁한 핑크에 시선이 멈췄습니다. 

선명한 핑크보다는 시간이 조금 지난 듯 차분하고, 회색빛이 살짝 감도는 색감. 현대적인 원목과 모던한 화이트 인테리어 어디에 놓아도 튀지 않고 스며드는 톤.

그 고민의 끝에서 탄생한 컬러가 이번 시즌의 'Ash Pink'입니다.

달콤함 대신 온기만을 남긴 이 색이, 여러분의 소파와 침대 위에서 잔잔한 쉼이 되기를 바랍니다.`,
        feedTextEn: `When choosing colors for the new season, our main intention was to avoid loud, fleeting trends.

Flipping through an archival book of Henri Matisse's late paintings, we were drawn to the muted, weathered pink tones seen in aged textiles.

A dusty shade infused with soft grey undertones that effortlessly complements oak and walnut wood.

Warmth without excessive sweetness—we hope this quiet shade brings stillness to your living space.`,
        threadsText: `새로 나온 Ash Pink 컬러를 보신 분들이 '핑크인데 왜 이렇게 차분해요?'라고 물어보세요.
사실 이 색은 마티스의 유화 속 오래된 패브릭 톤에서 영감을 받아, 그레이 톤을 꽤 많이 섞어 조색했습니다. 
원목 가구 옆에서도 절대 튀지 않고, 오래 보아도 눈이 피로하지 않은 핑크를 만들고 싶었거든요.`,
        threadsTextEn: `People often ask why our new Ash Pink feels so calm. We formulated it with subtle grey undertones inspired by vintage painting palettes, ensuring it never overwhelms the room.`,
        hashtagsEn: ["#AshPink", "#ColorPalette", "#CushionStyling", "#SlowInteriors", "#MutedTones"],
      },
      visualDirection: {
        space: "월넛 톤의 빈티지 가구와 베이지 벽지가 있는 아늑한 거실 코너",
        props: "Ash Pink 린넨 쿠션, Oat 컬러 블랭킷, 묵직한 아트북 1권",
        lighting: "부드러운 간접 조명과 은은한 자연광의 조화",
        composition: "쿠션의 톤다운된 색감과 직조감이 선명하게 드러나는 미디엄 샷",
        aspectRatio: "4:5",
        overlayText: "시간이 지난 듯 차분한 색, Ash Pink",
        promptEn:
          "Close up of dusty ash pink linen cushion on vintage walnut chair, warm muted aesthetic, Henri Matisse artbook on side table, cozy minimalist living room, 8k",
      },
      hashtags: ["#AshPink", "#컬러팔레트", "#쿠션스타일링", "#가을패브릭", "#홈패브릭"],
    },
    {
      id: "item-4",
      date: "2026-08-27",
      dayOfWeek: "목",
      topic: "조선 조각보의 비례에서 배운 그래픽적 균형미",
      purpose: "문화적 레퍼런스를 통한 독창적 디자인 아이덴티티 구축",
      contentType: "브랜드 스토리",
      channel: "Instagram Reels",
      status: "기획",
      coreMessage:
        "자투리 천을 잇던 선조들의 실용성과 조형 감각을 현대적인 텍스타일 그리드로 재해석합니다.",
      depthLayer: "INSPIRATION",
      culturalReference: {
        title: "조선 후기 조각보의 기하학적 면분할",
        connection:
          "비대칭적인 면과 선의 만남을 현대적인 패치워크 블랭킷의 비율로 승화",
      },
      copywriting: {
        feedText: `박물관에서 만난 조선의 조각보는 어떤 현대 추상 미술보다 대담하고 세련된 비례를 지니고 있었습니다.

버려질 수 있는 자투리 직물들을 하나하나 이어 붙이며 완성한 비대칭의 균형. 

저희는 이 아름다운 선과 면의 분할을 모티프로, 현대 공간에 어울리도록 색상의 대비를 정돈하고 이음매의 마감을 현대적인 기법으로 다듬었습니다.

옛것을 그대로 흉내 내기보다, 그 안에 담긴 조형적 태도를 오늘날의 일상으로 데려오는 일. 
우리가 디자인을 대하는 가장 중요한 태도입니다.`,
        reelsStructure: {
          hook: "300년 전 조각보에서 찾은 가장 현대적인 디자인의 비밀",
          scenes: [
            "Scene 1: 국립박물관 조각보의 정교한 기하학적 그리드 클로즈업",
            "Scene 2: 디자이너 테이블 위 패브릭 샘플을 조각보 비율로 매칭하는 스케치 과정",
            "Scene 3: 완성된 조각보 모티프 린넨 블랭킷이 모던한 소파에 연출되는 공간 풀샷",
          ],
          caption:
            "조선의 조각보가 가르쳐준 면과 선의 조화. 전통을 일상 속 현대적인 패브릭으로 풀어낸 디자인 비하인드.",
          cta: "전통 공예의 현대적 재해석, 여러분의 공간에는 어떻게 어울릴까요? 저장하고 영감을 보관하세요.",
        },
      },
      visualDirection: {
        space: "크리에이티브 디렉터의 작업대 (패브릭 스와치, 스케치북, 핀터레스트 무드보드)",
        props: "전통 모시/삼베 스와치와 모던 린넨 스와치의 나란한 비교 배치",
        lighting: "집중도 높은 데스크 스탠드 조명",
        composition: "디자인 영감과 발전 과정을 입체적으로 보여주는 45도 탑뷰",
        aspectRatio: "9:16",
        overlayText: "Tradition into Modern Lifestyle",
        promptEn:
          "Design studio table with Korean traditional patchwork Jogakbo fabric swatches and modern linen samples, sketchbook drawings, measuring tape, aesthetic editorial lighting, 8k",
      },
      hashtags: ["#조각보", "#전통의현대화", "#브랜드스토리", "#디자인비하인드", "#Reels"],
      imageUrl: "https://assets.mixkit.co/videos/preview/mixkit-designer-drawing-sketches-in-an-atelier-41602-large.mp4",
      mediaType: "video",
      imageSource: "stock",
      imageFileName: "아뜰리에 스케치와 디자인 비하인드 릴스 (무료 라이선스)",
      includeEnglish: false,
    },
    {
      id: "item-5",
      date: "2026-08-28",
      dayOfWeek: "금",
      topic: "금요일 저녁, 조명을 낮추고 패브릭을 정돈하는 10분의 의식",
      purpose: "고객의 일상에 브랜드 제품이 자연스럽게 스며드는 라이프스타일 제안",
      contentType: "라이프스타일",
      channel: "Instagram Feed",
      status: "기획",
      coreMessage:
        "바쁜 한 주의 끝, 조명을 낮추고 베개 커버를 정돈하는 작은 행위가 마음에 쉼표를 찍어줍니다.",
      depthLayer: "STORY",
      includeEnglish: false,
      copywriting: {
        feedText: `금요일 저녁 8시.
형광등 대신 낮은 스탠드 조명을 켜고, 헝클어졌던 침구의 결을 가볍게 손으로 쓸어 정돈합니다.

좋아하는 향의 룸 스프레이를 허공에 한 번 분사하고, 피부에 닿는 시원하고 부드러운 린넨의 감촉에 온몸을 맡기는 시간.

거창한 휴식이 아니더라도, 매일 피부에 닿는 직물을 정갈하게 가다듬는 10분의 시간만으로 한 주의 피로가 부드럽게 풀립니다.

오늘 밤, 당신만을 위한 가장 편안한 침실 의식을 시작해보세요.`,
      },
      visualDirection: {
        space: "황혼의 푸른빛과 따뜻한 2700K 앰버 조명이 교차하는 저녁 침실",
        props: "침대 옆 협탁 위 잔잔한 테이블 램프, 유리잔에 담긴 물 한 잔, 가벼운 리넨 로브",
        lighting: "따뜻한 무드등과 블루아워 창문빛",
        composition: "차분하고 아늑한 분위기를 극대화한 로우 앵글 와이드 샷",
        aspectRatio: "9:16",
        overlayText: "한 주의 끝, 나를 안아주는 침실",
        promptEn:
          "Evening cozy bedroom during blue hour, warm bedside lamp glowing on nightstand, soft unmade natural linen bed sheets, calm peaceful mood, cinematic 8k",
      },
      imageUrl: "https://assets.mixkit.co/videos/preview/mixkit-curtains-blowing-in-the-wind-41473-large.mp4",
      mediaType: "video",
      imageSource: "stock",
      imageFileName: "바람에 흔들리는 린넨 커튼과 자연광 (무료 라이선스)",
      hashtags: ["#금요일밤", "#침실스타일링", "#슬로우라이프", "#일상의쉼표", "#NightRituals"],
    },
    {
      id: "item-6",
      date: "2026-08-29",
      dayOfWeek: "토",
      topic: "당신이 집에서 가장 오래 머무는 '촉감'은 무엇인가요?",
      purpose: "팔로워들과의 깊이 있는 소통 및 선호도 수집",
      contentType: "공감 및 참여",
      channel: "Instagram Stories",
      status: "기획",
      coreMessage:
        "시각적인 인테리어만큼이나 피부가 기억하는 촉각적인 편안함에 대해 이야기합니다.",
      depthLayer: "STORY",
      includeEnglish: false,
      copywriting: {
        feedText: `눈으로 보는 인테리어도 중요하지만, 몸이 온전히 긴장을 푸는 순간은 결국 '피부에 닿는 촉감'에서 시작됩니다.

사각사각 소리가 나는 바스락한 코튼,
피부에 닿을수록 몸에 감기는 워시드 린넨,
손끝으로 쓸어내릴 때 온기가 전해지는 도톰한 울 블랭킷.

여러분의 주말을 가장 편안하게 만들어주는 촉감은 무엇인가요? 
댓글로 여러분의 주말 힐링 텍스처를 남겨주세요.`,
        storiesFlow: [
          {
            step: 1,
            title: "Weekend Question",
            text: "집에 돌아왔을 때 가장 닿고 싶은 촉감은?",
          },
          {
            step: 2,
            title: "Option A vs B",
            text: "1. 바스락거리는 호텔 코튼 vs 2. 보들하고 내추럴한 워시드 린넨",
            pollQuestion: "내 최애 침구 촉감은?",
          },
          {
            step: 3,
            title: "Follow up",
            text: "여러분의 답변을 바탕으로 다음 F/W 패브릭 개발에 참고하겠습니다 :)",
          },
        ],
      },
      visualDirection: {
        space: "손으로 패브릭의 결을 만지는 감성적인 클로즈업",
        props: "린넨과 코튼 원단 샘플을 손으로 쥐고 있는 모습",
        lighting: "부드럽고 따뜻한 주말 오전 자연광",
        composition: "인간미와 감촉이 전달되는 매크로 핸드 샷",
        aspectRatio: "9:16",
        overlayText: "Touch of Weekend",
        promptEn:
          "Macro close up hand gently touching soft natural linen textile fabric, warm morning sun, peaceful aesthetic, tactile detail, 8k",
      },
      hashtags: ["#주말생각", "#촉감인테리어", "#스토리투표", "#취향공유", "#TactileHome"],
    },
    {
      id: "item-7",
      date: "2026-08-30",
      dayOfWeek: "일",
      topic: "일요일의 큐레이션: 일상에 차분한 결을 더하는 3가지 패브릭",
      purpose: "과장 없는 정갈한 톤의 신제품 및 주간 베스트 컬렉션 소개",
      contentType: "판매",
      channel: "Instagram Feed",
      status: "기획",
      coreMessage:
        "자극적인 할인 대신, 이번 주 고객들에게 가장 많은 사랑을 받은 스테디셀러의 쓰임새를 차분히 안내합니다.",
      depthLayer: "PRODUCT",
      includeEnglish: false,
      copywriting: {
        feedText: `이번 한 주 동안 여러분이 가장 많이 찾아주신 3가지 텍스타일을 소개합니다.

1. 워시드 린넨 베딩 세트 (Natural Beige)
세탁할수록 몸에 부드럽게 감기며, 사계절 내내 적절한 체온을 유지해 주는 스테디셀러.

2. Ash Pink 린넨 쿠션 커버
마티스의 회화에서 찾은 은은하고 그레이시한 핑크로, 밋밋한 소파에 부드러운 포인트가 되어줍니다.

3. 조각보 모티프 린넨 티매트
테이블 위에 올려두는 것만으로도 정갈한 찻자리를 완성해 주는 핸드메이드 소품.

과한 유행을 좇기보다, 10년 뒤에도 여전히 편안하게 곁에 두고 싶은 물건만을 만듭니다.
프로필 링크에서 3가지 컬렉션의 자세한 디테일을 확인하실 수 있습니다.`,
      },
      visualDirection: {
        space: "모던한 원목 다이닝 테이블 및 거실 전경",
        props: "3가지 제품이 조화롭게 어우러진 정갈한 큐레이션 컷",
        lighting: "단정하고 맑은 일요일 정오의 자연광",
        composition: "카탈로그처럼 정돈된 그리드 & 레이아웃 밸런스",
        aspectRatio: "1:1",
        overlayText: "Weekly Curation: Calm & Tactile",
        promptEn:
          "Editorial product flatlay of linen bedding swatch, ash pink cushion, and linen tea mat on oak surface, minimal ceramic cup, Kinfolk style photography, clean elegant layout, 8k",
      },
      hashtags: ["#위클리큐레이션", "#린넨베딩", "#쿠션인테리어", "#라이프스타일브랜드", "#SlowCurations"],
    },
  ],
};
