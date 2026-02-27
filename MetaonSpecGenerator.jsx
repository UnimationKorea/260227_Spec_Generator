import { useState, useRef, useCallback } from "react";

// ─── ENGINE & VERSION DATA ───
const ENGINES = [
  { id: "opus-4.6", name: "Claude Opus 4.6", desc: "최고급 추론 – 복잡한 아키텍처 설계 & 명세서 생성", tier: "flagship" },
  { id: "sonnet-4.5", name: "Claude Sonnet 4.5", desc: "균형잡힌 성능 – 일반 개발 태스크", tier: "balanced" },
  { id: "haiku-4.5", name: "Claude Haiku 4.5", desc: "빠른 응답 – 단순 질의 & 코드 스니펫", tier: "fast" },
];

const VERSIONS = [
  { id: "v3.0.0", date: "2026-02-27", dev: 2, engine: "opus-4.6", note: "30개 섹션 확장 – 성능/결제/CMS/알림/PWA/다이어그램/출력 설정 추가", status: "current" },
  { id: "v2.1.0", date: "2026-02-27", dev: 1, engine: "opus-4.6", note: "전체 도메인 통합 – Backend 상세 질문 강화", status: "archived" },
  { id: "v2.0.0", date: "2026-02-27", dev: 0, engine: "opus-4.6", note: "Metaon Spec + 초등교육앱 질문지 병합", status: "archived" },
  { id: "v1.0.0", date: "2026-02-27", dev: 0, engine: "opus-4.6", note: "초등 언어교육앱 질문지 초기 설계", status: "archived" },
];

// ─── MASSIVE SECTIONS DATA ───
const SECTIONS = [
  // ====== 1. PROJECT OVERVIEW ======
  {
    id: "overview", icon: "📋", title: "프로젝트 개요",
    desc: "프로젝트의 기본 정보, 목적, 범위 정의",
    questions: [
      { id: "o1", q: "프로젝트 공식 명칭은?", type: "text", placeholder: "예: Metaon Client Web App" },
      { id: "o2", q: "프로젝트의 핵심 목적을 서술해주세요.", type: "text", placeholder: "예: Unity 기반 메타버스 교육 클라이언트를 웹 앱으로 리팩토링" },
      { id: "o3", q: "프로젝트 유형은?", type: "single", options: ["신규 개발", "리팩토링/마이그레이션", "기능 확장", "유지보수 고도화"] },
      { id: "o4", q: "원본/레거시 프로젝트가 있나요?", type: "single", options: ["있음 – 전면 재작성", "있음 – 부분 재사용", "있음 – API만 재사용", "없음 – 완전 신규"] },
      { id: "o5", q: "원본 기술 스택은? (해당 시)", type: "multi", options: ["Unity C#", "React Native", "Flutter", "네이티브 iOS/Android", "PHP/Laravel", "Django/Python", "Spring/Java", "없음"] },
      { id: "o6", q: "주요 사용자 대상은?", type: "multi", options: ["학생(B2C)", "교사(B2B)", "학부모", "콘텐츠 관리자", "기관 관리자", "일반 소비자"] },
      { id: "o7", q: "비즈니스 모델은?", type: "multi", options: ["무료(광고 기반)", "프리미엄(인앱결제)", "구독(월/연간)", "B2B 라이선스", "쿠폰/코드 기반", "일회성 구매"] },
      { id: "o8", q: "목표 출시 일정은?", type: "single", options: ["1개월 이내", "1~3개월", "3~6개월", "6~12개월", "12개월 이상"] },
      { id: "o9", q: "Phase 분리 전략은?", type: "single", options: ["MVP → 확장 → 고급 (3단계)", "MVP → 정식 (2단계)", "빅뱅 릴리즈 (1단계)", "지속적 배포(CD)"] },
    ]
  },

  // ====== 2. SCOPE & REQUIREMENTS ======
  {
    id: "scope", icon: "🎯", title: "범위 & 요구사항",
    desc: "In/Out Scope, 기능 요구사항, 성공 지표",
    questions: [
      { id: "sc1", q: "핵심 기능(Must)을 모두 선택해주세요.", type: "multi", options: [
        "사용자 인증(회원가입/로그인)", "콘텐츠 브라우징(계층 탐색)", "학습 액티비티 엔진",
        "학습 진행/결과 관리", "즐겨찾기/최근 학습", "실시간 멀티플레이(퀴즈룸)",
        "AI 튜터(음성 채팅)", "아바타/캐릭터 시스템", "관리자 대시보드",
        "결제/구독 관리", "푸시 알림", "오프라인 학습"
      ]},
      { id: "sc2", q: "선택 기능(Should/Could)을 선택해주세요.", type: "multi", options: [
        "소셜 로그인(Google/Apple/Kakao)", "음성인식 학습", "그리기/캔버스 활동",
        "3D 메타버스 공간", "화면 녹화", "AR 기반 활동",
        "학부모 리포트", "챗봇 고객지원", "다국어 지원", "PWA 오프라인"
      ]},
      { id: "sc3", q: "제외 사항(Out of Scope)을 선택해주세요.", type: "multi", options: [
        "3D 메타버스(Phase 2 이후)", "AR 활동(네이티브 전용)", "NFC/하드웨어 연동",
        "화면 녹화(브라우저 제약)", "서브 모듈 분리 프로젝트", "해당없음"
      ]},
      { id: "sc4", q: "정량적 성공 지표(KPI)를 선택해주세요.", type: "multi", options: [
        "페이지 로드 < 3초(FCP)", "API 응답 < 200ms", "Lighthouse Performance > 80",
        "Lighthouse Accessibility > 90", "액티비티 커버리지 > 90%", "DAU/MAU 목표치",
        "사용자 만족도 4.0/5 이상", "이탈률 < 30%", "세션 평균 > 10분"
      ]},
      { id: "sc5", q: "비기능 요구사항 우선순위를 선택해주세요.", type: "multi", options: [
        "성능(빠른 로딩/응답)", "보안(JWT, HTTPS, XSS/CSRF)", "확장성(수평 스케일링)",
        "접근성(WCAG 2.1 AA)", "호환성(크로스 브라우저)", "가용성(99.9% SLA)",
        "모니터링(에러 추적, APM)", "국제화(i18n/L10n)"
      ]},
    ]
  },

  // ====== 3. USER SCENARIOS ======
  {
    id: "scenarios", icon: "🎬", title: "사용자 시나리오",
    desc: "핵심 사용자 플로우 & 엣지케이스 정의",
    questions: [
      { id: "sn1", q: "핵심 학습 플로우의 단계를 정의해주세요.", type: "multi", options: [
        "로그인 → 대시보드", "브랜드 → 시리즈 → 교재 탐색", "교재 → 레슨 → 데이 선택",
        "액티비티 실행 & 학습", "학습 완료 → 점수/별점 기록", "다음 액티비티 자동 이동"
      ]},
      { id: "sn2", q: "인증 플로우에 포함할 항목은?", type: "multi", options: [
        "이메일/비밀번호 가입", "소셜 로그인", "최초 아바타 생성", "비밀번호 찾기(보조 이메일)",
        "비밀번호 재설정", "자동 로그인(토큰)", "회원 탈퇴"
      ]},
      { id: "sn3", q: "실시간 멀티플레이 시나리오가 필요한가요?", type: "single", options: [
        "예 – 퀴즈룸(교사 생성 → 학생 참여 → 실시간 진행)", "예 – 협동 학습", "예 – 대전 모드", "필요없음"
      ]},
      { id: "sn4", q: "AI 튜터 시나리오가 필요한가요?", type: "single", options: [
        "예 – 실시간 음성 대화(STT/TTS)", "예 – 텍스트 기반 채팅만", "예 – 음성+텍스트 혼합", "필요없음"
      ]},
      { id: "sn5", q: "학습 현황 확인 시나리오가 필요한가요?", type: "multi", options: [
        "교재별 진행률", "레슨별 상세 기록", "출석 현황 캘린더", "포인트 누적 내역",
        "성취도 트렌드 차트", "학습 시간 통계", "오답 분석 리포트"
      ]},
      { id: "sn6", q: "주요 엣지 케이스를 선택해주세요.", type: "multi", options: [
        "네트워크 오류 시 재시도", "콘텐츠 미로드 시 자동 다운로드", "세션 만료 처리",
        "동시 접속 충돌", "비정상 종료 시 데이터 복구", "마이크 권한 거부 처리",
        "참가자 접속 끊김(멀티플레이)", "대용량 콘텐츠 타임아웃"
      ]},
    ]
  },

  // ====== 4. CONTENT ARCHITECTURE ======
  {
    id: "content", icon: "📦", title: "콘텐츠 아키텍처",
    desc: "교재/학습 콘텐츠 계층 구조 & 데이터 모델",
    questions: [
      { id: "ct1", q: "콘텐츠 계층 구조는?", type: "single", options: [
        "Brand → SeriesGroup → Series → Book → Lesson → Day → Activity",
        "Category → Course → Unit → Lesson → Activity",
        "World → Stage → Level → Mission",
        "커스텀 계층 구조"
      ]},
      { id: "ct2", q: "각 학습 단위(Day/Lesson)에 포함되는 데이터는?", type: "multi", options: [
        "단어 데이터(WordData)", "문장 데이터(SentenceData)", "스토리 스크립트(ScriptData)",
        "동영상 정보(MovieData)", "챈트/오디오", "E-book 데이터",
        "YouTube 링크", "워크북 정보", "이미지 리소스"
      ]},
      { id: "ct3", q: "콘텐츠 저장소/CDN은?", type: "single", options: [
        "AWS S3 + CloudFront", "GCP Cloud Storage + CDN", "Azure Blob + CDN",
        "자체 서버", "Firebase Storage"
      ]},
      { id: "ct4", q: "콘텐츠 형식은?", type: "multi", options: [
        "JSON 메타데이터", "이미지(PNG/JPG/SVG)", "오디오(MP3/WAV/PCM)",
        "비디오(MP4/WebM)", "PDF", "HTML5 인터랙티브"
      ]},
      { id: "ct5", q: "콘텐츠 경로 규칙이 있나요?", type: "single", options: [
        "예 – 계층별 디렉토리 구조 (예: {sg}/{series}/{bookId}/Lessons/L{n}/D{n}/)",
        "예 – 고유 ID 기반 플랫 구조", "아직 미정"
      ]},
      { id: "ct6", q: "콘텐츠 버전 관리 방식은?", type: "single", options: [
        "remoteVersion 숫자 비교", "해시 기반 캐시 무효화", "타임스탬프 비교", "없음 – 항상 최신 로드"
      ]},
      { id: "ct7", q: "학습 액티비티 총 타입 수는?", type: "text", placeholder: "예: 80+ 타입" },
    ]
  },

  // ====== 5. ACTIVITY ENGINE – CORE ======
  {
    id: "act_core", icon: "🎮", title: "액티비티 엔진 – 핵심",
    desc: "80+ 학습 액티비티 유형, 카테고리, 공통 인터페이스",
    questions: [
      { id: "ac1", q: "액티비티 카테고리를 선택해주세요.", type: "multi", options: [
        "어휘 학습 (VocaPreview, FlashCard, VocaQuiz, MatchingGame, MemoryGame, WordPuzzle 등)",
        "문장 학습 (SentenceCheck, SentenceUnscramble, Dictation, SentenceShadowing 등)",
        "읽기/스토리 (StoryReview, StoryBook, Reading, BookPage, Ebook 등)",
        "듣기 (Listening, Listen_Record, Sound_Word, Sound_Check 등)",
        "쓰기/그리기 (Writing, DrawBoard, WriteWord, TimerDraw 등)",
        "멀티미디어 (MoviePlay, Chant, AudioList, VideoList, YouTube, PPT 등)",
        "퀴즈/평가 (QuickCheck, QuizShow, TempletQuiz, ImageQuiz, OMR, Month_Test 등)",
        "인터랙티브 (Find_Image, FlipImage, DragImage, Catch_Image, ScratchWord 등)",
        "파닉스 (Phonics_01, Phonics_02, PhonicsBlandSimple 등)",
        "음성인식 (Speak_Recog_Word, Speak_Recog_Sentence, RolePlay 등)"
      ]},
      { id: "ac2", q: "액티비티 공통 인터페이스에 전달할 Props는?", type: "multi", options: [
        "actData (액티비티 메타데이터)", "dayData (Day 레벨 학습 데이터)",
        "wordList (단어 목록)", "sentenceList (문장 목록)",
        "scriptList (스토리 스크립트)", "onComplete(score, starPoint) 콜백",
        "사용자 설정(음량/속도)", "테마 정보"
      ]},
      { id: "ac3", q: "액티비티 라우팅 방식은?", type: "single", options: [
        "actType 코드 → 컴포넌트 동적 매핑 (Router)", "URL 기반 라우팅 (/activity/[actType])",
        "JSON 설정 기반 동적 로드", "하드코딩된 Switch/Case"
      ]},
      { id: "ac4", q: "Phase 1 MVP에 포함할 핵심 액티비티 수는?", type: "text", placeholder: "예: 20종 (Low/Medium 난이도 우선)" },
      { id: "ac5", q: "액티비티별 구현 난이도 분류 기준은?", type: "single", options: [
        "⭐Low / ⭐⭐Medium / ⭐⭐⭐High (3단계)", "Easy / Medium / Hard / Expert (4단계)", "스토리 포인트 기반"
      ]},
      { id: "ac6", q: "공유 인프라(Shared Infrastructure)에 포함되는 것은?", type: "multi", options: [
        "오디오 재생 엔진 (Howler.js)", "비디오 재생 엔진 (Video.js)",
        "캔버스/인터랙티브 엔진 (Konva.js/Canvas API)", "음성인식 엔진 (Web Speech API)",
        "타이머/점수 관리 모듈", "드래그앤드롭 엔진", "애니메이션 엔진 (Framer Motion)"
      ]},
    ]
  },

  // ====== 6. ACTIVITY ENGINE – DETAILED INTERACTION ======
  {
    id: "act_detail", icon: "🔧", title: "액티비티 – 상세 인터랙션",
    desc: "카테고리별 구체적 동작, 데이터 흐름, 채점 로직",
    questions: [
      { id: "ad1", q: "[어휘] VocaPreview의 표시 요소는?", type: "multi", options: [
        "단어 이미지", "영어 단어 텍스트", "한국어 뜻", "품사(WordClass)",
        "예문(Sentence)", "자동 음성 재생", "카드 슬라이드 넘기기"
      ]},
      { id: "ad2", q: "[어휘] MatchingGame의 매칭 방식은?", type: "multi", options: [
        "단어↔그림 매칭", "단어↔뜻 매칭", "영어↔한국어 매칭",
        "음성↔단어 매칭", "시간 제한 있음", "콤보 보너스 시스템"
      ]},
      { id: "ad3", q: "[문장] SentenceUnscramble의 재배열 방식은?", type: "multi", options: [
        "단어 블록 드래그 재배열", "Slice 기반 단어 분리", "정답 비교 자동 채점",
        "힌트 표시(첫 단어 고정)", "오답 시 흔들림 애니메이션"
      ]},
      { id: "ad4", q: "[문장] Dictation(받아쓰기) 입력 방식은?", type: "multi", options: [
        "타이핑 입력", "음성→텍스트(STT) 입력", "단어 블록 선택 방식",
        "오디오 반복 재생 가능", "힌트(빈칸 일부 표시)"
      ]},
      { id: "ad5", q: "[읽기] StoryBook 페이지 인터랙션은?", type: "multi", options: [
        "페이지별 영어+한국어 텍스트", "자동/수동 페이지 넘김", "TTS 따라읽기",
        "터치 시 단어 뜻 팝업", "녹음 & 비교 기능", "하이라이트 따라읽기"
      ]},
      { id: "ad6", q: "[듣기] 오디오 재생 컨트롤은?", type: "multi", options: [
        "재생/일시정지/정지", "속도 조절(0.5x~2.0x)", "구간 반복",
        "자막(SRT/SMI) 연동", "자동 다음 트랙", "셔플 모드"
      ]},
      { id: "ad7", q: "[쓰기] DrawBoard 기능은?", type: "multi", options: [
        "자유 그리기(펜)", "지우개", "색상 선택", "펜 굵기 조절",
        "이미지 배경 위 그리기", "저장(PNG/데이터URL)", "타이머 제한"
      ]},
      { id: "ad8", q: "[음성인식] 발음 평가 기준은?", type: "multi", options: [
        "음소 정확도(Phoneme)", "문장 유사도(Levenshtein)", "유창성 점수",
        "Web Speech API confidence 활용", "파형 시각화", "녹음 재생 비교"
      ]},
      { id: "ad9", q: "[퀴즈] 채점 및 결과 처리는?", type: "multi", options: [
        "즉시 정답/오답 표시", "문제별 점수(가중치)", "별점(Star Point) 산출",
        "오답 노트 저장", "API로 결과 전송 (/study/end)", "성취 배지 부여"
      ]},
      { id: "ad10", q: "[멀티미디어] 비디오 플레이어 기능은?", type: "multi", options: [
        "자막 표시(SMI/SRT 파싱)", "구간 반복", "스크린샷 캡처",
        "속도 조절", "전체화면", "PIP(Picture-in-Picture)"
      ]},
    ]
  },

  // ====== 7. FRONTEND ARCHITECTURE ======
  {
    id: "frontend", icon: "🖥️", title: "프론트엔드 아키텍처",
    desc: "기술 스택, 상태 관리, 컴포넌트 구조, 라우팅",
    questions: [
      { id: "f1", q: "프론트엔드 프레임워크는?", type: "single", options: [
        "React 18 + Next.js 14 (App Router)", "React 18 + Vite", "Vue 3 + Nuxt 3",
        "Svelte + SvelteKit", "Angular 17+"
      ]},
      { id: "f2", q: "언어 및 타입 시스템은?", type: "single", options: ["TypeScript (strict)", "TypeScript (loose)", "JavaScript (ES6+)"] },
      { id: "f3", q: "상태 관리 전략은?", type: "multi", options: [
        "Zustand (전역 상태)", "React Query/TanStack Query (서버 상태)",
        "Redux Toolkit", "Jotai/Recoil (원자적 상태)", "Context API만 사용"
      ]},
      { id: "f4", q: "UI 라이브러리/디자인 시스템은?", type: "multi", options: [
        "TailwindCSS", "Radix UI (접근성)", "shadcn/ui", "Material UI",
        "Ant Design", "자체 디자인 시스템", "CSS Modules"
      ]},
      { id: "f5", q: "애니메이션 라이브러리는?", type: "multi", options: [
        "Framer Motion", "CSS Animations/Transitions", "GSAP", "Lottie", "없음"
      ]},
      { id: "f6", q: "오디오/비디오 라이브러리는?", type: "multi", options: [
        "Howler.js (오디오)", "Video.js (비디오)", "Web Audio API (직접 구현)",
        "HTML5 Audio/Video만", "Tone.js", "Wavesurfer.js"
      ]},
      { id: "f7", q: "캔버스/인터랙티브 라이브러리는?", type: "multi", options: [
        "Konva.js", "Fabric.js", "Canvas API 직접 구현", "p5.js",
        "PixiJS", "Three.js (3D)", "없음"
      ]},
      { id: "f8", q: "라우팅 구조를 정의해주세요.", type: "multi", options: [
        "(auth) – 로그인/회원가입/아바타생성", "(main)/dashboard – 메인 대시보드",
        "(main)/series/[groupId] – 시리즈 목록", "(main)/book/[bookId] – 교재 상세",
        "(main)/lesson/[lessonId] – 레슨/데이 뷰", "(main)/activity/[actType] – 액티비티 실행",
        "(main)/study-status – 학습 현황", "(main)/ai-tutor – AI 튜터",
        "(main)/quiz-room – 퀴즈룸", "(main)/settings – 설정"
      ]},
      { id: "f9", q: "테마 시스템은?", type: "single", options: [
        "CSS Variables 기반 다크/라이트 + 브랜드 테마 (Blue/Green/SM)",
        "TailwindCSS dark mode만", "테마 없음(고정 디자인)"
      ]},
      { id: "f10", q: "브라우저 호환성 범위는?", type: "multi", options: [
        "Chrome 90+", "Safari 15+", "Firefox 90+", "Edge 90+",
        "iOS Safari", "Android Chrome", "태블릿 해상도", "크롬북"
      ]},
    ]
  },

  // ====== 8. BACKEND – CORE ======
  {
    id: "backend_core", icon: "⚙️", title: "백엔드 – 핵심 아키텍처",
    desc: "서버 기술 스택, 아키텍처 패턴, 데이터베이스 설계",
    questions: [
      { id: "be1", q: "백엔드 전략은?", type: "single", options: [
        "기존 API 서버 재사용 (엔드포인트 유지)", "기존 API 래핑 + 신규 BFF(Backend For Frontend)",
        "완전 신규 백엔드", "서버리스(Lambda/Cloud Functions)", "BaaS(Firebase/Supabase)"
      ]},
      { id: "be2", q: "백엔드 프레임워크/언어는?", type: "single", options: [
        "Node.js + Express/Fastify", "Python + FastAPI/Django", "Java + Spring Boot",
        "Go + Gin/Echo", "C# + ASP.NET", "기존 서버 (변경 없음)"
      ]},
      { id: "be3", q: "아키텍처 패턴은?", type: "single", options: [
        "모놀리식 (Monolith)", "마이크로서비스 (Microservices)", "모듈러 모놀리스",
        "서버리스 + API Gateway", "이벤트 기반 (Event-Driven)"
      ]},
      { id: "be4", q: "메인 데이터베이스는?", type: "single", options: [
        "PostgreSQL", "MySQL/MariaDB", "MongoDB", "DynamoDB",
        "Firebase Firestore", "SQLite", "기존 DB 유지 (변경 없음)"
      ]},
      { id: "be5", q: "캐시 레이어는?", type: "multi", options: [
        "Redis", "Memcached", "CloudFront/CDN 캐시", "Application 레벨 캐시",
        "React Query 캐시 (프론트만)", "없음"
      ]},
      { id: "be6", q: "메시지 큐/이벤트 버스가 필요한가요?", type: "single", options: [
        "RabbitMQ", "Apache Kafka", "AWS SQS/SNS", "Redis Pub/Sub",
        "Google Cloud Pub/Sub", "필요없음"
      ]},
      { id: "be7", q: "파일 스토리지는?", type: "single", options: [
        "AWS S3", "GCP Cloud Storage", "Azure Blob Storage", "자체 NFS/MinIO", "Firebase Storage"
      ]},
      { id: "be8", q: "검색 엔진이 필요한가요?", type: "single", options: [
        "Elasticsearch", "Algolia", "Meilisearch", "DB 전문 검색만", "필요없음"
      ]},
      { id: "be9", q: "ORM/ODM은?", type: "single", options: [
        "Prisma (TypeScript)", "TypeORM", "Sequelize", "Drizzle ORM",
        "SQLAlchemy (Python)", "Mongoose (MongoDB)", "Raw SQL / Query Builder", "기존 유지"
      ]},
      { id: "be10", q: "백그라운드 작업(Background Jobs)이 필요한가요?", type: "multi", options: [
        "학습 기록 배치 저장", "이메일/알림 발송 큐", "통계 집계 (일일/주간)",
        "콘텐츠 트랜스코딩 (이미지/비디오)", "데이터 백업/아카이빙",
        "스케줄링(Cron) 작업", "필요없음"
      ]},
      { id: "be11", q: "백그라운드 작업 프레임워크는?", type: "single", options: [
        "BullMQ (Redis 기반, Node.js)", "Celery (Python)", "AWS Lambda + EventBridge",
        "Cloud Tasks (GCP)", "node-cron / node-schedule", "필요없음"
      ]},
      { id: "be12", q: "API Gateway / 리버스 프록시는?", type: "single", options: [
        "Nginx", "AWS API Gateway", "GCP Cloud Endpoints", "Kong", "Traefik",
        "Cloud Run 내장 (불필요)", "없음"
      ]},
      { id: "be13", q: "서비스 간 통신 방식은? (마이크로서비스 시)", type: "multi", options: [
        "REST API (HTTP)", "gRPC", "메시지 큐 (비동기)", "이벤트 버스",
        "서비스 메시 (Istio/Linkerd)", "단일 서비스라 불필요"
      ]},
      { id: "be14", q: "미들웨어 스택은?", type: "multi", options: [
        "인증 미들웨어 (JWT 검증)", "CORS 미들웨어", "Rate Limiter 미들웨어",
        "요청 로깅 미들웨어", "에러 핸들링 미들웨어", "요청 바디 파서 (JSON/multipart)",
        "Helmet (보안 헤더)", "Compression (Gzip/Brotli)"
      ]},
    ]
  },

  // ====== 9. BACKEND – API DESIGN ======
  {
    id: "backend_api", icon: "🔌", title: "백엔드 – API 설계",
    desc: "REST/GraphQL 설계, 엔드포인트, 인증, 에러 처리",
    questions: [
      { id: "ba1", q: "API 스타일은?", type: "single", options: ["REST API", "GraphQL", "gRPC", "REST + GraphQL 하이브리드", "tRPC"] },
      { id: "ba2", q: "API 버전 관리 방식은?", type: "single", options: [
        "URL 경로 (/api/v1/...)", "헤더 기반 (Accept-Version)", "쿼리 파라미터 (?version=1)", "버전 관리 안함"
      ]},
      { id: "ba3", q: "인증 방식은?", type: "multi", options: [
        "JWT (Access + Refresh Token)", "JWT (Access Token만)", "OAuth 2.0",
        "Session 기반", "API Key", "Firebase Auth"
      ]},
      { id: "ba4", q: "사용자(User) API 엔드포인트를 선택해주세요.", type: "multi", options: [
        "POST /user/join (회원가입)", "POST /user/login (로그인)", "POST /user/firstavatar (아바타 생성)",
        "POST /user/findpass (비밀번호 찾기)", "POST /user/resetpass (비밀번호 변경)",
        "POST /user/changeNickname (닉네임 변경)", "POST /user/subemail (보조 이메일)",
        "POST /user/quitmember (회원 탈퇴)", "POST /user/attend (출석 체크)",
        "GET /user/getavataritem (아바타 아이템)", "GET /user/getleveltable (레벨 테이블)"
      ]},
      { id: "ba5", q: "교재(Book) API 엔드포인트를 선택해주세요.", type: "multi", options: [
        "GET /book/list (교재 목록)", "POST /user/favorites/add (즐겨찾기 추가)",
        "POST /user/favorites/delete (즐겨찾기 삭제)", "GET /user/favorites/list (즐겨찾기 목록)",
        "GET /user/recentlist (최근 학습 목록)"
      ]},
      { id: "ba6", q: "학습(Study) API 엔드포인트를 선택해주세요.", type: "multi", options: [
        "POST /study/start (학습 시작)", "POST /study/end (학습 종료)",
        "POST /study/bookpoint (교재 포인트)", "GET /study/getlearningstatus (학습 현황)",
        "GET /study/getlearningdetail (상세 기록)", "POST /study/checktotstamppoint (스탬프 확인)",
        "POST /study/gettotstamppoint (스탬프 수령)", "GET /study/getquiz (퀴즈 조회)",
        "POST /study/quizaccept (퀴즈 제출)", "POST /study/setbookword (단어 기록 저장)",
        "GET /study/getbookword (단어 기록 조회)", "POST /study/settestresult (테스트 결과)",
        "GET /study/getquickcheck (QuickCheck)", "GET /study/getreadingstudy (Reading 학습)"
      ]},
      { id: "ba7", q: "에러 응답 형식은?", type: "single", options: [
        "HTTP 상태코드 + JSON body {code, message, details}", "HTTP 상태코드만",
        "항상 200 + 내부 에러코드", "GraphQL errors 배열"
      ]},
      { id: "ba8", q: "API Rate Limiting이 필요한가요?", type: "single", options: [
        "예 – IP 기반", "예 – 사용자 기반", "예 – IP + 사용자 혼합", "필요없음"
      ]},
      { id: "ba9", q: "API 문서화 도구는?", type: "single", options: [
        "Swagger/OpenAPI 3.0", "Postman Collection", "GraphQL Playground", "직접 작성(Markdown)", "없음"
      ]},
      { id: "ba10", q: "API 요청/응답 공통 포맷은?", type: "single", options: [
        "{ success: boolean, data: T, error?: { code, message } }",
        "{ status: number, result: T, message: string }",
        "HTTP 상태코드 + 직접 데이터 반환",
        "GraphQL 표준 ({ data, errors })",
        "기존 포맷 유지 (레거시)"
      ]},
      { id: "ba11", q: "API 페이지네이션 방식은?", type: "single", options: [
        "Cursor 기반 (무한 스크롤 최적화)", "Offset/Limit 기반 (전통적)",
        "페이지 번호 기반 (page/perPage)", "혼합 (리스트는 Cursor, 테이블은 Offset)"
      ]},
      { id: "ba12", q: "파일 업로드 처리 방식은?", type: "single", options: [
        "Presigned URL (S3 직접 업로드)", "멀티파트 업로드 (서버 경유)",
        "Base64 인코딩 (소규모)", "Chunked Upload (대용량)", "필요없음"
      ]},
      { id: "ba13", q: "API 테스트 전략은?", type: "multi", options: [
        "Postman/Insomnia 수동 테스트", "Jest/Vitest 자동화 테스트",
        "pytest 자동화 테스트 (Python)", "Swagger Mock Server",
        "Contract Testing (Pact)", "부하 테스트 (k6/Locust)"
      ]},
      { id: "ba14", q: "WebSocket 외 추가 API 엔드포인트가 필요한 영역은?", type: "multi", options: [
        "POST /payment/* (결제 관련)", "POST /notification/* (알림 관련)",
        "GET /admin/* (관리자 전용)", "POST /upload/* (파일 업로드)",
        "GET /analytics/* (분석 데이터)", "GET /health (헬스체크)",
        "GET /version (앱 버전 체크)"
      ]},
    ]
  },

  // ====== 10. BACKEND – DATA MODEL ======
  {
    id: "backend_data", icon: "🗄️", title: "백엔드 – 데이터 모델",
    desc: "핵심 엔티티, 관계, 스키마 설계",
    questions: [
      { id: "bd1", q: "핵심 엔티티(테이블)를 선택해주세요.", type: "multi", options: [
        "User (사용자)", "PlayerInfo (플레이어 상세)", "BrandData (브랜드)",
        "SeriesGroup (시리즈 그룹)", "SeriesData (시리즈)", "BookData (교재)",
        "LessonData (레슨)", "DayData (데이)", "ActData (액티비티)",
        "WordData (단어)", "SentenceData (문장)", "ScriptData (스크립트)",
        "StudyInfo (학습 기록)", "ActStudyInfo (액티비티 학습 기록)",
        "PackageData (패키지)", "MPassInfo (구독 정보)", "AvatarItem (아바타 아이템)",
        "QuizRoom (퀴즈룸)", "ChatHistory (AI 대화 기록)"
      ]},
      { id: "bd2", q: "사용자(PlayerInfo) 핵심 필드는?", type: "multi", options: [
        "userName", "userId (email)", "userSubEmail", "point", "level",
        "levelPoint", "curGameTicket", "brandList", "mPassList",
        "favoritesList", "recentList", "studyInfo", "avatarData"
      ]},
      { id: "bd3", q: "학습 기록(StudyInfo) 저장 구조는?", type: "single", options: [
        "key: 'bookIdx_lesson_day' → ActStudyInfo[] (기존 방식)",
        "정규화된 관계형 테이블", "문서형(NoSQL) 중첩 구조", "시계열 데이터 저장"
      ]},
      { id: "bd4", q: "콘텐츠 메타데이터는 어디에 저장하나요?", type: "single", options: [
        "S3 JSON 파일 (info_lesson.json 등) – 기존 방식", "DB에 저장", "CMS 연동", "혼합 (S3 + DB)"
      ]},
      { id: "bd5", q: "데이터 마이그레이션이 필요한가요?", type: "single", options: [
        "예 – 기존 DB 스키마 변경 필요", "예 – 데이터 포맷 변환 필요",
        "아니오 – 기존 그대로 사용", "부분적 마이그레이션"
      ]},
      { id: "bd6", q: "DB 인덱싱 전략은?", type: "multi", options: [
        "userId 기반 인덱스", "bookIdx 기반 인덱스", "복합 인덱스(userId + bookIdx)",
        "생성일/수정일 인덱스", "전문 검색 인덱스", "ORM 자동 생성"
      ]},
      { id: "bd7", q: "관계(Relationship) 복잡도는?", type: "multi", options: [
        "User ↔ Brand (M:N, 구독/접근 권한)", "User ↔ Book (M:N, 학습 기록/즐겨찾기)",
        "Book → Lesson → Day → Activity (1:N 중첩)", "User → Avatar → Item (1:1:N)",
        "User → StudyInfo → ActStudyInfo (1:1:N)", "QuizRoom ↔ User (M:N, 참가자)",
        "User → ChatHistory (1:N, AI 대화 기록)"
      ]},
      { id: "bd8", q: "데이터 보존 정책은?", type: "multi", options: [
        "학습 기록 영구 보존", "삭제된 사용자 데이터 30일 후 영구 삭제",
        "AI 대화 기록 90일 보존", "로그 데이터 1년 보존 후 아카이빙",
        "콘텐츠 버전 히스토리 유지", "규정 미정"
      ]},
      { id: "bd9", q: "데이터 백업 전략은?", type: "multi", options: [
        "일일 자동 백업 (DB)", "주간 전체 백업", "실시간 레플리케이션",
        "Point-in-Time Recovery (PITR)", "S3 콘텐츠 버저닝",
        "재해 복구 (DR) 계획", "미정"
      ]},
      { id: "bd10", q: "데이터 시드/초기 데이터는?", type: "multi", options: [
        "관리자 계정 시드", "기본 브랜드/시리즈 데이터", "레벨 테이블 초기값",
        "아바타 아이템 초기 목록", "테스트 데이터 (개발환경)",
        "데모 교재 콘텐츠", "없음"
      ]},
    ]
  },

  // ====== 11. BACKEND – REALTIME & AI ======
  {
    id: "backend_realtime", icon: "🔌", title: "백엔드 – 실시간 & AI 서비스",
    desc: "WebSocket, 퀴즈룸, AI 튜터 백엔드, 마이크로서비스",
    questions: [
      { id: "br1", q: "실시간 통신 기술은?", type: "single", options: [
        "WebSocket (Socket.IO)", "WebSocket (ws 네이티브)", "SSE (Server-Sent Events)",
        "Firebase Realtime DB", "Pusher/Ably", "필요없음"
      ]},
      { id: "br2", q: "퀴즈룸 WebSocket 이벤트를 정의해주세요.", type: "multi", options: [
        "room:create (방 생성)", "room:join (참여)", "room:leave (퇴장)",
        "quiz:start (퀴즈 시작)", "quiz:question (문제 전송)", "quiz:answer (답안 제출)",
        "quiz:result (결과 공개)", "quiz:ranking (랭킹 업데이트)", "quiz:end (종료)"
      ]},
      { id: "br3", q: "AI 튜터 백엔드 기술 스택은?", type: "multi", options: [
        "Python 3.11 + FastAPI", "WebSocket (wss://)", "Gemini 2.5 Flash Native Audio",
        "google-genai SDK (≥1.60.0)", "Session Resumption (자동 재연결)",
        "Docker 컨테이너", "별도 마이크로서비스로 분리"
      ]},
      { id: "br4", q: "AI 튜터 WebSocket 프로토콜 – 클라이언트→서버:", type: "multi", options: [
        "config (JSON: system_prompt, voice_name) – 연결 직후 1회",
        "audio (Binary ArrayBuffer: 16kHz 16-bit PCM)",
        "text (JSON: 텍스트 입력 폴백)"
      ]},
      { id: "br5", q: "AI 튜터 WebSocket 프로토콜 – 서버→클라이언트:", type: "multi", options: [
        "status (연결/재연결 상태)", "user_transcript (사용자 음성→텍스트)",
        "text (AI 응답 텍스트 스트리밍)", "audio (AI 음성 Base64 PCM 24kHz)",
        "turn_complete (턴 완료 신호)", "error (에러 메시지)"
      ]},
      { id: "br6", q: "AI 오디오 파이프라인은?", type: "multi", options: [
        "마이크 → getUserMedia(16kHz, mono, 노이즈 제거)",
        "AudioWorkletNode → Float32→Int16 PCM 변환, 4096 샘플 버퍼링",
        "WebSocket binary 전송 → FastAPI → Gemini Live API",
        "AI 응답(24kHz PCM) → Base64 → JSON 전송",
        "브라우저: Base64→AudioBufferSource → 정밀 스케줄 재생"
      ]},
      { id: "br7", q: "AI 프리셋은 어떤 것이 필요한가요?", type: "multi", options: [
        "🌐 다국어 자동 감지", "🇰🇷 한국어 전용", "🇺🇸 English Only",
        "🎓 영어 회화 연습 (발음/문법 교정)", "📝 통역사 (한↔영)"
      ]},
      { id: "br8", q: "AI 세션 관리 정책은?", type: "multi", options: [
        "Session Resumption (끊김 시 자동 재연결)", "최대 재연결 횟수 제한 (예: 20회)",
        "세션 타임아웃 (예: 30분)", "대화 컨텍스트 유지", "대화 기록 DB 저장"
      ]},
    ]
  },

  // ====== 12. BACKEND – SECURITY & AUTH ======
  {
    id: "backend_security", icon: "🔐", title: "백엔드 – 보안 & 인증",
    desc: "JWT, OAuth, 권한 관리, 데이터 보호",
    questions: [
      { id: "bs1", q: "인증 토큰 관리 정책은?", type: "multi", options: [
        "Access Token (단기 만료: 1시간)", "Refresh Token (장기: 7일~30일)",
        "토큰 갱신(Rotation) 전략", "토큰 블랙리스트 관리",
        "localStorage 저장", "httpOnly Cookie 저장"
      ]},
      { id: "bs2", q: "권한(Authorization) 모델은?", type: "single", options: [
        "B2C + B2B 분리 (일반 사용자 vs 기관)", "역할 기반(RBAC: admin, teacher, student, parent)",
        "속성 기반(ABAC)", "단순 인증만 (로그인 여부)"
      ]},
      { id: "bs3", q: "콘텐츠 접근 제어는?", type: "multi", options: [
        "구독(M-Pass) 유효성 검증", "패키지 구매 확인", "기관 코드 기반 접근",
        "쿠폰 코드 기반 접근", "무료 콘텐츠는 제한 없음", "IP 기반 접근 제어"
      ]},
      { id: "bs4", q: "보안 조치를 선택해주세요.", type: "multi", options: [
        "HTTPS Only", "XSS 방어 (CSP, 이스케이핑)", "CSRF 토큰",
        "CORS 화이트리스트", "SQL Injection 방어 (ORM/Parameterized)",
        "Rate Limiting", "Input Validation/Sanitization",
        "감사 로그(Audit Log)", "개인정보 암호화"
      ]},
      { id: "bs5", q: "소셜 로그인 연동은?", type: "multi", options: [
        "Google OAuth", "Apple Sign In", "Kakao Login", "Naver Login",
        "Facebook Login", "필요없음"
      ]},
      { id: "bs6", q: "데이터 보호 규정 준수는?", type: "multi", options: [
        "COPPA (아동 개인정보)", "GDPR", "한국 개인정보보호법",
        "교육부 지침", "학부모 동의 프로세스", "해당없음"
      ]},
    ]
  },

  // ====== 13. INFRA & DEPLOYMENT ======
  {
    id: "deploy", icon: "☁️", title: "인프라 & 배포",
    desc: "클라우드, CI/CD, 컨테이너, 모니터링",
    questions: [
      { id: "dp1", q: "클라우드 인프라는?", type: "single", options: [
        "AWS", "GCP (Google Cloud)", "Azure", "멀티 클라우드", "온프레미스", "하이브리드"
      ]},
      { id: "dp2", q: "프론트엔드 배포 방식은?", type: "single", options: [
        "Vercel (Next.js 최적화)", "Netlify", "AWS Amplify",
        "Cloud Run (Docker)", "S3 + CloudFront (정적)", "자체 Nginx"
      ]},
      { id: "dp3", q: "백엔드 배포 방식은?", type: "single", options: [
        "Google Cloud Run", "AWS ECS/Fargate", "AWS Lambda + API Gateway",
        "Kubernetes (GKE/EKS)", "EC2/VM 직접 배포", "기존 서버 유지"
      ]},
      { id: "dp4", q: "AI 튜터 백엔드 배포는?", type: "single", options: [
        "Google Cloud Run (별도 서비스)", "같은 백엔드에 통합",
        "AWS Lambda", "Kubernetes Pod", "별도 VM"
      ]},
      { id: "dp5", q: "컨테이너화 전략은?", type: "multi", options: [
        "Docker (각 서비스별 Dockerfile)", "Docker Compose (로컬 개발용)",
        "멀티 스테이지 빌드 (Node→Nginx)", "컨테이너 미사용"
      ]},
      { id: "dp6", q: "CI/CD 파이프라인은?", type: "multi", options: [
        "GitHub Actions", "GitLab CI/CD", "Jenkins", "CircleCI",
        "Google Cloud Build", "AWS CodePipeline", "없음"
      ]},
      { id: "dp7", q: "환경 분리 전략은?", type: "multi", options: [
        "Development (로컬)", "Staging (테스트)", "Production (운영)",
        "Preview (PR별 미리보기)", "환경별 ENV 변수 관리"
      ]},
      { id: "dp8", q: "모니터링 & 관찰성(Observability)은?", type: "multi", options: [
        "에러 추적 (Sentry)", "APM (Datadog/New Relic)", "로그 수집 (CloudWatch/Stackdriver)",
        "업타임 모니터링", "성능 메트릭 대시보드", "알림(Slack/PagerDuty)",
        "분산 추적(Distributed Tracing)"
      ]},
      { id: "dp9", q: "핵심 환경 변수를 선택해주세요.", type: "multi", options: [
        "GOOGLE_API_KEY (Gemini AI)", "MODEL_ID (AI 모델)", "DATABASE_URL",
        "JWT_SECRET", "S3_BUCKET_URL", "REDIS_URL", "VITE_WS_URL (WebSocket)",
        "MODE (apikey/mock/vertex)", "NEXT_PUBLIC_API_URL"
      ]},
    ]
  },

  // ====== 14. TESTING & QA ======
  {
    id: "testing", icon: "🧪", title: "테스팅 & QA",
    desc: "테스트 전략, 자동화, 품질 관리",
    questions: [
      { id: "ts1", q: "테스트 전략은?", type: "multi", options: [
        "단위 테스트 (Unit Test)", "통합 테스트 (Integration)", "E2E 테스트",
        "컴포넌트 테스트", "스냅샷 테스트", "성능 테스트 (부하)", "접근성 테스트"
      ]},
      { id: "ts2", q: "테스트 프레임워크는?", type: "multi", options: [
        "Jest", "Vitest", "React Testing Library", "Playwright (E2E)",
        "Cypress (E2E)", "pytest (백엔드)", "Storybook (컴포넌트 문서)"
      ]},
      { id: "ts3", q: "테스트 커버리지 목표는?", type: "single", options: [
        "80% 이상", "60~80%", "핵심 로직만", "커버리지 측정 안함"
      ]},
      { id: "ts4", q: "QA 프로세스는?", type: "multi", options: [
        "코드 리뷰 필수", "PR 자동 테스트", "스테이징 환경 수동 QA",
        "디바이스 크로스 테스트", "접근성 감사(Lighthouse)", "보안 취약점 스캔"
      ]},
    ]
  },

  // ====== 15. UI/UX DESIGN ======
  {
    id: "uiux", icon: "🎨", title: "UI/UX 디자인",
    desc: "화면 설계, 디자인 시스템, 반응형, 접근성",
    questions: [
      { id: "ux1", q: "화면 목록을 선택해주세요.", type: "multi", options: [
        "UI-01 인트로", "UI-02 로그인", "UI-03 회원가입", "UI-04 아바타 생성",
        "UI-05 메인 대시보드", "UI-06 시리즈 목록", "UI-07 교재 목록",
        "UI-08 레슨/데이 뷰", "UI-09 액티비티 뷰 (80+ 타입)", "UI-10 학습 현황",
        "UI-11 퀴즈룸 로비", "UI-12 퀴즈룸 플레이", "UI-13 아바타/아이템",
        "UI-14 설정", "UI-15 즐겨찾기", "UI-16 AI 튜터 채팅", "UI-17 AI 튜터 설정"
      ]},
      { id: "ux2", q: "디자인 도구는?", type: "single", options: ["Figma", "Sketch", "Adobe XD", "직접 코딩", "기존 디자인 참조"] },
      { id: "ux3", q: "반응형 디자인 전략은?", type: "single", options: [
        "모바일 퍼스트 (Mobile First)", "데스크톱 퍼스트", "태블릿 중심 (교육용)",
        "적응형 (Adaptive, 기기별 분기)"
      ]},
      { id: "ux4", q: "접근성(A11y) 요구사항은?", type: "multi", options: [
        "WCAG 2.1 AA 준수", "키보드 네비게이션", "스크린리더 호환",
        "고대비 모드", "글자 크기 조절", "색맹 모드", "터치 영역 최소 44px"
      ]},
      { id: "ux5", q: "다크모드를 지원하나요?", type: "single", options: [
        "예 – 라이트/다크 전환", "예 – 시스템 설정 연동", "아니오 – 라이트만", "아니오 – 다크만"
      ]},
    ]
  },

  // ====== 16. MARKETING & GROWTH ======
  {
    id: "marketing", icon: "📣", title: "마케팅 & 그로스",
    desc: "사용자 획득, 리텐션, 분석, ASO/SEO",
    questions: [
      { id: "mk1", q: "사용자 획득 채널은?", type: "multi", options: [
        "앱스토어(ASO)", "SEO(검색 최적화)", "소셜미디어 광고(Meta/Instagram)",
        "검색 광고(Google Ads)", "학교/기관 B2B 영업", "인플루언서 마케팅",
        "학부모 커뮤니티(맘카페)", "교육 박람회", "추천 프로그램(레퍼럴)"
      ]},
      { id: "mk2", q: "리텐션 전략은?", type: "multi", options: [
        "푸시 알림", "일일 보상(출석 체크)", "주간/월간 챌린지",
        "학습 스트릭(연속 학습)", "게이미피케이션(배지/랭킹)", "이메일 뉴스레터",
        "학부모 리포트 알림", "콘텐츠 업데이트 알림"
      ]},
      { id: "mk3", q: "분석 도구는?", type: "multi", options: [
        "Google Analytics 4", "Firebase Analytics", "Mixpanel", "Amplitude",
        "Hotjar(히트맵)", "자체 분석 대시보드", "없음"
      ]},
      { id: "mk4", q: "추적할 핵심 이벤트는?", type: "multi", options: [
        "회원가입 완료", "첫 학습 완료", "교재 다운로드/시작", "액티비티 완료",
        "퀴즈룸 참여", "AI 튜터 세션 시작", "구독 전환", "이탈 지점"
      ]},
      { id: "mk5", q: "SEO 전략이 필요한가요?", type: "multi", options: [
        "SSR/SSG 기반 SEO", "구조화 데이터(JSON-LD)", "OG 태그(소셜 공유)",
        "사이트맵(XML)", "robots.txt 최적화", "SPA라서 SEO 불필요"
      ]},
      { id: "mk6", q: "A/B 테스트를 계획하나요?", type: "single", options: [
        "예 – 랜딩 페이지", "예 – 온보딩 플로우", "예 – 가격 정책", "추후 고려", "필요없음"
      ]},
    ]
  },

  // ====== 17. PROJECT MANAGEMENT ======
  {
    id: "pm", icon: "📊", title: "기획 & 프로젝트 관리",
    desc: "개발 방법론, 팀 구성, 일정, 문서화",
    questions: [
      { id: "pm1", q: "개발 방법론은?", type: "single", options: ["Agile Scrum", "Agile Kanban", "Waterfall", "Lean/XP", "혼합"] },
      { id: "pm2", q: "스프린트 주기는?", type: "single", options: ["1주", "2주", "3주", "4주", "스프린트 없음(칸반)"] },
      { id: "pm3", q: "팀 규모와 역할은?", type: "multi", options: [
        "PM/PO (기획)", "프론트엔드 개발자", "백엔드 개발자", "풀스택 개발자",
        "디자이너(UI/UX)", "QA 엔지니어", "DevOps 엔지니어", "콘텐츠 기획자",
        "AI/ML 엔지니어", "데이터 분석가", "1인 개발"
      ]},
      { id: "pm4", q: "협업 도구는?", type: "multi", options: [
        "Jira", "Linear", "Notion", "Slack", "Discord", "Figma",
        "GitHub Projects", "Confluence", "Google Workspace"
      ]},
      { id: "pm5", q: "코드 관리 전략은?", type: "multi", options: [
        "Git Flow", "GitHub Flow", "Trunk Based Development",
        "PR 필수 리뷰", "자동 CI 통과 조건", "시맨틱 버저닝"
      ]},
      { id: "pm6", q: "문서화 범위는?", type: "multi", options: [
        "Spec 문서 (기능 명세)", "API 문서 (Swagger)", "기술 다이어그램 (Mermaid)",
        "컴포넌트 문서 (Storybook)", "운영 가이드 (Runbook)", "온보딩 문서",
        "아키텍처 결정 기록(ADR)", "변경 로그(Changelog)"
      ]},
    ]
  },

  // ====== 18. MIGRATION STRATEGY ======
  {
    id: "migration", icon: "🔄", title: "마이그레이션 전략",
    desc: "기존 시스템에서 전환 시 변경점, 호환성",
    questions: [
      { id: "mg1", q: "주요 기술 변환 항목을 선택해주세요.", type: "multi", options: [
        "렌더링: Unity → React DOM + Canvas API", "씬 관리: Unity Scene → Next.js App Router",
        "UI: NGUI → React + TailwindCSS", "네트워킹: UnityWebRequest → Fetch/Axios",
        "실시간: Photon PUN → Socket.IO", "저장: PlayerPrefs → localStorage/IndexedDB",
        "에셋: Addressables → HTTP + 브라우저 캐시", "오디오: AudioClip → Web Audio/Howler.js",
        "비디오: VideoPlayer → HTML5 Video/Video.js", "녹음: Microphone → MediaRecorder API",
        "음성인식: 네이티브 → Web Speech API", "테마: Container_Thema → CSS Variables",
        "AI 튜터: 없음(신규) → Gemini + FastAPI + WebSocket"
      ]},
      { id: "mg2", q: "기존 API 재사용 범위는?", type: "single", options: [
        "전체 API 엔드포인트 재사용", "대부분 재사용 + 일부 신규 추가",
        "핵심만 재사용 + BFF 래핑", "전체 신규 개발"
      ]},
      { id: "mg3", q: "데이터 호환성은?", type: "single", options: [
        "기존 JSON 구조 그대로 사용", "TypeScript 타입으로 변환하되 구조 유지",
        "새 스키마로 마이그레이션", "점진적 변환"
      ]},
      { id: "mg4", q: "기존 앱과 병행 운영 기간은?", type: "single", options: [
        "병행 없음 – 즉시 전환", "1~3개월 병행", "3~6개월 병행",
        "6개월 이상 병행", "영구 병행 (선택적 사용)"
      ]},
    ]
  },

  // ====== 19. GAMIFICATION ======
  {
    id: "gamification", icon: "🏆", title: "게이미피케이션",
    desc: "보상, 포인트, 아바타, 랭킹 시스템",
    questions: [
      { id: "gm1", q: "포인트/보상 시스템은?", type: "multi", options: [
        "학습 포인트 (액티비티 완료)", "별점(Star Point, 교재별)",
        "레벨 시스템 (levelPoint)", "스탬프/출석 보상",
        "게임 티켓(curGameTicket)", "일일/주간 챌린지 보상"
      ]},
      { id: "gm2", q: "아바타 시스템은?", type: "multi", options: [
        "최초 아바타 생성 (firstavatar)", "아바타 아이템 (getavataritem)",
        "아이템 구매 (포인트 소비)", "아이템 장착/해제", "커스터마이징(색상/표정)",
        "아바타 없음"
      ]},
      { id: "gm3", q: "구독/패키지 시스템은?", type: "multi", options: [
        "M-Pass 구독 (IN_APP: 인앱결제)", "M-Pass 구독 (COUPON: 쿠폰)",
        "패키지 구매", "기관 코드 (productLogin)", "무료 체험"
      ]},
    ]
  },

  // ====== 20. ROADMAP ======
  {
    id: "roadmap", icon: "🗺️", title: "로드맵 & Phase 계획",
    desc: "MVP → 확장 → 고급 기능 단계별 계획",
    questions: [
      { id: "rd1", q: "Phase 1 (MVP)에 포함할 항목은?", type: "multi", options: [
        "인증 시스템 (UI-01~04)", "교재 브라우징 (UI-05~08)",
        "핵심 액티비티 20종 (Low/Medium)", "학습 진행 관리 (UI-10)",
        "즐겨찾기/최근 학습 (UI-15)"
      ]},
      { id: "rd2", q: "Phase 2 (확장)에 포함할 항목은?", type: "multi", options: [
        "나머지 액티비티 60+ 타입", "퀴즈룸 멀티플레이 (WebSocket)",
        "아바타 시스템", "음성인식 액티비티 (Web Speech API)",
        "캔버스/그리기 액티비티", "관리자 대시보드 (B2B)",
        "AI 튜터 라이브 채팅 통합"
      ]},
      { id: "rd3", q: "Phase 3 (고급)에 포함할 항목은?", type: "multi", options: [
        "3D 메타버스 공간 (Three.js/WebGL)", "화면 녹화 (MediaRecorder API)",
        "패키지/구독 관리", "모바일 PWA (오프라인 학습)"
      ]},
      { id: "rd4", q: "Phase 1 예상 기간은?", type: "single", options: [
        "4~6주", "6~8주", "8~12주", "12~16주", "16주 이상"
      ]},
    ]
  },

  // ====== 21. BACKEND – PERFORMANCE & OPTIMIZATION ======
  {
    id: "backend_perf", icon: "⚡", title: "백엔드 – 성능 & 최적화",
    desc: "캐싱 전략, DB 최적화, CDN, 부하 분산, 스케일링",
    questions: [
      { id: "bp1", q: "캐싱 전략을 상세하게 선택해주세요.", type: "multi", options: [
        "HTTP Cache-Control 헤더 (브라우저 캐시)", "CDN 엣지 캐시 (CloudFront/Fastly)",
        "Redis 서버 사이드 캐시 (API 응답)", "React Query staleTime/cacheTime (프론트엔드)",
        "IndexedDB 대용량 콘텐츠 캐시 (오프라인)", "Service Worker 캐시 (PWA)",
        "OPcache/Bytecode 캐시 (PHP 등)", "쿼리 결과 캐시 (Materialized View)"
      ]},
      { id: "bp2", q: "DB 쿼리 최적화 전략은?", type: "multi", options: [
        "N+1 쿼리 방지 (Eager Loading)", "인덱스 최적화 (EXPLAIN ANALYZE)",
        "읽기 전용 레플리카 (Read Replica)", "커넥션 풀링 (PgBouncer/ProxySQL)",
        "쿼리 캐싱 (Redis)", "배치 처리 (Bulk Insert/Update)",
        "파티셔닝 (대용량 테이블)", "Slow Query 모니터링"
      ]},
      { id: "bp3", q: "콘텐츠 로딩 최적화는?", type: "multi", options: [
        "이미지 Lazy Loading", "이미지 WebP/AVIF 변환", "오디오 스트리밍 (Range Request)",
        "비디오 Adaptive Bitrate (HLS/DASH)", "JSON 압축 (Gzip/Brotli)",
        "콘텐츠 프리로딩 (다음 액티비티)", "Skeleton UI (로딩 상태)",
        "병렬 콘텐츠 로드 (Promise.all)"
      ]},
      { id: "bp4", q: "CDN 설정은?", type: "multi", options: [
        "정적 에셋 CDN 배포 (S3+CloudFront)", "캐시 무효화 정책 (Invalidation)",
        "커스텀 도메인 + SSL", "오리진 쉴드 (Origin Shield)",
        "지역별 엣지 로케이션", "비용 최적화 (Transfer Acceleration)"
      ]},
      { id: "bp5", q: "부하 분산 & 스케일링 전략은?", type: "multi", options: [
        "로드 밸런서 (ALB/NLB)", "오토 스케일링 (CPU/메모리 기반)",
        "수평 확장 (Stateless 설계)", "데이터베이스 스케일링 (Vertical/Horizontal)",
        "WebSocket 세션 고정 (Sticky Session)", "Cloud Run 자동 확장 (0→N)"
      ]},
      { id: "bp6", q: "대용량 트래픽 처리 전략은?", type: "multi", options: [
        "큐 기반 비동기 처리 (학습 기록 저장)", "이벤트 소싱 (Event Sourcing)",
        "Debounce/Throttle (클라이언트 요청 제한)", "Connection Pooling",
        "서킷 브레이커 패턴", "Graceful Degradation"
      ]},
      { id: "bp7", q: "API 응답 최적화는?", type: "multi", options: [
        "페이지네이션 (Cursor/Offset)", "필드 선택 (Sparse Fieldsets/GraphQL)",
        "응답 압축 (Gzip/Brotli)", "ETag/If-None-Match (조건부 요청)",
        "응답 크기 제한", "Batch API (다중 요청 병합)"
      ]},
    ]
  },

  // ====== 22. BACKEND – ERROR HANDLING & LOGGING ======
  {
    id: "backend_log", icon: "📝", title: "백엔드 – 에러 핸들링 & 로깅",
    desc: "에러 패턴, 로깅, 알림, 디버깅, 감사 추적",
    questions: [
      { id: "bl1", q: "에러 핸들링 패턴은?", type: "multi", options: [
        "글로벌 에러 핸들러 (Express/FastAPI middleware)", "도메인별 커스텀 에러 클래스",
        "에러 코드 체계 (ERR_AUTH_001 등)", "사용자 친화적 에러 메시지 (코드 → 메시지 매핑)",
        "스택 트레이스 숨김 (프로덕션)", "Retry Logic (재시도 가능 에러 분류)",
        "Circuit Breaker (외부 서비스 장애 격리)", "Fallback 응답 (degraded mode)"
      ]},
      { id: "bl2", q: "로깅 전략은?", type: "multi", options: [
        "구조화 로그 (JSON format)", "로그 레벨 (DEBUG/INFO/WARN/ERROR/FATAL)",
        "요청 ID 추적 (Correlation ID)", "사용자 액션 로그 (Audit Trail)",
        "성능 로그 (API 응답 시간)", "보안 이벤트 로그 (로그인 시도 등)"
      ]},
      { id: "bl3", q: "로그 수집 & 저장소는?", type: "multi", options: [
        "CloudWatch Logs (AWS)", "Cloud Logging (GCP Stackdriver)",
        "ELK Stack (Elasticsearch+Logstash+Kibana)", "Loki + Grafana",
        "Datadog Logs", "파일 기반 로그 (로컬)"
      ]},
      { id: "bl4", q: "알림(Alerting) 정책은?", type: "multi", options: [
        "에러율 임계값 초과 시 알림", "API 응답 시간 지연 알림",
        "서버 다운 / 헬스체크 실패 알림", "디스크/메모리 사용률 알림",
        "사용자 리포트 기반 알림", "배포 실패 알림"
      ]},
      { id: "bl5", q: "알림 채널은?", type: "multi", options: [
        "Slack 웹훅", "이메일", "PagerDuty", "SMS", "Discord 웹훅", "카카오 알림톡"
      ]},
      { id: "bl6", q: "프론트엔드 에러 추적은?", type: "multi", options: [
        "Sentry (에러 리포팅)", "LogRocket (세션 리플레이)", "React Error Boundary",
        "Unhandled Promise Rejection 감지", "Performance Observer (Web Vitals)",
        "커스텀 에러 리포팅 API"
      ]},
      { id: "bl7", q: "감사 로그(Audit Log) 범위는?", type: "multi", options: [
        "사용자 인증 이벤트 (로그인/로그아웃)", "데이터 변경 이벤트 (CRUD)",
        "관리자 액션 추적", "결제/구독 변경 추적",
        "콘텐츠 접근 기록", "API 키/토큰 사용 기록", "필요없음"
      ]},
    ]
  },

  // ====== 23. PAYMENT & SUBSCRIPTION ======
  {
    id: "payment", icon: "💳", title: "결제 & 구독 관리",
    desc: "결제 게이트웨이, 구독 라이프사이클, 쿠폰, 인보이스",
    questions: [
      { id: "py1", q: "결제 수단을 선택해주세요.", type: "multi", options: [
        "인앱결제 (Google Play / App Store)", "신용카드/체크카드 (PG사)",
        "카카오페이", "네이버페이", "토스페이", "계좌이체",
        "쿠폰/코드 입력", "B2B 인보이스", "해당없음"
      ]},
      { id: "py2", q: "PG사(Payment Gateway)는?", type: "single", options: [
        "Stripe", "토스페이먼츠", "아임포트(포트원)", "KG이니시스",
        "NHN KCP", "인앱결제만 (PG 불필요)", "미정"
      ]},
      { id: "py3", q: "구독 모델 상세는?", type: "multi", options: [
        "M-Pass 월간 구독", "M-Pass 연간 구독", "인앱결제 (IN_APP) 타입",
        "쿠폰 (COUPON) 타입", "기관 라이선스 (B2B)", "무료 체험 기간 (Free Trial)",
        "자동 갱신", "수동 갱신"
      ]},
      { id: "py4", q: "구독 라이프사이클 이벤트는?", type: "multi", options: [
        "구독 시작", "구독 갱신 (자동/수동)", "구독 일시정지",
        "구독 해지 (즉시/기간 만료 후)", "결제 실패 → 재시도 (Dunning)",
        "환불 처리", "업그레이드/다운그레이드"
      ]},
      { id: "py5", q: "쿠폰/프로모션 시스템은?", type: "multi", options: [
        "할인 쿠폰 (% / 정액)", "기간 연장 쿠폰", "무료 체험 쿠폰",
        "B2B 기관 코드 (productLogin)", "추천인 보상 쿠폰", "이벤트 프로모션 코드"
      ]},
      { id: "py6", q: "결제/구독 관련 API가 필요한가요?", type: "multi", options: [
        "POST /payment/create (결제 생성)", "POST /payment/verify (결제 검증)",
        "GET /subscription/status (구독 상태)", "POST /subscription/cancel (구독 해지)",
        "POST /coupon/redeem (쿠폰 사용)", "GET /payment/history (결제 내역)",
        "Webhook 수신 (PG사 → 서버)"
      ]},
      { id: "py7", q: "인보이스/영수증 기능은?", type: "multi", options: [
        "이메일 영수증 발송", "인앱 결제 내역 조회", "PDF 영수증 생성",
        "세금계산서 (B2B)", "필요없음"
      ]},
    ]
  },

  // ====== 24. ADMIN DASHBOARD ======
  {
    id: "admin", icon: "👨‍💼", title: "관리자 대시보드",
    desc: "사용자 관리, 콘텐츠 관리, 학습 현황 통계, B2B 기능",
    questions: [
      { id: "am1", q: "관리자 유형은?", type: "multi", options: [
        "슈퍼 관리자 (전체 권한)", "콘텐츠 관리자 (교재/액티비티)",
        "기관 관리자 (B2B, 소속 학생만)", "교사 (학급 관리)", "CS 담당자 (사용자 지원)"
      ]},
      { id: "am2", q: "사용자 관리 기능은?", type: "multi", options: [
        "사용자 목록 조회/검색", "사용자 상세 정보 열람", "사용자 권한 변경",
        "사용자 비활성화/삭제", "비밀번호 초기화", "학습 기록 열람",
        "구독/결제 내역 관리", "사용자 일괄 등록 (CSV 업로드)"
      ]},
      { id: "am3", q: "콘텐츠 관리 기능은?", type: "multi", options: [
        "브랜드/시리즈 CRUD", "교재 등록/수정/삭제", "액티비티 구성 편집",
        "콘텐츠 버전 관리", "S3 파일 업로드 관리", "콘텐츠 퍼블리싱 워크플로우",
        "미리보기 기능"
      ]},
      { id: "am4", q: "학습 통계 대시보드에 표시할 지표는?", type: "multi", options: [
        "일별/주별/월별 활성 사용자 (DAU/WAU/MAU)", "교재별 학습 완료율",
        "평균 학습 시간", "액티비티별 정답률/난이도 분석",
        "이탈 지점 분석 (Funnel)", "학습 성취도 분포 (히스토그램)",
        "출석률 통계", "AI 튜터 사용 통계"
      ]},
      { id: "am5", q: "B2B 기관 관리 기능은?", type: "multi", options: [
        "기관 등록/관리", "기관별 학생 배정", "상품코드(productLogin) 발급",
        "기관별 학습 리포트", "기관별 커리큘럼 커스터마이징",
        "기관 관리자 계정 생성", "라이선스 만료 관리"
      ]},
      { id: "am6", q: "관리자 대시보드 기술 구현은?", type: "single", options: [
        "같은 Next.js 앱 내 /admin 경로", "별도 React 앱 (admin.metaon.com)",
        "별도 프레임워크 (React Admin, Retool 등)", "CMS 도구 활용 (Strapi, Sanity)"
      ]},
      { id: "am7", q: "데이터 내보내기 기능은?", type: "multi", options: [
        "CSV 내보내기", "Excel (XLSX) 내보내기", "PDF 리포트",
        "API를 통한 데이터 접근", "자동 정기 리포트 (이메일)", "필요없음"
      ]},
    ]
  },

  // ====== 25. NOTIFICATION SYSTEM ======
  {
    id: "notification", icon: "🔔", title: "알림 시스템",
    desc: "푸시 알림, 인앱 알림, 이메일, 카카오 알림톡",
    questions: [
      { id: "nf1", q: "알림 채널은?", type: "multi", options: [
        "인앱 알림 (알림 센터)", "웹 푸시 (Web Push API)", "이메일 알림",
        "카카오 알림톡", "SMS", "모바일 푸시 (FCM/APNS)", "해당없음"
      ]},
      { id: "nf2", q: "알림 트리거 이벤트는?", type: "multi", options: [
        "학습 리마인더 (미학습 시)", "학습 완료 축하", "일일 출석 리마인더",
        "새 콘텐츠 업데이트", "퀴즈룸 초대", "구독 만료 임박",
        "결제 완료/실패", "학부모 주간 리포트", "공지사항/이벤트"
      ]},
      { id: "nf3", q: "이메일 서비스는?", type: "single", options: [
        "SendGrid", "AWS SES", "Mailgun", "Postmark",
        "SMTP 직접 구성", "필요없음"
      ]},
      { id: "nf4", q: "알림 설정 관리는?", type: "multi", options: [
        "사용자별 알림 On/Off 설정", "채널별 선택 (이메일만, 푸시만 등)",
        "알림 빈도 조절 (즉시/요약)", "야간 방해 금지 모드",
        "관리자 일괄 발송 기능"
      ]},
      { id: "nf5", q: "웹 푸시 구현 방식은?", type: "single", options: [
        "Firebase Cloud Messaging (FCM)", "Web Push API + VAPID",
        "OneSignal", "Pusher Beams", "필요없음"
      ]},
    ]
  },

  // ====== 26. CMS & CONTENT MANAGEMENT ======
  {
    id: "cms", icon: "📁", title: "콘텐츠 관리 시스템 (CMS)",
    desc: "콘텐츠 제작, 버전 관리, 퍼블리싱 워크플로우, 에셋 관리",
    questions: [
      { id: "cm1", q: "콘텐츠 제작 도구/워크플로우는?", type: "single", options: [
        "자체 제작 도구 (기존 Unity Tool 대체)", "Headless CMS (Strapi/Sanity/Contentful)",
        "관리자 대시보드 내장 편집기", "JSON 파일 직접 편집 + S3 업로드",
        "스프레드시트 기반 (Google Sheets → JSON 변환)"
      ]},
      { id: "cm2", q: "콘텐츠 퍼블리싱 워크플로우는?", type: "single", options: [
        "작성 → 리뷰 → 승인 → 퍼블리시 (4단계)", "작성 → 퍼블리시 (즉시 반영)",
        "작성 → 스테이징 미리보기 → 퍼블리시 (3단계)", "버전 관리만 (Git 기반)"
      ]},
      { id: "cm3", q: "멀티미디어 에셋 관리 기능은?", type: "multi", options: [
        "이미지 업로드 & 자동 리사이징", "오디오 업로드 (MP3/WAV)",
        "비디오 업로드 & 트랜스코딩", "에셋 라이브러리 (검색/태그)",
        "S3 직접 업로드 (Presigned URL)", "CDN 캐시 무효화 트리거"
      ]},
      { id: "cm4", q: "콘텐츠 국제화(i18n) 지원은?", type: "multi", options: [
        "다국어 콘텐츠 (영어/한국어/중국어 등)", "지역별 콘텐츠 분기",
        "번역 워크플로우", "현재는 한국어+영어만", "필요없음"
      ]},
      { id: "cm5", q: "콘텐츠 QA 프로세스는?", type: "multi", options: [
        "자동 유효성 검사 (필수 필드, 이미지 존재 확인)", "미리보기 기능 (학습자 시점)",
        "교차 검증 (2인 이상 리뷰)", "자동 테스트 (액티비티 자동 실행)",
        "수동 QA 체크리스트", "없음"
      ]},
    ]
  },

  // ====== 27. INTERNATIONALIZATION (i18n) ======
  {
    id: "i18n", icon: "🌐", title: "국제화 & 다국어",
    desc: "다국어 지원, 지역화, RTL, 날짜/통화 형식",
    questions: [
      { id: "i1", q: "지원 언어는?", type: "multi", options: [
        "한국어 (기본)", "영어", "중국어 (간체)", "중국어 (번체)",
        "일본어", "베트남어", "스페인어", "현재 단일 언어만"
      ]},
      { id: "i2", q: "UI 텍스트 관리 방식은?", type: "single", options: [
        "next-intl / react-intl", "i18next (react-i18next)", "JSON 파일 기반 직접 구현",
        "CMS 기반 동적 번역", "단일 언어라 불필요"
      ]},
      { id: "i3", q: "지역화(Localization) 범위는?", type: "multi", options: [
        "UI 텍스트 번역", "날짜/시간 형식 (YYYY-MM-DD vs MM/DD/YYYY)",
        "숫자/통화 형식 (₩ / $ / ¥)", "콘텐츠 지역화 (교재 내용)",
        "RTL(우→좌) 레이아웃 지원", "타임존 처리", "단일 지역만 (한국)"
      ]},
      { id: "i4", q: "번역 관리 도구는?", type: "single", options: [
        "Crowdin", "Lokalise", "Phrase", "Google Sheets 기반", "직접 JSON 편집", "불필요"
      ]},
    ]
  },

  // ====== 28. PWA & OFFLINE ======
  {
    id: "pwa", icon: "📱", title: "PWA & 오프라인",
    desc: "Progressive Web App, Service Worker, 오프라인 학습, 동기화",
    questions: [
      { id: "pw1", q: "PWA 기능이 필요한가요?", type: "single", options: [
        "예 – 전체 PWA (설치+오프라인)", "예 – 설치만 (Add to Homescreen)",
        "예 – 오프라인 캐시만 (콘텐츠 프리로드)", "아니오 – 온라인 전용"
      ]},
      { id: "pw2", q: "Service Worker 캐시 전략은?", type: "multi", options: [
        "Cache First (정적 에셋)", "Network First (API 응답)",
        "Stale While Revalidate (콘텐츠)", "Cache Only (오프라인 폴백)",
        "Background Sync (학습 기록 동기화)", "Periodic Sync (주기적 콘텐츠 업데이트)"
      ]},
      { id: "pw3", q: "오프라인 학습 범위는?", type: "multi", options: [
        "교재 콘텐츠 사전 다운로드", "단어/문장 데이터 로컬 저장",
        "이미지/오디오 에셋 캐시", "학습 기록 로컬 저장 → 온라인 시 동기화",
        "오프라인 전용 액티비티 (제한적)", "전체 오프라인 불가"
      ]},
      { id: "pw4", q: "데이터 동기화 전략은?", type: "multi", options: [
        "온라인 복귀 시 자동 동기화", "충돌 해결 정책 (서버 우선/클라이언트 우선)",
        "큐 기반 동기화 (IndexedDB → API)", "실시간 동기화 (WebSocket)",
        "수동 동기화 (사용자 트리거)"
      ]},
      { id: "pw5", q: "앱 설치 프롬프트 전략은?", type: "single", options: [
        "자동 프롬프트 (브라우저 기본)", "커스텀 설치 배너 (특정 조건 시)",
        "설정 메뉴에서만 안내", "설치 프롬프트 없음"
      ]},
    ]
  },

  // ====== 29. DIAGRAM OUTPUT CONFIG ======
  {
    id: "diagrams", icon: "📐", title: "다이어그램 출력 설정",
    desc: "생성할 기술 다이어그램 종류 선택 (Mermaid 기반)",
    questions: [
      { id: "dg1", q: "시스템 아키텍처 다이어그램이 필요한가요?", type: "multi", options: [
        "전체 시스템 아키텍처 (Client → Backend → Storage)", "프론트엔드 컴포넌트 구조",
        "백엔드 서비스 구조 (마이크로서비스/모놀리스)", "데이터베이스 ERD",
        "네트워크/인프라 토폴로지", "AI 서비스 아키텍처"
      ]},
      { id: "dg2", q: "시퀀스 다이어그램이 필요한 시나리오는?", type: "multi", options: [
        "교재 학습 플로우 (핵심 경로)", "사용자 인증 플로우 (가입/로그인/토큰)",
        "퀴즈룸 멀티플레이 플로우", "학습 현황 조회 플로우",
        "AI 튜터 음성 채팅 플로우", "결제/구독 플로우",
        "콘텐츠 로딩 플로우", "오프라인→온라인 동기화 플로우"
      ]},
      { id: "dg3", q: "상태 다이어그램이 필요한 도메인은?", type: "multi", options: [
        "인증 상태 (미인증→로그인→토큰검증→인증완료)", "학습 세션 상태",
        "교재 다운로드 상태 (None→Downloading→Downloaded)", "퀴즈룸 상태",
        "AI 튜터 세션 상태 (연결→녹음→응답→재연결)", "구독 상태",
        "WebSocket 연결 상태"
      ]},
      { id: "dg4", q: "데이터 흐름(Flow) 다이어그램이 필요한 영역은?", type: "multi", options: [
        "콘텐츠 계층 구조 (Brand→Book→Activity)", "콘텐츠 로딩 아키텍처 (캐시 전략 포함)",
        "액티비티 엔진 아키텍처 (라우팅→컴포넌트→공유 인프라)",
        "상태 관리 구조 (Zustand/React Query/localStorage)",
        "API 엔드포인트 맵 (User/Book/Study/QuizRoom/AI)",
        "보안/인증 흐름 (JWT 발급→검증→갱신)"
      ]},
      { id: "dg5", q: "간트 차트(로드맵)가 필요한가요?", type: "single", options: [
        "예 – Phase별 상세 일정 (주 단위)", "예 – 대략적 일정 (월 단위)",
        "아니오 – 텍스트 기반 로드맵만"
      ]},
      { id: "dg6", q: "화면 네비게이션 맵이 필요한가요?", type: "single", options: [
        "예 – 전체 화면 연결 관계도", "예 – 핵심 경로만", "아니오"
      ]},
    ]
  },

  // ====== 30. OUTPUT DOCUMENT CONFIG ======
  {
    id: "output", icon: "📄", title: "출력 문서 설정",
    desc: "생성할 Spec 문서의 구성과 포맷 설정",
    questions: [
      { id: "out1", q: "출력 문서 포맷은?", type: "multi", options: [
        "Markdown (.md)", "Word 문서 (.docx)", "PDF", "HTML (인터랙티브)",
        "Notion 페이지", "Confluence 페이지"
      ]},
      { id: "out2", q: "Spec 문서에 포함할 섹션은?", type: "multi", options: [
        "1. 개요 (목적/범위/성공지표/프로토타입 지침)",
        "2. 사용자 시나리오 (5+ 시나리오, 엣지케이스)",
        "3. 기능 요구사항 (핵심 기능 표 + 상세 명세)",
        "4. 화면 설계 (UI/UX Spec, 화면 목록, 컨테이너 테마)",
        "5. 비기능 요구사항 (성능/보안/확장성/접근성)",
        "6. 기술 설계 (스택, 프로젝트 구조, 데이터 모델, API 규약)",
        "7. 원본 프로젝트 분석 (Reference, 핵심 데이터 흐름)",
        "8. 리팩토링 전략 (Phase 계획, 변환 매핑)",
        "9. AI 튜터 통합 명세 (아키텍처, 프로토콜, 오디오 파이프라인)",
        "10. 보안 & 인증 흐름 상세"
      ]},
      { id: "out3", q: "기술 다이어그램 문서를 별도로 생성하나요?", type: "single", options: [
        "예 – 별도 technical_diagrams.md 파일", "아니오 – Spec 문서에 통합",
        "두 가지 모두 (통합 + 별도)"
      ]},
      { id: "out4", q: "코드 예시 포함 범위는?", type: "multi", options: [
        "TypeScript 인터페이스/타입 정의 (전체)", "API 요청/응답 예시",
        "컴포넌트 구조 예시 (ActivityProps 등)", "프로젝트 디렉토리 구조",
        "환경 변수 설정 예시", "Docker/배포 설정 예시", "최소한만"
      ]},
      { id: "out5", q: "문서 상세도 수준은?", type: "single", options: [
        "매우 상세 (모든 API 파라미터, 에러 코드, 데이터 타입 포함)",
        "상세 (핵심 API 명세 + 데이터 모델 + 아키텍처)",
        "중간 (기능 목록 + 기술 스택 + 주요 플로우)",
        "요약 (개요 + 핵심 기능 + 로드맵)"
      ]},
      { id: "out6", q: "문서 타겟 독자는?", type: "multi", options: [
        "개발팀 (프론트엔드/백엔드)", "AI 코드 생성 (Cursor/Copilot/Claude)",
        "PM/기획자", "경영진/투자자", "외부 파트너 (B2B 기관)", "디자이너"
      ]},
      { id: "out7", q: "문서 언어는?", type: "single", options: [
        "한국어", "영어", "한국어 + 영어 (기술 용어 병기)", "영어 (기술 부분) + 한국어 (설명)"
      ]},
    ]
  },
];

// ─── SECTION GROUPS for sidebar navigation ───
const SECTION_GROUPS = [
  { label: "기획", color: "#22c55e", sections: ["overview", "scope", "scenarios", "pm", "roadmap"] },
  { label: "콘텐츠 & 액티비티", color: "#f59e0b", sections: ["content", "act_core", "act_detail", "gamification"] },
  { label: "프론트엔드", color: "#3b82f6", sections: ["frontend", "uiux"] },
  { label: "백엔드", color: "#ef4444", sections: ["backend_core", "backend_api", "backend_data", "backend_realtime", "backend_security", "backend_perf", "backend_log"] },
  { label: "서비스 & 기능", color: "#a855f7", sections: ["payment", "admin", "notification", "cms", "i18n", "pwa"] },
  { label: "운영 & 배포", color: "#06b6d4", sections: ["deploy", "testing", "migration", "marketing"] },
  { label: "출력 설정", color: "#f43f5e", sections: ["diagrams", "output"] },
];

// ─── 섹션별 MD 생성 ───
function generateSectionMD(section, answers) {
  let md = `## ${section.icon} ${section.title}\n\n`;
  let hasContent = false;
  section.questions.forEach(q => {
    const a = answers[q.id];
    if (a === undefined || a === "" || (Array.isArray(a) && a.length === 0)) return;
    hasContent = true;
    md += `**${q.q}**\n`;
    if (Array.isArray(a)) {
      md += a.map(v => `- ${v}`).join("\n") + "\n\n";
    } else {
      md += `${a}\n\n`;
    }
  });
  if (!hasContent) md += `_(응답 없음)_\n\n`;
  return md;
}

// ─── 전체 MD 생성 ───
function generateFullMD(answers, engine, version, SECTIONS_DATA, totalQ, answeredQ, progress) {
  let md = `# Metaon Spec Generator 응답\n\n**엔진:** ${engine.name}\n**버전:** ${version.id}\n**진행률:** ${answeredQ}/${totalQ} (${progress}%)\n**날짜:** ${new Date().toLocaleDateString("ko-KR")}\n\n---\n\n`;
  SECTIONS_DATA.forEach(sec => {
    const secAnswers = sec.questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== "" && (!Array.isArray(answers[q.id]) || answers[q.id].length > 0));
    if (secAnswers.length === 0) return;
    md += `## ${sec.icon} ${sec.title}\n\n`;
    secAnswers.forEach(q => { const a = answers[q.id]; md += `**${q.q}**\n${Array.isArray(a) ? a.map(v=>`- ${v}`).join("\n") : `- ${a}`}\n\n`; });
    md += "---\n\n";
  });
  return md;
}

// ─── 전체 Spec 문서 MD 생성 ───
function generateSpecDocMD(answers, engine, version, SECTIONS_DATA, totalQ, answeredQ, progress) {
  let md = `# 기능 스펙 문서 (Spec Document)\n\n`;
  md += `**프로젝트명:** ${answers.o1 || "(미입력)"}\n`;
  md += `**생성 엔진:** ${engine.name}\n`;
  md += `**버전:** ${version.id}\n`;
  md += `**작성일:** ${new Date().toLocaleDateString("ko-KR")}\n`;
  md += `**응답률:** ${answeredQ}/${totalQ} (${progress}%)\n\n---\n\n`;
  md += `## 1. 개요 (Overview)\n\n`;
  md += `### 1.1 목적\n${answers.o2 || "(미입력)"}\n\n`;
  md += `### 1.2 프로젝트 유형\n${answers.o3 || "(미입력)"}\n\n`;
  if(answers.o6) md += `### 1.3 대상 사용자\n${(Array.isArray(answers.o6)?answers.o6:["(미입력)"]).map(v=>`- ${v}`).join("\n")}\n\n`;
  if(answers.o7) md += `### 1.4 비즈니스 모델\n${(Array.isArray(answers.o7)?answers.o7:[]).map(v=>`- ${v}`).join("\n")}\n\n`;
  SECTIONS_DATA.forEach(sec => {
    const secAnswers = sec.questions.filter(q => {
      const v = answers[q.id];
      return v !== undefined && v !== "" && (!Array.isArray(v) || v.length > 0);
    });
    if (secAnswers.length === 0 || sec.id === "overview") return;
    md += `## ${sec.icon} ${sec.title}\n\n`;
    secAnswers.forEach(q => {
      const a = answers[q.id];
      md += `### ${q.q}\n`;
      if(Array.isArray(a)) md += a.map(v=>`- ${v}`).join("\n") + "\n\n";
      else md += `${a}\n\n`;
    });
    md += `---\n\n`;
  });
  return md;
}

// ─── MAIN APP ───
export default function MetaonSpecGenerator() {
  const [selectedEngine, setSelectedEngine] = useState("opus-4.6");
  const [activeSection, setActiveSection] = useState("overview");
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(null); // "engine" | "version" | null
  const [searchTerm, setSearchTerm] = useState("");

  const [showStats, setShowStats] = useState(false);
  const [copiedSec, setCopiedSec] = useState(null);

  const copySectionMD = (sec) => {
    const md = generateSectionMD(sec, answers);
    navigator.clipboard.writeText(md);
    setCopiedSec(sec.id);
    setTimeout(() => setCopiedSec(null), 2000);
  };

  const handleAnswer = useCallback((qId, value, type) => {
    setAnswers(prev => {
      if (type === "multi") {
        const current = prev[qId] || [];
        return current.includes(value)
          ? { ...prev, [qId]: current.filter(v => v !== value) }
          : { ...prev, [qId]: [...current, value] };
      }
      return { ...prev, [qId]: value };
    });
  }, []);

  const totalQ = SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);
  const answeredQ = Object.keys(answers).filter(k => {
    const v = answers[k];
    return v !== undefined && v !== "" && (!Array.isArray(v) || v.length > 0);
  }).length;
  const progress = Math.round((answeredQ / totalQ) * 100);
  const currentEngine = ENGINES.find(e => e.id === selectedEngine);
  const currentVersion = VERSIONS[0];

  const getSectionProgress = (sec) => {
    const answered = sec.questions.filter(q => {
      const v = answers[q.id];
      return v !== undefined && v !== "" && (!Array.isArray(v) || v.length > 0);
    }).length;
    return { answered, total: sec.questions.length, pct: Math.round((answered / sec.questions.length) * 100) };
  };

  const filteredSections = SECTIONS;

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", fontFamily: "'Noto Sans KR', -apple-system, sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#2d3748;border-radius:3px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .hv:hover{background:rgba(99,102,241,.08)!important;border-color:rgba(99,102,241,.25)!important}
        .chip{display:inline-flex;align-items:center;padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#94a3b8;cursor:pointer;font-size:12.5px;transition:all .2s;line-height:1.4;text-align:left;font-family:inherit;gap:6px}
        .chip:hover{border-color:rgba(99,102,241,.3);background:rgba(99,102,241,.06);color:#c7d2fe}
        .chip-on{border-color:#6366f1!important;background:rgba(99,102,241,.14)!important;color:#c7d2fe!important;box-shadow:0 0 0 1px rgba(99,102,241,.2)}
        .tinp{width:100%;padding:10px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#e2e8f0;font-size:13px;outline:none;transition:all .2s;font-family:inherit}
        .tinp:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,.12)}
        .tinp::placeholder{color:#475569}
        .mo{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fadeIn .15s}
        .mb{background:linear-gradient(170deg,#1a2234,#0f1629);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px;max-width:540px;width:92%;max-height:80vh;overflow-y:auto;animation:slideDown .2s;box-shadow:0 20px 50px rgba(0,0,0,.5)}
        .badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;letter-spacing:.3px}
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{ position:"sticky",top:0,zIndex:100,background:"rgba(8,11,20,.88)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,.05)",padding:"0 20px" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",height:52,gap:8 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginRight:16 }}>
            <div style={{ width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,#6366f1,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff" }}>M</div>
            <span style={{ fontSize:13,fontWeight:700,color:"#f1f5f9",letterSpacing:"-0.3px" }}>Metaon Spec Generator</span>
          </div>
          <div style={{ display:"flex",gap:4 }}>
            {[
              { key: "engine", label: "🧠 엔진" },
              { key: "version", label: "📦 버전관리" },
            ].map(m => (
              <button key={m.key} onClick={() => setShowModal(showModal === m.key ? null : m.key)}
                style={{ padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                  background: showModal===m.key ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,.05)",
                  color: showModal===m.key ? "#fff" : "#94a3b8", transition:"all .2s", fontFamily:"inherit" }}>
                {m.label}
              </button>
            ))}
            <button onClick={() => setShowModal(showModal === "export" ? null : "export")}
              style={{ padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                background: showModal==="export" ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(255,255,255,.05)",
                color: showModal==="export" ? "#fff" : "#94a3b8", transition:"all .2s", fontFamily:"inherit" }}>
              📤 내보내기
            </button>
            <button onClick={() => setShowStats(!showStats)}
              style={{ padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                background: showStats ? "linear-gradient(135deg,#f59e0b,#f97316)" : "rgba(255,255,255,.05)",
                color: showStats ? "#fff" : "#94a3b8", transition:"all .2s", fontFamily:"inherit" }}>
              📊 통계
            </button>
          </div>
          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:5 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#a78bfa",boxShadow:"0 0 6px #a78bfa" }}/>
              <span style={{ fontSize:11,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace" }}>{currentEngine.name}</span>
            </div>
            <span className="badge" style={{ background:"rgba(34,197,94,.12)",color:"#4ade80" }}>{currentVersion.id}</span>
            <div style={{ background:`linear-gradient(90deg,rgba(99,102,241,.15),rgba(168,85,247,.15))`,borderRadius:12,padding:"3px 10px",fontSize:11,color:"#a5b4fc",fontWeight:600 }}>
              {progress}% ({answeredQ}/{totalQ})
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MODALS ─── */}
      {showModal === "engine" && (
        <div className="mo" onClick={() => setShowModal(null)}>
          <div className="mb" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontSize:17,fontWeight:700,color:"#f1f5f9" }}>🧠 AI 엔진 선택</h2>
              <button onClick={() => setShowModal(null)} style={{ background:"rgba(255,255,255,.05)",border:"none",borderRadius:6,width:28,height:28,color:"#94a3b8",cursor:"pointer",fontSize:14 }}>✕</button>
            </div>
            {ENGINES.map(e => (
              <div key={e.id} onClick={() => setSelectedEngine(e.id)}
                style={{ padding:"14px 16px",borderRadius:10,border:`1px solid ${selectedEngine===e.id?"#6366f1":"rgba(255,255,255,.06)"}`,
                  background:selectedEngine===e.id?"rgba(99,102,241,.1)":"rgba(255,255,255,.02)",cursor:"pointer",marginBottom:8,transition:"all .2s" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:600,color:"#f1f5f9" }}>{e.name}</div>
                    <div style={{ fontSize:11,color:"#64748b",marginTop:2 }}>{e.desc}</div>
                  </div>
                  {selectedEngine===e.id && <span style={{ color:"#6366f1",fontSize:16 }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal === "version" && (
        <div className="mo" onClick={() => setShowModal(null)}>
          <div className="mb" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontSize:17,fontWeight:700,color:"#f1f5f9" }}>📦 버전 관리 (날짜_개발순서)</h2>
              <button onClick={() => setShowModal(null)} style={{ background:"rgba(255,255,255,.05)",border:"none",borderRadius:6,width:28,height:28,color:"#94a3b8",cursor:"pointer",fontSize:14 }}>✕</button>
            </div>
            {VERSIONS.map(v => (
              <div key={v.id} style={{ padding:"12px 14px",borderRadius:10,border:`1px solid ${v.status==="current"?"rgba(34,197,94,.25)":"rgba(255,255,255,.05)"}`,
                background:v.status==="current"?"rgba(34,197,94,.05)":"rgba(255,255,255,.015)",marginBottom:6 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:"#f1f5f9" }}>{v.id}</span>
                    <span className="badge" style={{ background:v.status==="current"?"rgba(34,197,94,.12)":"rgba(148,163,184,.1)", color:v.status==="current"?"#4ade80":"#94a3b8" }}>
                      {v.status==="current"?"현재":"아카이브"}
                    </span>
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#64748b" }}>{v.date}_{String(v.dev).padStart(2,"0")}</span>
                </div>
                <div style={{ fontSize:12,color:"#94a3b8" }}>{v.note}</div>
                <div style={{ fontSize:10,color:"#475569",marginTop:2 }}>엔진: {ENGINES.find(e=>e.id===v.engine)?.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal === "export" && (
        <div className="mo" onClick={() => setShowModal(null)}>
          <div className="mb" onClick={e => e.stopPropagation()} style={{ maxWidth:640 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontSize:17,fontWeight:700,color:"#f1f5f9" }}>📤 응답 내보내기</h2>
              <button onClick={() => setShowModal(null)} style={{ background:"rgba(255,255,255,.05)",border:"none",borderRadius:6,width:28,height:28,color:"#94a3b8",cursor:"pointer",fontSize:14 }}>✕</button>
            </div>
            {/* Summary by section group */}
            <div style={{ marginBottom:16 }}>
              {SECTION_GROUPS.map(group => {
                const groupSections = group.sections.map(sid => SECTIONS.find(s=>s.id===sid)).filter(Boolean);
                const gA = groupSections.reduce((s,sec) => s + getSectionProgress(sec).answered, 0);
                const gT = groupSections.reduce((s,sec) => s + sec.questions.length, 0);
                const gP = gT > 0 ? Math.round((gA/gT)*100) : 0;
                return (
                  <div key={group.label} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <div style={{ width:4,height:20,borderRadius:2,background:group.color }}/>
                    <span style={{ fontSize:12,fontWeight:600,color:"#e2e8f0",flex:1 }}>{group.label}</span>
                    <div style={{ width:80,height:4,borderRadius:2,background:"rgba(255,255,255,.06)",overflow:"hidden" }}>
                      <div style={{ height:"100%",background:group.color,width:`${gP}%` }}/>
                    </div>
                    <span style={{ fontSize:11,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",width:50,textAlign:"right" }}>{gA}/{gT}</span>
                  </div>
                );
              })}
            </div>
            {/* 섹션별 MD 내보내기 */}
            <div style={{ marginBottom:16,padding:"12px",borderRadius:10,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)" }}>
              <div style={{ fontSize:12,fontWeight:600,color:"#a5b4fc",marginBottom:8 }}>📋 섹션별 Markdown 복사</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                {SECTIONS.map(sec => {
                  const sp = getSectionProgress(sec);
                  if (sp.answered === 0) return null;
                  return (
                    <button key={sec.id} onClick={() => copySectionMD(sec)}
                      style={{ padding:"4px 8px",borderRadius:5,border:`1px solid ${copiedSec===sec.id?"rgba(34,197,94,.3)":"rgba(255,255,255,.06)"}`,
                        background:copiedSec===sec.id?"rgba(34,197,94,.08)":"rgba(255,255,255,.02)",
                        color:copiedSec===sec.id?"#4ade80":"#94a3b8",cursor:"pointer",fontSize:10,fontFamily:"inherit",display:"flex",alignItems:"center",gap:3,transition:"all .2s" }}>
                      <span>{sec.icon}</span>
                      <span>{sec.title}</span>
                      <span style={{ fontSize:8,opacity:.6 }}>{copiedSec===sec.id?"✓":""}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={() => {
                const exportData = { engine: selectedEngine, version: currentVersion.id, date: new Date().toISOString(), progress: `${answeredQ}/${totalQ}`, answers: {} };
                SECTIONS.forEach(sec => { sec.questions.forEach(q => { if (answers[q.id] !== undefined) exportData.answers[q.id] = { section: sec.title, question: q.q, answer: answers[q.id] }; }); });
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = `metaon-spec-answers-${new Date().toISOString().slice(0,10)}.json`; a.click();
                URL.revokeObjectURL(url);
              }} style={{ flex:1,padding:"10px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                📥 JSON 다운로드
              </button>
              <button onClick={() => {
                const md = generateFullMD(answers, currentEngine, currentVersion, SECTIONS, totalQ, answeredQ, progress);
                navigator.clipboard.writeText(md).then(() => alert("✅ Markdown이 클립보드에 복사되었습니다!"));
              }} style={{ flex:1,padding:"10px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.04)",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                📋 전체 Markdown 복사
              </button>
              <button onClick={() => {
                const md = generateFullMD(answers, currentEngine, currentVersion, SECTIONS, totalQ, answeredQ, progress);
                const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = `metaon-spec-${new Date().toISOString().slice(0,10)}.md`; a.click();
                URL.revokeObjectURL(url);
              }} style={{ flex:1,padding:"10px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)",background:"rgba(16,185,129,.15)",color:"#4ade80",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                📥 MD 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN LAYOUT ─── */}
      <div style={{ maxWidth:1280,margin:"0 auto",padding:"16px 20px 80px",display:"flex",gap:16 }}>
        
        {/* SIDEBAR */}
        <aside style={{ width:240,flexShrink:0,position:"sticky",top:68,alignSelf:"flex-start",maxHeight:"calc(100vh - 84px)",overflowY:"auto" }}>
          <div style={{ background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",borderRadius:12,padding:10 }}>
            {/* Search */}
            <input className="tinp" placeholder="🔍 섹션 검색..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
              style={{ marginBottom:8,fontSize:11,padding:"7px 10px" }} />
            
            <div style={{ fontSize:10,fontWeight:600,color:"#475569",textTransform:"uppercase",letterSpacing:"1px",padding:"4px 6px",marginBottom:4 }}>
              총 {SECTIONS.length}개 섹션 · {totalQ}문항
            </div>
            {SECTION_GROUPS.map(group => {
              const groupSections = group.sections.map(sid => SECTIONS.find(s=>s.id===sid)).filter(Boolean);
              const matchedSections = searchTerm
                ? groupSections.filter(s => s.title.includes(searchTerm) || s.desc.includes(searchTerm) || s.questions.some(q=>q.q.includes(searchTerm)))
                : groupSections;
              if (matchedSections.length === 0) return null;
              const groupAnswered = groupSections.reduce((sum,s) => sum + getSectionProgress(s).answered, 0);
              const groupTotal = groupSections.reduce((sum,s) => sum + s.questions.length, 0);
              return (
                <div key={group.label} style={{ marginBottom:6 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 6px",marginBottom:2 }}>
                    <div style={{ width:3,height:12,borderRadius:2,background:group.color,flexShrink:0 }}/>
                    <span style={{ fontSize:10,fontWeight:700,color:group.color,textTransform:"uppercase",letterSpacing:".5px" }}>{group.label}</span>
                    <span style={{ fontSize:9,color:"#475569",fontFamily:"'JetBrains Mono',monospace",marginLeft:"auto" }}>{groupAnswered}/{groupTotal}</span>
                  </div>
                  {matchedSections.map(sec => {
                    const p = getSectionProgress(sec);
                    return (
                      <div key={sec.id} onClick={() => setActiveSection(sec.id)}
                        style={{ padding:"6px 8px",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",gap:7,marginBottom:1,
                          border:`1px solid ${activeSection===sec.id?"rgba(99,102,241,.3)":"transparent"}`,
                          background:activeSection===sec.id?"rgba(99,102,241,.08)":"transparent",transition:"all .2s" }}>
                        <span style={{ fontSize:13,flexShrink:0 }}>{sec.icon}</span>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontSize:11,fontWeight:600,color:activeSection===sec.id?"#c7d2fe":"#94a3b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>
                            {sec.title}
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:1 }}>
                            <div style={{ flex:1,height:2,borderRadius:1,background:"rgba(255,255,255,.05)",overflow:"hidden" }}>
                              <div style={{ height:"100%",background:p.pct===100?"#4ade80":"#6366f1",width:`${p.pct}%`,transition:"width .3s" }}/>
                            </div>
                            <span style={{ fontSize:8,color:p.pct===100?"#4ade80":"#475569",fontFamily:"'JetBrains Mono',monospace" }}>{p.answered}/{p.total}</span>
                            <button
                              title="섹션 MD 복사"
                              style={{ fontSize:9, background:"none", border:"none", cursor:"pointer", padding:"1px", color: copiedSec===sec.id?"#4ade80":"#475569", flexShrink:0 }}
                              onClick={(e) => { e.stopPropagation(); copySectionMD(sec); }}
                            >
                              {copiedSec===sec.id ? "✓" : "📋"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {/* Global Progress */}
          <div style={{ marginTop:10,padding:12,borderRadius:10,background:"rgba(99,102,241,.04)",border:"1px solid rgba(99,102,241,.08)" }}>
            <div style={{ fontSize:11,fontWeight:600,color:"#a5b4fc",marginBottom:6 }}>전체 진행률</div>
            <div style={{ height:4,borderRadius:2,background:"rgba(255,255,255,.05)",overflow:"hidden" }}>
              <div style={{ height:"100%",borderRadius:2,background:"linear-gradient(90deg,#6366f1,#a78bfa)",width:`${progress}%`,transition:"width .4s" }}/>
            </div>
            <div style={{ fontSize:10,color:"#64748b",marginTop:4 }}>{answeredQ}/{totalQ} 문항 · {progress}%</div>
          </div>
        </aside>

        {/* CONTENT */}
        <main style={{ flex:1,minWidth:0 }}>
          {/* STATS DASHBOARD */}
          {showStats && (
            <div style={{ marginBottom:20,animation:"fadeIn .25s" }}>
              <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:14,padding:"22px 26px",marginBottom:12 }}>
                <h2 style={{ fontSize:17,fontWeight:700,color:"#f1f5f9",marginBottom:16 }}>📊 전체 응답 통계</h2>
                {/* Overall */}
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20 }}>
                  {[
                    { label:"총 섹션", value: SECTIONS.length, color:"#6366f1" },
                    { label:"총 문항", value: totalQ, color:"#8b5cf6" },
                    { label:"응답 완료", value: answeredQ, color:"#22c55e" },
                    { label:"진행률", value: `${progress}%`, color: progress===100?"#22c55e":"#f59e0b" },
                  ].map(s => (
                    <div key={s.label} style={{ background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.05)",borderRadius:10,padding:"14px 16px",textAlign:"center" }}>
                      <div style={{ fontSize:24,fontWeight:800,color:s.color,fontFamily:"'JetBrains Mono',monospace" }}>{s.value}</div>
                      <div style={{ fontSize:11,color:"#64748b",marginTop:2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* By group */}
                <div style={{ fontSize:13,fontWeight:600,color:"#e2e8f0",marginBottom:10 }}>도메인별 진행률</div>
                {SECTION_GROUPS.map(group => {
                  const gSecs = group.sections.map(sid => SECTIONS.find(s=>s.id===sid)).filter(Boolean);
                  const gA = gSecs.reduce((s,sec) => s + getSectionProgress(sec).answered, 0);
                  const gT = gSecs.reduce((s,sec) => s + sec.questions.length, 0);
                  const gP = gT>0?Math.round((gA/gT)*100):0;
                  return (
                    <div key={group.label} style={{ marginBottom:8 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                          <div style={{ width:4,height:14,borderRadius:2,background:group.color }}/>
                          <span style={{ fontSize:12,fontWeight:600,color:"#e2e8f0" }}>{group.label}</span>
                          <span style={{ fontSize:10,color:"#64748b" }}>({gSecs.length}개 섹션)</span>
                        </div>
                        <span style={{ fontSize:11,fontWeight:600,color:gP===100?"#4ade80":group.color,fontFamily:"'JetBrains Mono',monospace" }}>
                          {gA}/{gT} ({gP}%)
                        </span>
                      </div>
                      <div style={{ height:6,borderRadius:3,background:"rgba(255,255,255,.04)",overflow:"hidden" }}>
                        <div style={{ height:"100%",borderRadius:3,background:gP===100?"#4ade80":group.color,width:`${gP}%`,transition:"width .4s" }}/>
                      </div>
                      {/* Individual sections in group */}
                      <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginTop:6,paddingLeft:10 }}>
                        {gSecs.map(sec => {
                          const sp = getSectionProgress(sec);
                          return (
                            <button key={sec.id} onClick={()=>{setActiveSection(sec.id);setShowStats(false);}}
                              style={{ padding:"3px 8px",borderRadius:4,border:`1px solid ${sp.pct===100?"rgba(34,197,94,.2)":"rgba(255,255,255,.06)"}`,
                                background:sp.pct===100?"rgba(34,197,94,.06)":"rgba(255,255,255,.02)",color:sp.pct===100?"#4ade80":"#94a3b8",
                                fontSize:10,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4 }}>
                              <span>{sec.icon}</span>
                              <span>{sec.title}</span>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,opacity:.7 }}>{sp.pct}%</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Quick jump to incomplete sections */}
              <div style={{ background:"rgba(239,68,68,.04)",border:"1px solid rgba(239,68,68,.1)",borderRadius:12,padding:"16px 20px" }}>
                <div style={{ fontSize:13,fontWeight:600,color:"#fca5a5",marginBottom:10 }}>⚠️ 미완료 섹션 바로가기</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {SECTIONS.filter(s => getSectionProgress(s).pct < 100).map(sec => {
                    const sp = getSectionProgress(sec);
                    return (
                      <button key={sec.id} onClick={()=>{setActiveSection(sec.id);setShowStats(false);window.scrollTo({top:0,behavior:"smooth"});}}
                        style={{ padding:"6px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.03)",
                          color:"#e2e8f0",fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5 }}>
                        <span>{sec.icon}</span>
                        <span>{sec.title}</span>
                        <span style={{ padding:"1px 5px",borderRadius:3,background:sp.pct>0?"rgba(251,191,36,.12)":"rgba(239,68,68,.12)",
                          color:sp.pct>0?"#fbbf24":"#f87171",fontSize:9,fontFamily:"'JetBrains Mono',monospace" }}>
                          {sp.answered}/{sp.total}
                        </span>
                      </button>
                    );
                  })}
                  {SECTIONS.filter(s => getSectionProgress(s).pct < 100).length === 0 && (
                    <span style={{ fontSize:12,color:"#4ade80" }}>🎉 모든 섹션이 완료되었습니다!</span>
                  )}
                </div>
              </div>
            </div>
          )}
          {SECTIONS.filter(s => s.id === activeSection).map(section => {
            const sp = getSectionProgress(section);
            return (
              <div key={section.id} style={{ animation:"fadeIn .25s" }}>
                {/* Section Header */}
                <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:14,padding:"22px 26px",marginBottom:16 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ width:44,height:44,borderRadius:10,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>
                      {section.icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <h1 style={{ fontSize:19,fontWeight:700,color:"#f1f5f9",letterSpacing:"-0.3px" }}>{section.title}</h1>
                      <p style={{ fontSize:12.5,color:"#64748b",marginTop:2 }}>{section.desc}</p>
                    </div>
                    <button
                      onClick={() => copySectionMD(section)}
                      style={{ padding:"6px 12px",borderRadius:7,border:"1px solid rgba(255,255,255,.08)",background:copiedSec===section.id?"rgba(34,197,94,.1)":"rgba(255,255,255,.04)",color:copiedSec===section.id?"#4ade80":"#94a3b8",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap",transition:"all .2s" }}
                    >
                      {copiedSec===section.id ? "✅ 복사됨" : "📋 섹션 MD"}
                    </button>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:20,fontWeight:800,color:sp.pct===100?"#4ade80":"#6366f1",fontFamily:"'JetBrains Mono',monospace" }}>{sp.pct}%</div>
                      <div style={{ fontSize:10,color:"#64748b" }}>{sp.answered}/{sp.total} 응답</div>
                    </div>
                  </div>
                  <div style={{ marginTop:12,height:3,borderRadius:2,background:"rgba(255,255,255,.04)",overflow:"hidden" }}>
                    <div style={{ height:"100%",background:sp.pct===100?"#4ade80":"linear-gradient(90deg,#6366f1,#a78bfa)",width:`${sp.pct}%`,transition:"width .4s" }}/>
                  </div>
                </div>

                {/* Questions */}
                {section.questions.map((q, qi) => {
                  const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== "" && (!Array.isArray(answers[q.id]) || answers[q.id].length > 0);
                  return (
                    <div key={q.id} style={{ background:"rgba(255,255,255,.02)",border:`1px solid ${hasAnswer?"rgba(34,197,94,.15)":"rgba(255,255,255,.04)"}`,borderRadius:12,padding:"18px 22px",marginBottom:10,transition:"all .25s",animation:"fadeIn .3s" }}>
                      <div style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:12 }}>
                        <div style={{ minWidth:24,height:24,borderRadius:6,background:hasAnswer?"rgba(34,197,94,.12)":"rgba(255,255,255,.05)",color:hasAnswer?"#4ade80":"#475569",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",flexShrink:0 }}>
                          {hasAnswer ? "✓" : qi+1}
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:13.5,fontWeight:600,color:"#e2e8f0",lineHeight:1.5 }}>{q.q}</p>
                          {q.type === "multi" && <span style={{ fontSize:10,color:"#6366f1",fontWeight:500 }}>복수 선택</span>}
                        </div>
                      </div>
                      {q.type === "text" ? (
                        <input className="tinp" placeholder={q.placeholder||"답변 입력"} value={answers[q.id]||""} onChange={e=>handleAnswer(q.id,e.target.value,"text")}/>
                      ) : (
                        <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                          {q.options.map(opt => {
                            const sel = q.type==="multi" ? (answers[q.id]||[]).includes(opt) : answers[q.id]===opt;
                            return (
                              <button key={opt} className={`chip ${sel?"chip-on":""}`} onClick={()=>handleAnswer(q.id,opt,q.type)}>
                                {q.type==="multi" && (
                                  <span style={{ width:14,height:14,borderRadius:3,border:`1.5px solid ${sel?"#6366f1":"rgba(255,255,255,.15)"}`,background:sel?"#6366f1":"transparent",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",flexShrink:0 }}>
                                    {sel?"✓":""}
                                  </span>
                                )}
                                {q.type==="single" && (
                                  <span style={{ width:14,height:14,borderRadius:"50%",border:`1.5px solid ${sel?"#6366f1":"rgba(255,255,255,.15)"}`,background:sel?"#6366f1":"transparent",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                                    {sel && <span style={{ width:5,height:5,borderRadius:"50%",background:"#fff" }}/>}
                                  </span>
                                )}
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Nav Buttons */}
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:24 }}>
                  {SECTIONS.findIndex(s=>s.id===activeSection)>0 && (
                    <button onClick={()=>{const i=SECTIONS.findIndex(s=>s.id===activeSection);setActiveSection(SECTIONS[i-1].id);window.scrollTo({top:0,behavior:"smooth"});}}
                      style={{ padding:"10px 20px",borderRadius:10,border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.03)",color:"#94a3b8",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                      ← 이전
                    </button>
                  )}
                  <div style={{flex:1}}/>
                  {SECTIONS.findIndex(s=>s.id===activeSection)<SECTIONS.length-1 ? (
                    <button onClick={()=>{const i=SECTIONS.findIndex(s=>s.id===activeSection);setActiveSection(SECTIONS[i+1].id);window.scrollTo({top:0,behavior:"smooth"});}}
                      style={{ padding:"10px 20px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",boxShadow:"0 4px 12px rgba(99,102,241,.3)" }}>
                      다음 →
                    </button>
                  ) : (
                    <button onClick={()=>{
                      const md = generateSpecDocMD(answers, currentEngine, currentVersion, SECTIONS, totalQ, answeredQ, progress);
                      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `spec-document-${new Date().toISOString().slice(0,10)}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                      style={{ padding:"10px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 12px rgba(16,185,129,.3)" }}>
                      ✨ Spec 문서 생성
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}

