// ═══════════════════════════════════════════════════
//  섹션별 Mermaid Flow 다이어그램 생성기
// ═══════════════════════════════════════════════════

// ─── Activity Spec Generator용 ───
export function generateActivityFlow(sectionId, answers) {
  const arr = id => { const v = answers[id]; return Array.isArray(v) ? v : v ? [v] : []; };
  const get = id => answers[id] || null;

  switch (sectionId) {
    case "overview": return genActivityOverview(answers);
    case "learner": return genLearnerFlow(answers);
    case "content": return genContentHierarchy(answers);
    case "act_vocab": return genVocabFlow(answers);
    case "act_sentence": return genSentenceFlow(answers);
    case "act_listen": return genListenFlow(answers);
    case "act_write": return genWriteFlow(answers);
    case "act_quiz": return genQuizFlow(answers);
    case "act_game": return genGameFlow(answers);
    case "act_media": return genMediaFlow(answers);
    case "uiux": return genScreenNavFlow(answers);
    case "techstack": return genTechArchFlow(answers);
    case "dataapi": return genDataApiFlow(answers);
    case "infra": return genInfraFlow(answers);
    case "phase": return genPhaseGantt(answers);
    default: return "";
  }
}

// ─── Metaon Spec Generator용 ───
export function generateMetaonFlow(sectionId, answers) {
  switch (sectionId) {
    case "overview": return genMetaonOverview(answers);
    case "scope": return genScopeFlow(answers);
    case "scenarios": return genScenarioFlow(answers);
    case "content": return genMetaonContentFlow(answers);
    case "act_core": return genActCoreFlow(answers);
    case "act_detail": return genActDetailFlow(answers);
    case "frontend": return genFrontendArch(answers);
    case "uiux": return genMetaonScreenNav(answers);
    case "backend_core": return genBackendCore(answers);
    case "backend_api": return genBackendApi(answers);
    case "backend_data": return genBackendData(answers);
    case "backend_realtime": return genRealtimeFlow(answers);
    case "backend_security": return genSecurityFlow(answers);
    case "backend_perf": return genPerfFlow(answers);
    case "backend_log": return genLogFlow(answers);
    case "deploy": return genDeployFlow(answers);
    case "testing": return genTestingFlow(answers);
    case "payment": return genPaymentFlow(answers);
    case "admin": return genAdminFlow(answers);
    case "notification": return genNotificationFlow(answers);
    case "cms": return genCmsFlow(answers);
    case "migration": return genMigrationFlow(answers);
    case "gamification": return genGamificationFlow(answers);
    case "roadmap": return genMetaonRoadmap(answers);
    case "pm": return genPmFlow(answers);
    case "marketing": return genMarketingFlow(answers);
    case "i18n": return genI18nFlow(answers);
    case "pwa": return genPwaFlow(answers);
    case "diagrams": return genDiagramConfig(answers);
    case "output": return genOutputFlow(answers);
    default: return "";
  }
}

// ─── 전체 프로젝트 Flow (Activity) ───
export function generateActivityFullFlow(answers) {
  return `flowchart TB
    subgraph Auth["🔐 인증"]
      Login[로그인/회원가입] --> Avatar[아바타 생성]
    end
    subgraph Main["📚 메인"]
      Dashboard[대시보드] --> BookList[교재 목록]
      BookList --> LessonView[레슨/Day 선택]
    end
    subgraph Activities["🎮 액티비티"]
      LessonView --> VocabAct[어휘 학습]
      LessonView --> SentAct[문장 학습]
      LessonView --> ListenAct[듣기/말하기]
      LessonView --> WriteAct[쓰기/그리기]
      LessonView --> QuizAct[퀴즈/평가]
      LessonView --> GameAct[게임]
      LessonView --> MediaAct[멀티미디어]
    end
    subgraph Result["⭐ 결과"]
      VocabAct & SentAct & ListenAct & WriteAct & QuizAct & GameAct & MediaAct --> Score[점수/별점]
      Score --> Progress[학습 현황]
    end
    Auth --> Main
    Progress --> Dashboard
    style Auth fill:#6366f108,stroke:#6366f1
    style Main fill:#f59e0b08,stroke:#f59e0b
    style Activities fill:#8b5cf608,stroke:#8b5cf6
    style Result fill:#10b98108,stroke:#10b981`;
}

// ─── 전체 프로젝트 Flow (Metaon) ───
export function generateMetaonFullFlow(answers) {
  return `flowchart TB
    subgraph Client["🖥️ 클라이언트"]
      Web[Web App<br/>React/Next.js]
      PWA[PWA<br/>Service Worker]
    end
    subgraph Gateway["🔀 API Gateway"]
      BFF[BFF Layer]
      Auth[인증/인가<br/>JWT]
    end
    subgraph Services["⚙️ 백엔드 서비스"]
      UserSvc[User Service]
      ContentSvc[Content Service]
      StudySvc[Study Service]
      QuizSvc[QuizRoom<br/>WebSocket]
      AISvc[AI Tutor<br/>Gemini API]
      PaySvc[Payment Service]
      NotiSvc[Notification]
    end
    subgraph Storage["💾 스토리지"]
      DB[(PostgreSQL)]
      Redis[(Redis Cache)]
      S3[S3/CDN<br/>미디어 에셋]
    end
    subgraph Infra["☁️ 인프라"]
      CI[CI/CD Pipeline]
      Monitor[모니터링<br/>Sentry/GA]
    end
    Client --> Gateway
    Gateway --> Services
    Services --> Storage
    CI --> Services
    Monitor --> Services
    style Client fill:#3b82f608,stroke:#3b82f6
    style Gateway fill:#f59e0b08,stroke:#f59e0b
    style Services fill:#6366f108,stroke:#6366f1
    style Storage fill:#10b98108,stroke:#10b981
    style Infra fill:#ef444408,stroke:#ef4444`;
}

// ═══════════════════════════════════════════════════
//  개별 섹션 Flow 생성 함수들
// ═══════════════════════════════════════════════════

function genActivityOverview(a) {
  const model = a.ov3 || "B2C";
  const roles = Array.isArray(a.ov2) ? a.ov2 : [];
  let nodes = roles.map((r, i) => `    R${i}["${r}"]`).join("\n");
  let edges = roles.map((_, i) => `    R${i} --> App`).join("\n");
  return `flowchart LR
    subgraph Users["👥 사용자"]
${nodes || '    U1["사용자"]'}
    end
    App["📱 앱"] --> Learn[학습 시작]
    Learn --> Activity[액티비티]
    Activity --> Result[결과/점수]
    Result --> Dashboard[대시보드]
${edges || '    U1 --> App'}
    style Users fill:#6366f108,stroke:#6366f1`;
}

function genLearnerFlow(a) {
  const grades = Array.isArray(a.le1) ? a.le1 : ["학습자"];
  const goals = Array.isArray(a.le3) ? a.le3 : [];
  return `flowchart TD
    subgraph Target["🎓 학습 대상"]
${grades.map((g, i) => `      G${i}["${g}"]`).join("\n")}
    end
    subgraph Goals["🎯 교육 목표"]
${goals.length ? goals.map((g, i) => `      T${i}["${g}"]`).join("\n") : '      T0["목표 미선택"]'}
    end
    Difficulty{"난이도 조절"}
    Target --> Difficulty
    Difficulty --> Goals
    style Target fill:#ec489908,stroke:#ec4899
    style Goals fill:#10b98108,stroke:#10b981`;
}

function genContentHierarchy(a) {
  const hierarchy = a.ct1 || "교재→레슨→액티비티";
  if (hierarchy.includes("6단계")) {
    return `flowchart TD
    Brand["🏷️ 브랜드"] --> Series["📦 시리즈"]
    Series --> Book["📖 교재"]
    Book --> Lesson["📑 레슨"]
    Lesson --> Day["📅 Day"]
    Day --> Activity["🎮 액티비티"]
    Activity --> Words["단어 데이터"]
    Activity --> Sentences["문장 데이터"]
    Activity --> Media["미디어 에셋"]`;
  }
  return `flowchart TD
    Book["📖 교재"] --> Lesson["📑 레슨"]
    Lesson --> Day["📅 Day"]
    Day --> Activity["🎮 액티비티"]
    Activity --> Data["학습 데이터"]`;
}

function genVocabFlow(a) {
  const acts = Array.isArray(a.av1) ? a.av1 : [];
  const actNames = acts.map(a => a.split("—")[0].trim());
  if (actNames.length === 0) return `flowchart LR\n    Start[시작] --> Select[어휘 액티비티 선택] --> End[완료]`;
  return `flowchart LR
    Start(("▶ 시작"))
${actNames.map((a, i) => `    A${i}["${a}"]`).join("\n")}
    Score(("⭐ 점수"))
    Start --> ${actNames.map((_, i) => `A${i}`).join(" & ")}
${actNames.map((_, i) => `    A${i} --> Score`).join("\n")}`;
}

function genSentenceFlow(a) {
  const acts = Array.isArray(a.as1) ? a.as1 : [];
  const actNames = acts.map(a => a.split("—")[0].trim());
  if (actNames.length === 0) return `flowchart LR\n    Start[시작] --> Select[문장 액티비티 선택] --> End[완료]`;
  return `flowchart TD
    Start(("▶"))
${actNames.map((a, i) => `    S${i}["${a}"]`).join("\n")}
    Done(("⭐"))
    Start --> ${actNames.map((_, i) => `S${i}`).join(" & ")}
${actNames.map((_, i) => `    S${i} --> Done`).join("\n")}`;
}

function genListenFlow(a) {
  return `flowchart TD
    Audio["🔊 오디오 재생"] --> Listen["👂 듣기"]
    Listen --> Choose{"유형 선택"}
    Choose --> |객관식| Quiz["4지선다"]
    Choose --> |따라말하기| Shadow["쉐도잉"]
    Choose --> |녹음| Record["🎤 녹음"]
    Shadow --> STT["음성인식<br/>Web Speech API"]
    Record --> STT
    STT --> Score["발음 점수"]
    Quiz --> Result["정답 확인"]
    Score --> Complete["✅ 완료"]
    Result --> Complete`;
}

function genWriteFlow(a) {
  return `flowchart TD
    Start["✍️ 쓰기 시작"] --> Choose{"유형"}
    Choose --> |타이핑| Typing["키보드 입력"]
    Choose --> |손글씨| Canvas["Canvas 그리기"]
    Choose --> |그림| Draw["자유 그리기"]
    Typing --> Check["정답 체크"]
    Canvas --> Recognize["글씨 인식"]
    Draw --> Save["이미지 저장"]
    Check --> Result["결과"]
    Recognize --> Result
    Save --> Result`;
}

function genQuizFlow(a) {
  return `flowchart TD
    Start(("▶ 퀴즈 시작"))
    Start --> Shuffle["문제 셔플"]
    Shuffle --> Q{"문제 표시<br/>N번째/전체"}
    Q --> Select["보기 선택"]
    Select --> Judge{"정답?"}
    Judge --> |O| Correct["✅ 정답<br/>+점수"]
    Judge --> |X| Wrong["❌ 오답<br/>해설 표시"]
    Correct --> Next{"다음 문제?"}
    Wrong --> Next
    Next --> |있음| Q
    Next --> |없음| Result["⭐ 결과<br/>별점 계산"]`;
}

function genGameFlow(a) {
  return `flowchart TD
    Start(("🎮 게임 시작"))
    Start --> Init["초기화<br/>카드/오브젝트 배치"]
    Init --> Loop{"게임 루프<br/>requestAnimationFrame"}
    Loop --> Input["터치/클릭 입력"]
    Input --> Judge{"판정"}
    Judge --> |정답| Effect["✨ 이펙트<br/>+포인트"]
    Judge --> |오답| Penalty["💔 하트 감소"]
    Effect --> Check{"게임 종료?"}
    Penalty --> Check
    Check --> |계속| Loop
    Check --> |종료| Score["최종 점수<br/>Leaderboard"]`;
}

function genMediaFlow(a) {
  return `flowchart LR
    subgraph Input["📦 미디어 소스"]
      Video["🎬 동영상"]
      Audio["🎵 오디오"]
      YouTube["▶ YouTube"]
      Ebook["📖 E-book"]
    end
    subgraph Player["▶ 플레이어"]
      VP["Video.js"]
      AP["Howler.js"]
      YT["YouTube Embed"]
      PDF["PDF.js"]
    end
    Video --> VP
    Audio --> AP
    YouTube --> YT
    Ebook --> PDF
    VP & AP & YT & PDF --> Track["학습 기록 저장"]`;
}

function genScreenNavFlow(a) {
  const screens = Array.isArray(a.ui1) ? a.ui1 : [];
  if (screens.length === 0) return `flowchart LR\n    S[화면 미선택] --> Select[UI/UX 섹션에서 화면을 선택하세요]`;
  return `flowchart TD
    Splash["인트로"] --> Auth["로그인/회원가입"]
    Auth --> Dashboard["메인 대시보드"]
    Dashboard --> BookDetail["교재 상세"]
    BookDetail --> Activity["액티비티 뷰"]
    Activity --> Result["결과 화면"]
    Result --> Dashboard
    Dashboard --> Progress["학습 현황"]
    Dashboard --> Settings["설정"]
    Dashboard --> QuizRoom["퀴즈룸"]
    Dashboard --> AITutor["AI 튜터"]
    style Dashboard fill:#6366f120,stroke:#6366f1`;
}

function genTechArchFlow(a) {
  const fe = Array.isArray(a.ts1) ? a.ts1 : ["React"];
  const be = a.ts4 || "Node.js";
  const db = Array.isArray(a.ts5) ? a.ts5 : ["DB"];
  return `flowchart TB
    subgraph Frontend["🖥️ 프론트엔드"]
${fe.map((t, i) => `      FE${i}["${t.replace(/✅/g, "").trim()}"]`).join("\n")}
    end
    subgraph Backend["⚙️ 백엔드"]
      BE["${be.replace(/✅/g, "").trim()}"]
      AI["AI 튜터<br/>FastAPI + Gemini"]
    end
    subgraph Database["💾 데이터"]
${db.map((d, i) => `      DB${i}["${d.replace(/✅/g, "").trim()}"]`).join("\n")}
      CDN["S3 + CDN"]
    end
    Frontend --> Backend
    Backend --> Database
    style Frontend fill:#3b82f608,stroke:#3b82f6
    style Backend fill:#f59e0b08,stroke:#f59e0b
    style Database fill:#10b98108,stroke:#10b981`;
}

function genDataApiFlow(a) {
  return `flowchart LR
    subgraph Client["클라이언트"]
      React["React App"]
    end
    subgraph API["REST API"]
      UserAPI["/user/*"]
      StudyAPI["/study/*"]
      BookAPI["/book/*"]
    end
    subgraph DB["데이터"]
      PG[(PostgreSQL)]
      Redis[(Redis)]
    end
    React --> UserAPI & StudyAPI & BookAPI
    UserAPI & StudyAPI & BookAPI --> PG
    StudyAPI --> Redis`;
}

function genInfraFlow(a) {
  const feEnv = a.in1 || "Cloud Run";
  const beEnv = a.in2 || "Cloud Run";
  return `flowchart TB
    Dev["👨‍💻 개발자"] --> Git["GitHub"]
    Git --> CI["CI/CD<br/>Cloud Build"]
    CI --> Registry["Container Registry"]
    Registry --> FE["프론트엔드<br/>${feEnv.replace(/✅/g, "").trim()}"]
    Registry --> BE["백엔드<br/>${beEnv.replace(/✅/g, "").trim()}"]
    Registry --> AI["AI 튜터<br/>Cloud Run"]
    FE & BE & AI --> Monitor["📊 모니터링"]`;
}

function genPhaseGantt(a) {
  const duration = a.ph4 || "6주";
  return `gantt
    title 개발 로드맵
    dateFormat YYYY-MM-DD
    section Phase 1 - MVP
    인증 시스템           :a1, 2025-01-06, 2w
    교재 브라우징         :a2, after a1, 2w
    핵심 액티비티         :a3, after a1, 3w
    학습 진행률           :a4, after a3, 1w
    section Phase 2 - 확장
    나머지 액티비티       :b1, after a4, 4w
    음성인식/게임         :b2, after a4, 3w
    퀴즈룸 멀티플레이     :b3, after b1, 3w
    AI 튜터              :b4, after b2, 4w
    section Phase 3 - 고급
    구독/결제            :c1, after b3, 3w
    PWA 오프라인         :c2, after b4, 3w
    3D 메타버스          :c3, after c1, 4w`;
}

// ─── Metaon 전용 Flow 생성 함수들 ───

function genMetaonOverview(a) {
  return genActivityOverview(a);
}

function genScopeFlow(a) {
  return `flowchart TD
    subgraph Core["핵심 기능"]
      Auth["인증"] --> Browse["교재 탐색"]
      Browse --> Learn["학습"]
      Learn --> Track["진행 추적"]
    end
    subgraph Extended["확장 기능"]
      Quiz["퀴즈룸"]
      AI["AI 튜터"]
      Gamify["게이미피케이션"]
    end
    Core --> Extended
    style Core fill:#22c55e08,stroke:#22c55e
    style Extended fill:#f59e0b08,stroke:#f59e0b`;
}

function genScenarioFlow(a) {
  return `flowchart TD
    U["👤 사용자"] --> S1["회원가입"]
    S1 --> S2["교재 선택"]
    S2 --> S3["레슨 학습"]
    S3 --> S4{"학습 완료?"}
    S4 --> |예| S5["결과 확인"]
    S4 --> |아니오| S3
    S5 --> S6["다음 레슨"]
    S6 --> S2
    S5 --> S7["학습 현황"]`;
}

function genMetaonContentFlow(a) {
  return genContentHierarchy(a);
}

function genActCoreFlow(a) {
  return `flowchart LR
    subgraph Low["Low 난이도"]
      L1["Preview"]
      L2["FlashCard"]
      L3["Listening"]
    end
    subgraph Mid["Medium 난이도"]
      M1["Quiz"]
      M2["Matching"]
      M3["Unscramble"]
    end
    subgraph High["High 난이도"]
      H1["Dictation"]
      H2["Shadowing"]
      H3["GamePlay"]
    end
    Low --> Mid --> High`;
}

function genActDetailFlow(a) {
  return `flowchart TD
    Engine["액티비티 엔진"]
    Engine --> Route{"타입 라우팅<br/>actType"}
    Route --> Vocab["어휘 컴포넌트"]
    Route --> Sent["문장 컴포넌트"]
    Route --> Listen["듣기 컴포넌트"]
    Route --> Game["게임 컴포넌트"]
    Route --> Media["미디어 컴포넌트"]
    Vocab & Sent & Listen & Game & Media --> Shared["공유 인프라<br/>Timer/Score/Audio"]
    Shared --> Complete["onComplete<br/>점수 저장"]`;
}

function genFrontendArch(a) {
  return `flowchart TB
    subgraph UI["UI Layer"]
      Pages["Pages<br/>App Router"]
      Components["Components<br/>React"]
      Styles["Styles<br/>TailwindCSS"]
    end
    subgraph State["상태 관리"]
      Zustand["Zustand<br/>전역 상태"]
      RQ["React Query<br/>서버 데이터"]
      Local["localStorage"]
    end
    subgraph Infra["공유 인프라"]
      Audio["Audio<br/>Howler.js"]
      Canvas["Canvas<br/>Konva.js"]
      Speech["Speech<br/>Web Speech"]
    end
    UI --> State
    UI --> Infra`;
}

function genMetaonScreenNav(a) {
  return genScreenNavFlow(a);
}

function genBackendCore(a) {
  return `flowchart TD
    Client["클라이언트"] --> LB["로드 밸런서"]
    LB --> API["API Server<br/>Node.js/Express"]
    API --> MW{"미들웨어"}
    MW --> Auth["인증 검증"]
    MW --> Valid["입력 검증"]
    MW --> Rate["Rate Limit"]
    Auth & Valid & Rate --> Router["라우터"]
    Router --> Controller["컨트롤러"]
    Controller --> Service["서비스 레이어"]
    Service --> Repo["리포지토리"]
    Repo --> DB[(Database)]`;
}

function genBackendApi(a) {
  return `flowchart LR
    subgraph Endpoints["API 엔드포인트"]
      User["/user<br/>인증/프로필"]
      Book["/book<br/>교재/콘텐츠"]
      Study["/study<br/>학습 기록"]
      Quiz["/quizroom<br/>실시간 퀴즈"]
      AI["/ai<br/>AI 튜터"]
    end
    subgraph Format["응답 형식"]
      JSON["JSON Response"]
      WS["WebSocket"]
      Stream["Audio Stream"]
    end
    User & Book & Study --> JSON
    Quiz --> WS
    AI --> Stream`;
}

function genBackendData(a) {
  return `flowchart TD
    subgraph Primary["주 데이터베이스"]
      PG[(PostgreSQL)]
    end
    subgraph Cache["캐시"]
      Redis[(Redis)]
    end
    subgraph Media["미디어"]
      S3["AWS S3"]
      CDN["CloudFront CDN"]
    end
    API["API Server"] --> PG
    API --> Redis
    API --> S3
    S3 --> CDN
    CDN --> Client["클라이언트"]`;
}

function genRealtimeFlow(a) {
  return `flowchart LR
    C1["학생 A"] --> |WebSocket| Server["Socket.IO<br/>서버"]
    C2["학생 B"] --> |WebSocket| Server
    C3["학생 C"] --> |WebSocket| Server
    Server --> Room["퀴즈룸"]
    Room --> Sync["실시간 동기화"]
    Sync --> Score["점수판"]
    subgraph AI["AI 튜터"]
      Mic["🎤 마이크"] --> STT["STT"]
      STT --> Gemini["Gemini API"]
      Gemini --> TTS["TTS"]
      TTS --> Speaker["🔊 스피커"]
    end`;
}

function genSecurityFlow(a) {
  return `flowchart TD
    Login["로그인 요청"] --> Verify["자격 증명 검증"]
    Verify --> |성공| JWT["JWT 발급<br/>Access + Refresh"]
    Verify --> |실패| Deny["접근 거부"]
    JWT --> Client["클라이언트 저장"]
    Client --> Request["API 요청<br/>+ Bearer Token"]
    Request --> Guard{"토큰 검증"}
    Guard --> |유효| RBAC{"권한 확인<br/>RBAC"}
    Guard --> |만료| Refresh["토큰 갱신"]
    Guard --> |무효| Deny
    RBAC --> |허용| API["API 처리"]
    RBAC --> |거부| Deny403["403 Forbidden"]`;
}

function genPerfFlow(a) {
  return `flowchart LR
    Request["요청"] --> CDN{"CDN 캐시?"}
    CDN --> |Hit| Response["응답"]
    CDN --> |Miss| Redis{"Redis 캐시?"}
    Redis --> |Hit| Response
    Redis --> |Miss| DB["DB 쿼리"]
    DB --> Index["인덱스 최적화"]
    Index --> Response
    Response --> Compress["Gzip/Brotli"]
    Compress --> Client["클라이언트"]`;
}

function genLogFlow(a) {
  return `flowchart TD
    App["애플리케이션"] --> Logger["구조화 로그<br/>JSON"]
    Logger --> Level{"로그 레벨"}
    Level --> |ERROR/FATAL| Alert["🔔 알림<br/>Slack/PagerDuty"]
    Level --> |INFO/WARN| Collect["로그 수집<br/>CloudWatch"]
    Level --> |DEBUG| Dev["개발 콘솔"]
    Collect --> Dashboard["📊 대시보드"]
    Alert --> Dashboard
    App --> Sentry["Sentry<br/>에러 추적"]`;
}

function genDeployFlow(a) {
  return genInfraFlow(a);
}

function genTestingFlow(a) {
  return `flowchart LR
    Code["코드 작성"] --> Unit["단위 테스트<br/>Jest/Vitest"]
    Unit --> Integration["통합 테스트"]
    Integration --> E2E["E2E 테스트<br/>Playwright"]
    E2E --> Review["코드 리뷰"]
    Review --> Staging["스테이징 QA"]
    Staging --> Deploy["프로덕션 배포"]`;
}

function genPaymentFlow(a) {
  return `flowchart TD
    User["사용자"] --> Select["상품 선택<br/>구독/패키지"]
    Select --> PG["PG사 결제<br/>Stripe/토스"]
    PG --> |성공| Verify["결제 검증<br/>Webhook"]
    PG --> |실패| Retry["재시도"]
    Verify --> Activate["구독 활성화"]
    Activate --> Access["콘텐츠 접근 허용"]
    Access --> Renew{"갱신 시점?"}
    Renew --> |자동| PG
    Renew --> |만료| Expire["구독 만료"]`;
}

function genAdminFlow(a) {
  return `flowchart TD
    Admin["관리자 로그인"] --> Dashboard["📊 대시보드"]
    Dashboard --> Users["사용자 관리"]
    Dashboard --> Content["콘텐츠 관리"]
    Dashboard --> Stats["학습 통계"]
    Dashboard --> B2B["기관 관리"]
    Users --> Export["데이터 내보내기<br/>CSV/Excel"]
    Stats --> Report["리포트 생성"]`;
}

function genNotificationFlow(a) {
  return `flowchart LR
    Trigger["이벤트 발생"] --> Queue["알림 큐"]
    Queue --> Router{"채널 라우팅"}
    Router --> Push["웹 푸시<br/>FCM"]
    Router --> Email["이메일<br/>SendGrid"]
    Router --> InApp["인앱 알림"]
    Router --> Kakao["카카오<br/>알림톡"]
    Push & Email & InApp & Kakao --> User["👤 사용자"]`;
}

function genCmsFlow(a) {
  return `flowchart TD
    Create["콘텐츠 생성"] --> Review["리뷰/검증"]
    Review --> Staging["스테이징 미리보기"]
    Staging --> Publish["퍼블리시"]
    Publish --> S3["S3 업로드"]
    S3 --> CDN["CDN 배포"]
    CDN --> Invalidate["캐시 무효화"]
    Invalidate --> Live["라이브 반영"]`;
}

function genMigrationFlow(a) {
  return `flowchart LR
    subgraph Old["기존 시스템"]
      Unity["Unity"]
      Photon["Photon PUN"]
      NGUI["NGUI"]
    end
    subgraph New["신규 시스템"]
      React["React/Next.js"]
      SocketIO["Socket.IO"]
      Tailwind["TailwindCSS"]
    end
    Unity --> |렌더링 전환| React
    Photon --> |실시간 전환| SocketIO
    NGUI --> |UI 전환| Tailwind
    style Old fill:#ef444408,stroke:#ef4444
    style New fill:#22c55e08,stroke:#22c55e`;
}

function genGamificationFlow(a) {
  return `flowchart TD
    Learn["학습 완료"] --> Points["포인트 획득"]
    Points --> Level{"레벨업?"}
    Level --> |예| Badge["🏆 뱃지 획득"]
    Level --> |아니오| Shop
    Badge --> Shop["아이템 상점"]
    Shop --> Avatar["아바타 커스텀"]
    Learn --> Streak["연속 출석"]
    Streak --> Bonus["보너스 보상"]
    Points --> Ranking["🏅 랭킹"]`;
}

function genMetaonRoadmap(a) {
  return genPhaseGantt(a);
}

function genPmFlow(a) {
  return `flowchart LR
    Plan["기획"] --> Design["디자인"]
    Design --> Dev["개발<br/>Sprint"]
    Dev --> Test["테스트/QA"]
    Test --> Review["코드 리뷰"]
    Review --> Deploy["배포"]
    Deploy --> Monitor["모니터링"]
    Monitor --> Feedback["피드백"]
    Feedback --> Plan`;
}

function genMarketingFlow(a) {
  return `flowchart TD
    subgraph Acquire["사용자 획득"]
      ASO["앱스토어 ASO"]
      SEO["검색 SEO"]
      Ads["광고"]
      B2B["기관 영업"]
    end
    subgraph Engage["활성화"]
      Onboard["온보딩"]
      Push["푸시 알림"]
      Event["이벤트"]
    end
    subgraph Retain["리텐션"]
      Streak["스트릭"]
      Report["학부모 리포트"]
      Update["콘텐츠 업데이트"]
    end
    Acquire --> Engage --> Retain
    Retain --> |추천| Acquire`;
}

function genI18nFlow(a) {
  return `flowchart LR
    Source["소스 텍스트"] --> Extract["키 추출"]
    Extract --> Tool["번역 도구<br/>Crowdin/Lokalise"]
    Tool --> Review["번역 리뷰"]
    Review --> JSON["JSON 파일"]
    JSON --> App["앱 적용<br/>i18next"]
    App --> User["사용자<br/>언어 선택"]`;
}

function genPwaFlow(a) {
  return `flowchart TD
    Online["온라인 접속"] --> SW["Service Worker<br/>설치"]
    SW --> Cache["에셋 캐시"]
    Cache --> Offline["오프라인 학습"]
    Offline --> LocalDB["IndexedDB<br/>학습 기록 저장"]
    LocalDB --> Sync{"온라인 복귀?"}
    Sync --> |예| Upload["서버 동기화"]
    Sync --> |아니오| LocalDB`;
}

function genDiagramConfig(a) {
  return `flowchart TD
    Spec["Spec 문서"] --> Arch["시스템 아키텍처"]
    Spec --> Seq["시퀀스 다이어그램"]
    Spec --> State["상태 다이어그램"]
    Spec --> Flow["데이터 흐름"]
    Spec --> Gantt["간트 차트"]
    Spec --> Nav["화면 네비게이션"]
    style Spec fill:#6366f120,stroke:#6366f1`;
}

function genOutputFlow(a) {
  return `flowchart LR
    Answers["응답 데이터"] --> Generator["Spec 생성기"]
    Generator --> MD["Markdown"]
    Generator --> JSON["JSON"]
    Generator --> Diagram["다이어그램"]
    MD --> Doc["📄 문서"]
    JSON --> Import["🔄 재사용"]
    Diagram --> Visual["📊 시각화"]`;
}
