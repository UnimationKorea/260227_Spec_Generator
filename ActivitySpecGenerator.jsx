import { useState, useCallback, useEffect, useRef } from "react";
import MermaidDiagram from "./src/MermaidDiagram";
import WireframePreview from "./src/WireframePreview";
import { generateActivityFlow, generateActivityFullFlow } from "./src/flowGenerators";

// ════════════════════════════════════════════════════════
//  엔진 목록
// ════════════════════════════════════════════════════════
const ENGINES = [
  { id: "claude-opus-4-6",    label: "Claude Opus 4.6",    tier: "최고성능", color: "#7C3AED" },
  { id: "claude-sonnet-4-6",  label: "Claude Sonnet 4.6",  tier: "균형",     color: "#2563EB" },
  { id: "claude-haiku-4-5",   label: "Claude Haiku 4.5",   tier: "경량",     color: "#059669" },
];

// ════════════════════════════════════════════════════════
//  질문 데이터 — 초등 언어교육 앱 전용
// ════════════════════════════════════════════════════════
const SECTIONS = [
  // ── 1. 프로젝트 개요 ─────────────────────────────────
  {
    id: "overview", label: "프로젝트 개요", emoji: "📋", color: "#6366F1",
    desc: "앱의 목적·대상·전체 방향을 정의합니다",
    questions: [
      { id:"ov1", type:"single", text:"앱의 핵심 목적은?", hint:"가장 중요한 한 가지",
        options:["책 속 단어·문장을 액티비티로 반복 학습","책 내용을 퀴즈로 이해도 확인","단어·문장 학습 + 내용 이해를 모두 지원","AI 튜터와 회화·발음 연습"] },
      { id:"ov2", type:"multi", text:"주요 사용자 역할을 선택하세요", hint:"복수 선택",
        options:["학생(초등학생)","교사/학원 선생님","학부모","관리자(콘텐츠 등록)","B2B 기관 담당자"] },
      { id:"ov3", type:"single", text:"서비스 운영 모델은?",
        options:["B2C — 개인 직접 가입·결제","B2B — 학원·학교 기관 코드 기반","B2C + B2B 혼합","무료 공개 (광고·지원금)"] },
      { id:"ov4", type:"multi", text:"MVP 출시 때 반드시 포함할 기능은?", hint:"Must-have만",
        options:["회원가입·로그인","교재/책 목록 탐색","단어 학습 액티비티","문장 학습 액티비티","내용 이해 퀴즈","학습 진행률·결과 저장","학부모/교사 대시보드","AI 튜터 음성 채팅","실시간 멀티플레이 퀴즈룸","아바타·보상 시스템"] },
      { id:"ov5", type:"multi", text:"성공 지표(KPI)를 선택하세요",
        options:["FCP < 3초","API 응답 ≤ 200ms","Lighthouse Perf > 80","액티비티 전환 < 500ms","사용자 만족도 4.0/5 이상","일 활성 사용자(DAU) 목표 달성","학습 완료율 > 70%"] },
    ],
  },
  // ── 2. 학습 대상 & 교육 목표 ──────────────────────────
  {
    id: "learner", label: "학습 대상 & 교육 목표", emoji: "🎓", color: "#EC4899",
    desc: "학습자 특성과 교육적 목표를 구체화합니다",
    questions: [
      { id:"le1", type:"multi", text:"학습 대상 학년은?", hint:"복수 선택",
        options:["초등 1~2학년 (한글 기초 완료)","초등 3~4학년 (독립적 읽기 가능)","초등 5~6학년 (비판적 읽기)","미취학 (6~7세)","중학교 1학년 이상"] },
      { id:"le2", type:"multi", text:"주요 학습 언어는?",
        options:["영어 (EFL — 외국어로서의 영어)","한국어","영어+한국어 병행 (이중언어)","향후 다국어 확장"] },
      { id:"le3", type:"multi", text:"핵심 교육 목표를 선택하세요",
        options:["어휘 확장 (단어 인지·뜻·예문)","문장 구조 이해 (문법·어순)","읽기 유창성 (속도·정확도)","듣기 이해력","말하기/발음 연습","쓰기 (받아쓰기·작문)","책 내용 이해 및 독해력"] },
      { id:"le4", type:"single", text:"학습 난이도 조절 방식은?",
        options:["교재 레벨 고정 (선생님이 지정)","학생이 직접 선택","AI가 오답 패턴 분석 후 자동 추천","Lexile 지수 기반 자동 배정"] },
      { id:"le5", type:"multi", text:"동기부여·게임화 요소는?",
        options:["별점/포인트 적립","레벨업·뱃지","캐릭터·아바타 성장","순위표(랭킹)","스트릭(연속 출석)","가챠/상자 보상","학부모에게 성취 공유"] },
    ],
  },
  // ── 3. 콘텐츠 구조 ───────────────────────────────────
  {
    id: "content", label: "콘텐츠 구조", emoji: "📚", color: "#F59E0B",
    desc: "책·교재 계층 구조와 데이터 형식을 정의합니다",
    questions: [
      { id:"ct1", type:"single", text:"콘텐츠 계층 구조는?",
        options:["브랜드→시리즈→교재→레슨→Day→액티비티 (6단계)","교재→챕터→Day→액티비티 (4단계)","교재→레슨→액티비티 (3단계)","단순 카드 목록 (단일)"] },
      { id:"ct2", type:"multi", text:"교재 1 Day에 포함될 데이터 유형은?",
        options:["단어 목록 (영어·뜻·품사·예문·이미지URL·오디오URL)","문장 목록 (영어·뜻·슬라이스·빈칸인덱스·오디오)","스토리 스크립트 (페이지·영어·뜻)","동영상 (videoPath·자막smi)","E-book (PDF/이미지 슬라이드)","YouTube 링크","워크북(프린트용 PDF)"] },
      { id:"ct3", type:"single", text:"콘텐츠(JSON·미디어)는 어디에 저장하나요?",
        options:["AWS S3 + CloudFront CDN (기존 유지)","Google Cloud Storage","Firebase Storage","자체 서버 파일시스템"] },
      { id:"ct4", type:"multi", text:"콘텐츠 캐싱 전략은?",
        options:["React Query (staleTime 5분)","브라우저 Cache-Control 헤더","IndexedDB (오디오·이미지 오프라인)","Service Worker (PWA 오프라인)","콘텐츠 미리 불러오기 (Prefetch)"] },
      { id:"ct5", type:"single", text:"콘텐츠 관리(등록·수정)는 누가 하나요?",
        options:["개발자가 직접 DB/S3에 업로드","관리자 웹 대시보드에서 업로드","교사 계정이 직접 등록","Google Sheets 연동으로 관리"] },
    ],
  },
  // ── 4. 액티비티 — 어휘 학습 ─────────────────────────
  {
    id: "act_vocab", label: "액티비티 — 어휘 학습", emoji: "🔤", color: "#8B5CF6",
    desc: "단어 인지·뜻·발음을 위한 액티비티를 설계합니다",
    questions: [
      { id:"av1", type:"multi", text:"구현할 어휘 학습 액티비티를 선택하세요",
        options:["VocaPreview — 이미지+음성+뜻 순서대로 보기","FlashCard — 앞(단어)/뒤(뜻·예문) 카드 뒤집기","VocaQuiz — 4지선다 객관식 단어 퀴즈","MatchingGame — 단어↔뜻 카드 매칭","MemoryGame — 뒤집어진 짝 찾기","WordBox — 단어 박스 분류하기","WordPuzzle — 알파벳 조각 맞추기","Word_Search — 격자에서 단어 찾기","ScratchWord — 스크래치로 단어 드러내기","PeelingWord — 단어를 한 글자씩 벗기기"] },
      { id:"av2", type:"multi", text:"FlashCard 액티비티 세부 기능은?",
        options:["앞면: 이미지+단어, 뒤면: 뜻+예문","클릭/터치로 카드 뒤집기 (3D 플립 애니메이션)","'알았어 / 모르겠어' 버튼으로 분류","모르는 카드 집중 반복","TTS로 단어 발음 자동 재생","현재 진행 카드 번호 표시 (예: 3/10)","학습 완료 시 별점·포인트 지급"] },
      { id:"av3", type:"multi", text:"MatchingGame 액티비티 세부 기능은?",
        options:["단어 카드(왼쪽) ↔ 뜻 카드(오른쪽) 클릭 매칭","드래그 앤 드롭으로 연결선 그리기","한 번에 표시되는 쌍 수: 4쌍 / 6쌍 / 8쌍 선택 가능","정답 시 초록 체크 + 카드 사라짐","오답 시 빨간 흔들림 애니메이션","타이머 카운트다운 (시간 내 완료 도전)","완료 시 별점 3개 기준: 시간·오답 수 기반"] },
      { id:"av4", type:"multi", text:"VocaQuiz 액티비티 세부 기능은?",
        options:["이미지 또는 단어 제시 → 뜻 4개 중 선택","뜻 제시 → 단어 4개 중 선택","오디오 듣고 단어 선택","정답 선택 시 즉시 피드백 (O/X + 해설)","오답 선택지 무작위 셔플","문제당 시간 제한 (10초/15초/없음 선택)","오답 시 정답 하이라이트 후 다음으로"] },
      { id:"av5", type:"multi", text:"WordPuzzle 세부 기능은?",
        options:["흩어진 알파벳 타일을 올바른 순서로 배열","타일 드래그 앤 드롭 또는 클릭 순서 입력","힌트: 이미지 또는 뜻 제공","완성 시 전체 단어 TTS 재생","오류 타일 빨간 표시 후 재시도","단어 길이별 난이도 자동 분류"] },
    ],
  },
  // ── 5. 액티비티 — 문장 학습 ─────────────────────────
  {
    id: "act_sentence", label: "액티비티 — 문장 학습", emoji: "📝", color: "#0EA5E9",
    desc: "문장 구조·어순·독해를 위한 액티비티를 설계합니다",
    questions: [
      { id:"as1", type:"multi", text:"구현할 문장 학습 액티비티를 선택하세요",
        options:["SentenceCheck — 문장 듣고 내용 확인","SentenceUnscramble — 단어 조각 순서 배열","Dictation — 오디오 듣고 빈칸 채우기","BlanksIn — 문장 내 빈칸 단어 선택","SentenceComplete — 문장 완성하기","StoryReview — 스토리 전체 복습","StoryBook — 페이지별 스토리 읽기","Reading — 지문 읽기 + 이해문제"] },
      { id:"as2", type:"multi", text:"SentenceUnscramble 세부 기능은?",
        options:["단어 카드를 드래그 앤 드롭으로 순서 맞추기","클릭으로 순서대로 선택하는 방식","배경 이미지(스토리 장면)와 함께 제시","음성 듣기 버튼으로 정답 문장 미리 청취 가능","완성된 문장 TTS로 즉시 재생","정답 여부 즉시 확인 후 다음 문장으로","오답 시 원래 위치로 돌아가는 셔플 애니메이션"] },
      { id:"as3", type:"multi", text:"Dictation(받아쓰기) 세부 기능은?",
        options:["음성 재생 후 텍스트 입력 (키보드)","느린 속도 재생 버튼 (0.75배속)","단어 단위 힌트 버튼 (글자 수만 표시)","단어 박스에서 선택 방식 (타이핑 없음)","모바일: 터치 키패드 자동 팝업","오답 단어 빨간 표시 + 정답 보여주기","재시도 시 같은 문장으로 반복"] },
      { id:"as4", type:"multi", text:"StoryBook(스토리북) 세부 기능은?",
        options:["페이지별 이미지 + 텍스트 표시","문장 TTS 자동 재생 (페이지 넘길 때)","읽은 단어 하이라이트 싱크 (카라오케 방식)","이전/다음 페이지 스와이프 or 버튼","특정 단어 클릭 시 뜻 팝업 표시","읽기 속도 조절 (느리게/보통/빠르게)","전체 자동 재생 모드"] },
      { id:"as5", type:"multi", text:"Reading(읽기) 액티비티 유형은?",
        options:["지문 읽기 → 이해 문제 풀기 (4지선다)","지문에서 정답 문장 찾아 클릭","빈칸 완성 (지문 문맥 파악)","참/거짓(T/F) 판단","요약문 완성","순서 배열 (사건 순서 맞추기)"] },
    ],
  },
  // ── 6. 액티비티 — 듣기·말하기 ──────────────────────
  {
    id: "act_listen", label: "액티비티 — 듣기·말하기", emoji: "🎧", color: "#F97316",
    desc: "듣기 이해·발음·음성인식 액티비티를 설계합니다",
    questions: [
      { id:"al1", type:"multi", text:"구현할 듣기·말하기 액티비티를 선택하세요",
        options:["Listening — 오디오 듣고 객관식 답변","Listen_Record — 듣고 따라 녹음하기","SentenceShadowing — 문장 따라 말하기 (음성인식)","Speak_Recog_Word — 단어 음성인식 퀴즈","Speak_Recog_Sentence — 문장 음성인식","RolePlay — 역할극 대화 (AI 응답 포함)","Sound_Check — 비슷한 발음 구별하기","Phonics_01/02 — 파닉스 자음/모음 연습","AI 튜터 자유 회화 (Gemini Native Audio)"] },
      { id:"al2", type:"multi", text:"SentenceShadowing(따라 말하기) 세부 기능은?",
        options:["원어민 음성 → 학생이 따라 말하기","Web Speech API로 발음 인식 및 점수화","유사도 % 표시 (예: 85% 일치)","단어별 발음 정확도 색상 표시","재시도 무제한 가능","마이크 권한 거부 시 텍스트 입력 폴백","녹음 파형 시각화 (AudioVisualizer)"] },
      { id:"al3", type:"multi", text:"Phonics(파닉스) 액티비티 세부 기능은?",
        options:["자음/모음 카드 클릭 → 발음 듣기","단어에서 목표 소리 찾기","같은 소리로 시작하는 단어 그룹화","받아쓰기: 소리 듣고 알파벳 선택","블렌딩: 소리 조합해 단어 만들기","애니메이션 입 모양으로 발음 시각화"] },
      { id:"al4", type:"multi", text:"AI 튜터 음성 채팅 세부 기능은?",
        hint:"Gemini 2.5 Flash Native Audio 기반",
        options:["실시간 STT: 마이크 → 텍스트 변환 표시","AI 음성 응답 (TTS): 실시간 재생","AI 프리셋: 영어회화연습 / 다국어 / 통역사","연속 대화 (Session Resumption 자동 재연결)","오디오 파형 시각화","학습한 교재 주제로 대화 자동 연결","대화 내역 저장 및 학습 기록 연동"] },
      { id:"al5", type:"single", text:"음성인식 엔진은 무엇을 사용하나요?",
        options:["Web Speech API (브라우저 내장, 무료)","Google Cloud Speech-to-Text API","Azure Cognitive Services","OpenAI Whisper API","구현하지 않음"] },
    ],
  },
  // ── 7. 액티비티 — 쓰기·그리기 ──────────────────────
  {
    id: "act_write", label: "액티비티 — 쓰기·그리기", emoji: "✍️", color: "#10B981",
    desc: "쓰기·타이핑·캔버스 그리기 액티비티를 설계합니다",
    questions: [
      { id:"aw1", type:"multi", text:"구현할 쓰기·그리기 액티비티를 선택하세요",
        options:["Dictation — 받아쓰기 (키보드 타이핑)","WriteWord — 단어 따라 쓰기","Drawing — 자유 그림 그리기","DrawBoard — 가이드 선 따라 그리기","TimerDraw — 시간 제한 그리기","ColorBook — 색칠하기","Spelling_Check — 스펠링 체크"] },
      { id:"aw2", type:"multi", text:"DrawBoard(그리기 보드) 세부 기능은?",
        hint:"Canvas API / Konva.js 기반",
        options:["펜 굵기 조절 (얇게/보통/두껍게)","색상 팔레트 (기본 8색 + 커스텀)","지우개 도구","전체 지우기(초기화)","그림 저장 (PNG 다운로드 또는 서버 업로드)","그리기 가이드 레이어 (반투명 본보기)","터치/스타일러스 지원"] },
      { id:"aw3", type:"multi", text:"WriteWord(단어 쓰기) 세부 기능은?",
        options:["점선 가이드라인 위에 알파벳 따라 쓰기","획순 애니메이션 가이드","손 글씨 인식 (필압 감지)","타이핑 방식으로 대체 선택 가능","완성 단어 TTS 재생","오타 즉시 빨간 표시"] },
    ],
  },
  // ── 8. 액티비티 — 퀴즈·평가 ─────────────────────────
  {
    id: "act_quiz", label: "액티비티 — 퀴즈·평가", emoji: "❓", color: "#EF4444",
    desc: "학습 평가 및 퀴즈 액티비티를 설계합니다",
    questions: [
      { id:"aq1", type:"multi", text:"구현할 퀴즈·평가 액티비티를 선택하세요",
        options:["QuickCheck — 즉석 확인 퀴즈 (O/X)","QuizShow — 포인트 퀴즈쇼","Month_Test — 월간 종합 테스트","OMR — OMR 답안지 형식","ImageQuiz — 이미지 보고 답 선택","TemplateQuiz — 틀 기반 커스텀 퀴즈","Spelling_Check — 스펠링 퀴즈","ComprehensionQ — 독해 이해 문제"] },
      { id:"aq2", type:"multi", text:"퀴즈 공통 기능을 선택하세요",
        options:["문제 셔플 (매번 순서 바뀜)","문항당 시간 제한 (10초/15초/30초/없음)","진행바 (몇 번째 문제인지 표시)","즉시 피드백 (정답 발표 + 해설)","오답 노트 자동 생성","점수 기반 별점 (0~3개)","최고 점수 기록 및 비교"] },
      { id:"aq3", type:"multi", text:"QuizShow(퀴즈쇼) 세부 기능은?",
        options:["문제 화면 풀스크린 + 배경음악","배수 포인트 찬스 (2배/3배 문항)","정답 시 팡파레 + 포인트 획득 애니메이션","오답 시 효과음 + 정답 공개","누적 점수 실시간 상단 표시","최종 결과: 획득 포인트 + 순위","소셜 공유 기능 (결과 이미지 생성)"] },
      { id:"aq4", type:"multi", text:"Month_Test(월간 테스트) 세부 기능은?",
        options:["해당 월 전체 학습 단어·문장 출제","자동 출제 (학습 기록 기반)","타이머 전체 시험 시간 제한","OMR 카드 스타일 UI (원 마킹)","제출 후 채점 결과표 생성","취약 영역 분석 차트","학부모/교사에게 결과 리포트 자동 발송"] },
    ],
  },
  // ── 9. 액티비티 — 인터랙티브·게임 ──────────────────
  {
    id: "act_game", label: "액티비티 — 인터랙티브·게임", emoji: "🎮", color: "#A855F7",
    desc: "드래그·캔버스·게임 기반의 고난도 액티비티를 설계합니다",
    questions: [
      { id:"ag1", type:"multi", text:"구현할 게임형 액티비티를 선택하세요",
        options:["MemoryGame — 짝 맞추기 (뒤집기)","Catch_Image — 화면에서 이미지 잡기","Find_Image — 이미지 속 물체 찾기","DragImage — 이미지를 정해진 위치에 배치","FlipImage — 이미지 뒤집어 맞추기","Spin_And_Read — 돌리며 읽기","UnderSea — 바다 속 단어 잡기 게임","CatchBubble — 버블 터치 게임","SortingGame — 카테고리별 분류 드래그"] },
      { id:"ag2", type:"multi", text:"Catch_Image(이미지 잡기) 세부 기능은?",
        hint:"Canvas API 필요",
        options:["단어/이미지가 화면 위→아래로 이동","정답 이미지 클릭/터치 → 포인트 획득","오답 클릭 시 목숨 감소 (하트 UI)","이동 속도 단계별 증가","생명(하트) 시스템 (3개 기본)","파워업 아이템 (속도 감속·폭탄 등)","최고 점수 기록 (Leaderboard)"] },
      { id:"ag3", type:"multi", text:"MemoryGame 세부 기능은?",
        options:["카드 수 선택: 8장(4쌍) / 12장(6쌍) / 16장(8쌍)","앞면: 단어, 짝카드: 이미지 또는 뜻","카드 뒤집기 3D CSS 애니메이션","짝 찾는 데 걸린 시간 기록","짝 성공 시 카드 사라짐 + 효과음","모두 완성 시 별점 (시간·시도횟수 기반)","연습 모드 (모든 카드 잠깐 공개 후 시작)"] },
      { id:"ag4", type:"multi", text:"SortingGame(분류 게임) 세부 기능은?",
        options:["단어 카드를 드래그해 카테고리 박스에 넣기","카테고리 예: 동물/음식/색깔/감정","오답 드롭 시 카드 원위치 바운스","전체 정렬 완료 시 카테고리 팡파레","힌트 모드: 처음 몇 장은 예시로 미리 배치","타이머 모드 추가 가능"] },
      { id:"ag5", type:"multi", text:"게임형 액티비티 공통 인프라는?",
        hint:"기술 구현 기준",
        options:["Konva.js — 드래그 앤 드롭 Canvas","HTML5 Canvas API (라이브러리 없음)","Framer Motion — 카드 뒤집기·이동 애니메이션","requestAnimationFrame — 실시간 게임 루프","터치 이벤트 지원 (mobile/tablet)","사운드 효과: Howler.js"] },
    ],
  },
  // ── 10. 멀티미디어 액티비티 ───────────────────────
  {
    id: "act_media", label: "액티비티 — 멀티미디어", emoji: "🎬", color: "#14B8A6",
    desc: "동영상·오디오·유튜브·전자책 액티비티를 설계합니다",
    questions: [
      { id:"am1", type:"multi", text:"구현할 멀티미디어 액티비티를 선택하세요",
        options:["MoviePlay — 동영상 재생 (자막 포함)","Chant — 챈트 동영상 + 따라 하기","AudioList — 오디오 목록 재생","VideoList — 비디오 목록 재생","Youtube — YouTube 임베드","Ebook — E-book 슬라이드 뷰어","BookPage — 교재 페이지 PDF 뷰어","PowerPoint — PPT 슬라이드 뷰어"] },
      { id:"am2", type:"multi", text:"MoviePlay 세부 기능은?",
        options:["HTML5 Video + Video.js 플레이어","자막(SRT/SMI) 한국어·영어 전환 버튼","재생 속도 조절 (0.75x / 1x / 1.25x)","반복 구간 재생 (A-B 반복)","챕터 타임라인 (중요 장면 마크)","전체화면 모드","자막 글씨 크기 조절"] },
      { id:"am3", type:"multi", text:"Ebook 세부 기능은?",
        options:["좌우 스와이프로 페이지 넘기기","이미지 기반 슬라이드 (JPG/PNG)","PDF 뷰어 (PDF.js)","페이지 내 단어 클릭 → 뜻 팝업","TTS 자동 읽어주기 버튼","확대/축소 (pinch-to-zoom)","페이지 번호 표시 및 직접 이동"] },
    ],
  },
  // ── 11. UI/UX & 화면 설계 ───────────────────────────
  {
    id: "uiux", label: "UI/UX & 화면 설계", emoji: "🎨", color: "#F43F5E",
    desc: "화면 목록, 디자인 시스템, 인터랙션을 정의합니다",
    questions: [
      { id:"ui1", type:"multi", text:"구현이 필요한 화면을 선택하세요",
        options:["인트로/스플래시 화면","로그인·회원가입","아바타 생성·선택","메인 대시보드 (교재 목록)","교재 상세 (레슨·Day 목록)","액티비티 뷰 (각 타입별)","학습 완료 결과 화면","학습 현황 대시보드","퀴즈룸 로비·실시간 플레이","아바타·아이템 관리","설정 (닉네임·비밀번호·알림)","즐겨찾기·최근 학습","AI 튜터 채팅 화면","관리자 대시보드 (B2B)"] },
      { id:"ui2", type:"single", text:"전체 디자인 톤 앤 매너는?",
        options:["밝고 귀여운 캐릭터 스타일 (뽀로로·타요 느낌)","깔끔한 에듀테크 스타일 (클래스카드·뤼이드)","자연·환경 테마 (따뜻한 컬러)","모험·판타지 게임 스타일","다크모드 글래스모피즘"] },
      { id:"ui3", type:"multi", text:"주요 사용 디바이스·해상도는?",
        options:["태블릿(iPad 9.7~13인치) — 최우선","PC 웹 브라우저 (1280px+)","스마트폰 (360~430px)","학교 전자칠판 (1920px+)","모바일 PWA 설치 지원"] },
      { id:"ui4", type:"multi", text:"인터랙션·애니메이션 기준은?",
        options:["Framer Motion (페이지 전환·카드 애니메이션)","CSS Transition (버튼·호버 효과)","정답 시 컨페티 파티클 효과","레벨업 시 팡파레 전체화면 연출","액티비티 전환 < 500ms","배경음악(BGM) 볼륨 조절 가능"] },
      { id:"ui5", type:"multi", text:"접근성·기타 UX 요구사항은?",
        options:["WCAG 2.1 AA 준수","키보드 네비게이션 완전 지원","폰트 크기 크게/작게 조절","다국어 UI (한국어·영어 전환)","오른손잡이·왼손잡이 레이아웃 전환","야간 모드(다크 테마)"] },
    ],
  },
  // ── 12. 기술 스택 ────────────────────────────────────
  {
    id: "techstack", label: "기술 스택", emoji: "⚙️", color: "#6366F1",
    desc: "프론트엔드·백엔드·라이브러리 전체 스택을 정의합니다",
    questions: [
      { id:"ts1", type:"multi", text:"프론트엔드 핵심 기술은?",
        options:["React 18 + TypeScript ✅","Next.js 14 App Router (SSR·파일기반 라우팅)","Vite (SPA, 빠른 개발서버)","TailwindCSS (유틸리티 CSS) ✅","HTML/CSS (정적 페이지) ✅"] },
      { id:"ts2", type:"multi", text:"상태 관리 전략은?",
        options:["Zustand — 전역 상태 (인증·학습·플레이어)","React Query — 서버 데이터 캐싱·리페치","Redux Toolkit (대규모 상태)","Context API (경량)"] },
      { id:"ts3", type:"multi", text:"미디어·인터랙티브 라이브러리는?",
        options:["Howler.js — 오디오 재생","Video.js — 비디오 플레이어","Konva.js — 드래그·인터랙티브 Canvas","Fabric.js — 그리기 Canvas","Web Speech API — 음성인식","MediaRecorder API — 녹음","AudioWorklet — 16kHz PCM 변환 (AI 튜터)"] },
      { id:"ts4", type:"single", text:"백엔드 API 전략은?",
        options:["Node.js + Express REST API ✅","기존 서버 재사용 (엔드포인트 유지)","Node.js + NestJS (대규모)","FastAPI (AI 튜터 백엔드)","Firebase Functions (서버리스)"] },
      { id:"ts5", type:"multi", text:"데이터베이스는?",
        options:["Firestore (Google, NoSQL)","Cloud SQL PostgreSQL (GCP) ✅","MongoDB Atlas","Redis (캐시·세션)"] },
      { id:"ts6", type:"multi", text:"인증 방식은?",
        options:["JWT (Access + Refresh Token)","Google 소셜 로그인 (Firebase Auth)","Kakao 로그인","이메일·비밀번호","B2B 기관 코드(productLogin)","Guest 모드"] },
    ],
  },
  // ── 13. 데이터 모델 & API ────────────────────────────
  {
    id: "dataapi", label: "데이터 모델 & API", emoji: "🗄️", color: "#0EA5E9",
    desc: "핵심 TypeScript 타입과 API 엔드포인트를 정의합니다",
    questions: [
      { id:"da1", type:"multi", text:"명세서에 포함할 TypeScript 데이터 모델은?",
        options:["BookData (교재·BookState enum)","LessonData / DayData","ActData (액티비티 메타·ActType enum)","WordData / SentenceData / ScriptData","PlayerInfo (포인트·레벨·즐겨찾기)","StudyInfo / ActStudyInfo (학습 기록)","AITutorSettings / ChatMessage / SessionState","AvatarData / ItemData"] },
      { id:"da2", type:"multi", text:"필요한 User API 엔드포인트는?",
        options:["POST /user/join — 회원가입","POST /user/login — JWT 발급","POST /user/firstavatar — 아바타 생성","POST /user/findpass — 비밀번호 찾기","POST /user/changeNickname — 닉네임 변경","POST /user/attend — 출석 체크","GET /user/getavataritem — 아이템 목록","POST /user/quitmember — 탈퇴"] },
      { id:"da3", type:"multi", text:"필요한 Study API 엔드포인트는?",
        options:["POST /study/start — 학습 시작","POST /study/end — 학습 종료·점수 저장","GET /study/getlearningstatus — 학습 현황","GET /study/getlearningdetail — 상세 기록","POST /study/setbookword — 단어 학습 기록","GET /study/getquiz — 퀴즈 문제 조회","POST /study/quizaccept — 퀴즈 제출","POST /study/settestresult — 테스트 결과"] },
      { id:"da4", type:"multi", text:"학습 데이터 수집 범위는?",
        options:["학습 완료 여부만","문항별 정답률 + 소요 시간","틀린 단어·문장 패턴 분석","학습 세션 전체 로그","출석 현황 (날짜별 캘린더)","포인트·별점 누적 내역"] },
    ],
  },
  // ── 14. 인프라 & 배포 ───────────────────────────────
  {
    id: "infra", label: "인프라 & 배포", emoji: "☁️", color: "#64748B",
    desc: "클라우드 환경·CI/CD·모니터링을 정의합니다",
    questions: [
      { id:"in1", type:"single", text:"프론트엔드 배포 환경은?",
        options:["Google Cloud Run (Docker+Nginx) ✅","Vercel (Next.js 최적화)","Firebase Hosting","AWS Amplify","Netlify"] },
      { id:"in2", type:"single", text:"백엔드 배포 환경은?",
        options:["Google Cloud Run (Node.js) ✅","GCP Cloud Functions (서버리스)","AWS ECS / Fargate","기존 서버 유지"] },
      { id:"in3", type:"multi", text:"CI/CD 파이프라인은?",
        options:["Google Cloud Build (자동 빌드·배포)","GitHub Actions","Docker 컨테이너 빌드 + Artifact Registry","develop → staging → production 단계 배포","PR 머지 시 자동 배포"] },
      { id:"in4", type:"multi", text:"모니터링·에러 추적은?",
        options:["Google Cloud Logging + Monitoring","Sentry (프론트엔드 에러 추적)","Firebase Analytics (사용자 행동)","GA4 (페이지뷰·이벤트)","Cloud Alerts (임계값 알림)"] },
      { id:"in5", type:"multi", text:"보안 요구사항은?",
        options:["HTTPS Only","JWT 기반 모든 API 인증","XSS 방어 (CSP 헤더)","CORS 허용 도메인 제한","콘텐츠 접근 시 구독·구매 권한 검증","개인정보 최소 수집 (아동 대상 서비스)"] },
    ],
  },
  // ── 15. Phase 계획 & 일정 ───────────────────────────
  {
    id: "phase", label: "Phase 계획 & 일정", emoji: "🚀", color: "#84CC16",
    desc: "단계별 로드맵과 우선순위를 정의합니다",
    questions: [
      { id:"ph1", type:"multi", text:"Phase 1(MVP)에 포함할 기능은?",
        options:["인증 시스템","교재 브라우징","어휘 액티비티 5종 (VocaPreview·FlashCard·VocaQuiz·Matching·MemoryGame)","문장 액티비티 3종 (Unscramble·StoryBook·Dictation)","멀티미디어 (MoviePlay·Chant·Youtube)","학습 진행률 저장","즐겨찾기·최근 학습"] },
      { id:"ph2", type:"multi", text:"Phase 2(확장)에 포함할 기능은?",
        options:["나머지 어휘·문장 액티비티","음성인식 액티비티 (Shadowing·Speak_Recog)","게임형 액티비티 (Catch·UnderSea)","그리기 액티비티 (DrawBoard·ColorBook)","퀴즈룸 멀티플레이 (WebSocket)","아바타·아이템 시스템","AI 튜터 음성 채팅"] },
      { id:"ph3", type:"multi", text:"Phase 3(고급)에 포함할 기능은?",
        options:["3D 메타버스 공간 (Three.js)","화면 녹화 (MediaRecorder)","구독·결제 시스템","모바일 PWA (오프라인)","AR 기반 액티비티"] },
      { id:"ph4", type:"single", text:"Phase 1 목표 기간은?",
        options:["4주 이내","6주 이내","3개월 이내","6개월 이내","미정"] },
      { id:"ph5", type:"single", text:"개발 팀 규모는?",
        options:["1인 풀스택","프론트1 + 백엔드1 (2인)","3~5인","6인 이상"] },
    ],
  },
];

// ════════════════════════════════════════════════════════
//  버전 이름 생성 (날짜_순서)
// ════════════════════════════════════════════════════════
function makeVersionId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  return { date: ymd, full: `${ymd}_001` };
}
function bumpSeq(versions, date) {
  const sameDayVers = versions.filter(v => v.id.startsWith(date));
  const next = String(sameDayVers.length + 1).padStart(3, "0");
  return `${date}_${next}`;
}

// ════════════════════════════════════════════════════════
//  유틸
// ════════════════════════════════════════════════════════
const totalQ = () => SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);

function calcProgress(answers) {
  const total = totalQ();
  const done = Object.values(answers).filter(
    v => v && (Array.isArray(v) ? v.length > 0 : v.trim())
  ).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

function secProg(sec, answers) {
  const done = sec.questions.filter(q => {
    const v = answers[q.id];
    return v && (Array.isArray(v) ? v.length > 0 : v.trim());
  }).length;
  return { done, total: sec.questions.length };
}

// ════════════════════════════════════════════════════════
//  섹션별 MD 생성
// ════════════════════════════════════════════════════════
function generateSectionMD(section, answers) {
  let md = `## ${section.emoji} ${section.label}\n\n`;
  let hasContent = false;
  section.questions.forEach(q => {
    const a = answers[q.id];
    if (!a || (Array.isArray(a) && a.length === 0) || (typeof a === "string" && !a.trim())) return;
    hasContent = true;
    md += `**${q.text}**\n`;
    if (Array.isArray(a)) {
      md += a.map(v => `- ${v}`).join("\n") + "\n\n";
    } else {
      md += `${a}\n\n`;
    }
  });
  if (!hasContent) md += `_(응답 없음)_\n\n`;
  return md;
}

// ════════════════════════════════════════════════════════
//  MD 생성
// ════════════════════════════════════════════════════════
function generateMD(answers, versionId, engine) {
  const get = id => { const v = answers[id]; if(!v) return null; if(Array.isArray(v)) return v.length ? v : null; return v.trim()||null; };
  const arr = id => { const v = get(id); return Array.isArray(v) ? v : v ? [v] : []; };
  const li = items => items.map(i => `- ${i}`).join("\n");

  let md = `# 초등 언어교육 앱 기능 명세서\n\n`;
  md += `| 항목 | 내용 |\n|:--|:--|\n`;
  md += `| 버전 | \`${versionId}\` |\n`;
  md += `| 작성일 | ${new Date().toLocaleDateString("ko-KR")} |\n`;
  md += `| AI 엔진 | ${engine} |\n`;
  md += `| 상태 | Draft |\n\n---\n\n`;

  // 1. 개요
  md += `## 1. 프로젝트 개요\n\n`;
  const ov1=get("ov1"),ov3=get("ov3"),ov4=arr("ov4"),ov5=arr("ov5");
  if(ov1) md+=`- **핵심 목적:** ${ov1}\n`;
  if(ov3) md+=`- **운영 모델:** ${ov3}\n`;
  const roles=arr("ov2"); if(roles.length) md+=`- **사용자 역할:** ${roles.join(", ")}\n`;
  if(ov5.length) md+=`\n**KPI:**\n${li(ov5)}\n`;
  if(ov4.length) md+=`\n**MVP 포함 기능:**\n${li(ov4)}\n`;

  // 2. 학습 대상
  md += `\n---\n\n## 2. 학습 대상 & 교육 목표\n\n`;
  const le1=arr("le1"),le2=arr("le2"),le3=arr("le3"),le4=get("le4"),le5=arr("le5");
  if(le1.length) md+=`- **대상 학년:** ${le1.join(", ")}\n`;
  if(le2.length) md+=`- **학습 언어:** ${le2.join(", ")}\n`;
  if(le3.length) md+=`**교육 목표:**\n${li(le3)}\n`;
  if(le4) md+=`- **난이도 조절:** ${le4}\n`;
  if(le5.length) md+=`**게임화 요소:**\n${li(le5)}\n`;

  // 3. 콘텐츠 구조
  md += `\n---\n\n## 3. 콘텐츠 구조\n\n`;
  const ct1=get("ct1"),ct2=arr("ct2"),ct3=get("ct3"),ct4=arr("ct4"),ct5=get("ct5");
  if(ct1) md+=`- **계층 구조:** ${ct1}\n`;
  if(ct3) md+=`- **콘텐츠 저장소:** ${ct3}\n`;
  if(ct5) md+=`- **콘텐츠 관리:** ${ct5}\n`;
  if(ct2.length) md+=`**Day 콘텐츠 데이터:**\n${li(ct2)}\n`;
  if(ct4.length) md+=`**캐싱 전략:**\n${li(ct4)}\n`;

  // 4. 액티비티 명세
  md += `\n---\n\n## 4. 액티비티 상세 명세\n\n`;
  md += "```typescript\ninterface ActivityProps {\n  actData: ActData;\n  dayData: DayData;\n  wordList: WordData[];\n  sentenceList: SentenceData[];\n  scriptList: ScriptData[];\n  onComplete: (score: number, starPoint: number) => void;\n}\n```\n\n";

  // 어휘
  const av1=arr("av1"),av2=arr("av2"),av3=arr("av3"),av4=arr("av4"),av5=arr("av5");
  if(av1.length){
    md+=`### 4.1 어휘 학습 액티비티\n**구현 목록:**\n${li(av1)}\n\n`;
    if(av2.length) md+=`**FlashCard 세부:**\n${li(av2)}\n\n`;
    if(av3.length) md+=`**MatchingGame 세부:**\n${li(av3)}\n\n`;
    if(av4.length) md+=`**VocaQuiz 세부:**\n${li(av4)}\n\n`;
    if(av5.length) md+=`**WordPuzzle 세부:**\n${li(av5)}\n\n`;
  }

  // 문장
  const as1=arr("as1"),as2=arr("as2"),as3=arr("as3"),as4=arr("as4"),as5=arr("as5");
  if(as1.length){
    md+=`### 4.2 문장 학습 액티비티\n**구현 목록:**\n${li(as1)}\n\n`;
    if(as2.length) md+=`**SentenceUnscramble 세부:**\n${li(as2)}\n\n`;
    if(as3.length) md+=`**Dictation 세부:**\n${li(as3)}\n\n`;
    if(as4.length) md+=`**StoryBook 세부:**\n${li(as4)}\n\n`;
    if(as5.length) md+=`**Reading 유형:**\n${li(as5)}\n\n`;
  }

  // 듣기·말하기
  const al1=arr("al1"),al2=arr("al2"),al3=arr("al3"),al4=arr("al4"),al5=get("al5");
  if(al1.length){
    md+=`### 4.3 듣기·말하기 액티비티\n**구현 목록:**\n${li(al1)}\n\n`;
    if(al2.length) md+=`**SentenceShadowing 세부:**\n${li(al2)}\n\n`;
    if(al3.length) md+=`**Phonics 세부:**\n${li(al3)}\n\n`;
    if(al4.length) md+=`**AI 튜터 세부:**\n${li(al4)}\n\n`;
    if(al5) md+=`- **음성인식 엔진:** ${al5}\n\n`;
  }

  // 쓰기
  const aw1=arr("aw1"),aw2=arr("aw2"),aw3=arr("aw3");
  if(aw1.length){
    md+=`### 4.4 쓰기·그리기 액티비티\n**구현 목록:**\n${li(aw1)}\n\n`;
    if(aw2.length) md+=`**DrawBoard 세부:**\n${li(aw2)}\n\n`;
    if(aw3.length) md+=`**WriteWord 세부:**\n${li(aw3)}\n\n`;
  }

  // 퀴즈
  const aq1=arr("aq1"),aq2=arr("aq2"),aq3=arr("aq3"),aq4=arr("aq4");
  if(aq1.length){
    md+=`### 4.5 퀴즈·평가 액티비티\n**구현 목록:**\n${li(aq1)}\n\n`;
    if(aq2.length) md+=`**공통 기능:**\n${li(aq2)}\n\n`;
    if(aq3.length) md+=`**QuizShow 세부:**\n${li(aq3)}\n\n`;
    if(aq4.length) md+=`**Month_Test 세부:**\n${li(aq4)}\n\n`;
  }

  // 게임
  const ag1=arr("ag1"),ag2=arr("ag2"),ag3=arr("ag3"),ag4=arr("ag4"),ag5=arr("ag5");
  if(ag1.length){
    md+=`### 4.6 인터랙티브·게임 액티비티\n**구현 목록:**\n${li(ag1)}\n\n`;
    if(ag2.length) md+=`**Catch_Image 세부:**\n${li(ag2)}\n\n`;
    if(ag3.length) md+=`**MemoryGame 세부:**\n${li(ag3)}\n\n`;
    if(ag4.length) md+=`**SortingGame 세부:**\n${li(ag4)}\n\n`;
    if(ag5.length) md+=`**게임 공통 인프라:**\n${li(ag5)}\n\n`;
  }

  // 멀티미디어
  const am1=arr("am1"),am2=arr("am2"),am3=arr("am3");
  if(am1.length){
    md+=`### 4.7 멀티미디어 액티비티\n**구현 목록:**\n${li(am1)}\n\n`;
    if(am2.length) md+=`**MoviePlay 세부:**\n${li(am2)}\n\n`;
    if(am3.length) md+=`**Ebook 세부:**\n${li(am3)}\n\n`;
  }

  // 5. UI/UX
  md+=`\n---\n\n## 5. UI/UX 설계\n\n`;
  const ui1=arr("ui1"),ui2=get("ui2"),ui3=arr("ui3"),ui4=arr("ui4"),ui5=arr("ui5");
  if(ui1.length) md+=`**화면 목록:**\n${li(ui1)}\n\n`;
  if(ui2) md+=`- **디자인 톤:** ${ui2}\n`;
  if(ui3.length) md+=`**지원 디바이스:**\n${li(ui3)}\n\n`;
  if(ui4.length) md+=`**애니메이션·인터랙션:**\n${li(ui4)}\n\n`;
  if(ui5.length) md+=`**접근성:**\n${li(ui5)}\n\n`;

  // 6. 기술 스택
  md+=`\n---\n\n## 6. 기술 스택\n\n`;
  md+=`| 구분 | 기술 |\n|:--|:--|\n`;
  const ts1=arr("ts1"),ts2=arr("ts2"),ts3=arr("ts3"),ts4=get("ts4"),ts5=arr("ts5"),ts6=arr("ts6");
  if(ts1.length) md+=`| 프론트엔드 | ${ts1.join(", ")} |\n`;
  if(ts2.length) md+=`| 상태 관리 | ${ts2.join(", ")} |\n`;
  if(ts3.length) md+=`| 미디어·인터랙티브 | ${ts3.join(", ")} |\n`;
  if(ts4) md+=`| 백엔드 | ${ts4} |\n`;
  if(ts5.length) md+=`| 데이터베이스 | ${ts5.join(", ")} |\n`;
  if(ts6.length) md+=`| 인증 | ${ts6.join(", ")} |\n`;
  md+=`| AI 엔진 | ${engine} |\n\n`;

  // 7. 데이터 모델
  md+=`\n---\n\n## 7. 데이터 모델 & API\n\n`;
  const da1=arr("da1"),da2=arr("da2"),da3=arr("da3"),da4=arr("da4");
  if(da1.length) md+=`**TypeScript 데이터 모델:**\n${li(da1)}\n\n`;
  if(da2.length) md+=`**User API:**\n${li(da2)}\n\n`;
  if(da3.length) md+=`**Study API:**\n${li(da3)}\n\n`;
  if(da4.length) md+=`**학습 데이터 수집:**\n${li(da4)}\n\n`;

  // 8. 인프라
  md+=`\n---\n\n## 8. 인프라 & 배포\n\n`;
  const in1=get("in1"),in2=get("in2"),in3=arr("in3"),in4=arr("in4"),in5=arr("in5");
  md+=`| 서비스 | 환경 |\n|:--|:--|\n`;
  if(in1) md+=`| 프론트엔드 | ${in1} |\n`;
  if(in2) md+=`| 백엔드 | ${in2} |\n`;
  md+=`| AI 튜터 | Cloud Run (FastAPI + Gemini) |\n\n`;
  if(in3.length) md+=`**CI/CD:**\n${li(in3)}\n\n`;
  if(in4.length) md+=`**모니터링:**\n${li(in4)}\n\n`;
  if(in5.length) md+=`**보안:**\n${li(in5)}\n\n`;

  // 9. Phase
  md+=`\n---\n\n## 9. 개발 Phase 로드맵\n\n`;
  const ph1=arr("ph1"),ph2=arr("ph2"),ph3=arr("ph3"),ph4=get("ph4"),ph5=get("ph5");
  if(ph1.length) md+=`### Phase 1 — MVP\n${li(ph1)}\n\n`;
  if(ph2.length) md+=`### Phase 2 — 확장\n${li(ph2)}\n\n`;
  if(ph3.length) md+=`### Phase 3 — 고급\n${li(ph3)}\n\n`;
  if(ph4) md+=`- **Phase 1 목표 기간:** ${ph4}\n`;
  if(ph5) md+=`- **팀 규모:** ${ph5}\n`;

  md+=`\n---\n\n*이 문서는 SpecCraft Pro (${engine})로 생성되었습니다. · ${versionId}*\n`;
  return md;
}

// ════════════════════════════════════════════════════════
//  메인 앱
// ════════════════════════════════════════════════════════
export default function ActivitySpecGenerator() {
  const initVer = () => { const {date,full}=makeVersionId(); return [{id:full,date,label:full,createdAt:new Date().toLocaleString("ko-KR"),answers:{},engine:"claude-opus-4-6"}]; };

  const [versions, setVersions] = useState(initVer);
  const [activeVerId, setActiveVerId] = useState(() => initVer()[0].id);
  const [engine, setEngine] = useState("claude-opus-4-6");
  const [activeSec, setActiveSec] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEngMenu, setShowEngMenu] = useState(false);
  const [showVerMenu, setShowVerMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedSec, setCopiedSec] = useState(null);
  const [showFlowModal, setShowFlowModal] = useState(null); // "section" | "full" | null
  const [showWireframe, setShowWireframe] = useState(false);
  const engRef = useRef(null);
  const verRef = useRef(null);

  const activeVer = versions.find(v => v.id === activeVerId) || versions[0];
  const answers = activeVer.answers;

  // 클릭 외부 닫기
  useEffect(() => {
    const h = e => {
      if(engRef.current && !engRef.current.contains(e.target)) setShowEngMenu(false);
      if(verRef.current && !verRef.current.contains(e.target)) setShowVerMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const setAnswers = useCallback((updater) => {
    setVersions(prev => prev.map(v => v.id === activeVerId
      ? { ...v, answers: typeof updater === "function" ? updater(v.answers) : updater }
      : v
    ));
  }, [activeVerId]);

  const handleSingle = useCallback((qid, opt) => {
    setAnswers(p => ({ ...p, [qid]: opt }));
  }, [setAnswers]);

  const handleMulti = useCallback((qid, opt) => {
    setAnswers(p => {
      const cur = p[qid] || [];
      return { ...p, [qid]: cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt] };
    });
  }, [setAnswers]);

  const createVersion = () => {
    const {date} = makeVersionId();
    const newId = bumpSeq(versions, date);
    const newVer = { id:newId, date, label:newId, createdAt:new Date().toLocaleString("ko-KR"), answers:{}, engine };
    setVersions(prev => [...prev, newVer]);
    setActiveVerId(newId);
    setShowVerMenu(false);
    setActiveSec(0);
    setShowPreview(false);
  };

  const duplicateVersion = () => {
    const {date} = makeVersionId();
    const newId = bumpSeq(versions, date);
    const newVer = { id:newId, date, label:newId, createdAt:new Date().toLocaleString("ko-KR"), answers:{...answers}, engine };
    setVersions(prev => [...prev, newVer]);
    setActiveVerId(newId);
    setShowVerMenu(false);
  };

  const deleteVersion = (vid) => {
    if(versions.length <= 1) return;
    const next = versions.filter(v => v.id !== vid);
    setVersions(next);
    if(activeVerId === vid) setActiveVerId(next[next.length-1].id);
  };

  const markdown = generateMD(answers, activeVerId, engine);
  const { done, total, pct } = calcProgress(answers);
  const section = SECTIONS[activeSec];
  const engObj = ENGINES.find(e => e.id === engine);

  const copy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySectionMD = (sec) => {
    const md = generateSectionMD(sec, answers);
    navigator.clipboard.writeText(md);
    setCopiedSec(sec.id);
    setTimeout(() => setCopiedSec(null), 2000);
  };

  const downloadMD = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-spec-${activeVerId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={S.root}>
      {/* ══════ 헤더 ══════ */}
      <header style={S.header}>
        {/* 로고 */}
        <div style={S.logoWrap}>
          <button style={S.menuBtn} onClick={() => setSidebarOpen(o=>!o)}>☰</button>
          <div style={S.logoIcon}>📄</div>
          <div>
            <div style={S.logoText}>SpecCraft Pro</div>
            <div style={S.logoSub}>초등 언어교육 앱 명세서 생성기</div>
          </div>
        </div>

        {/* 엔진 선택 */}
        <div ref={engRef} style={S.dropWrap}>
          <button style={{ ...S.dropBtn, borderColor: engObj.color + "80" }} onClick={() => setShowEngMenu(o=>!o)}>
            <span style={{ ...S.engDot, background: engObj.color }} />
            <span style={S.dropBtnLabel}>{engObj.label}</span>
            <span style={S.dropBtnTier}>{engObj.tier}</span>
            <span style={{ fontSize: 10, color: "#aaa", marginLeft: 4 }}>▾</span>
          </button>
          {showEngMenu && (
            <div style={S.dropMenu}>
              <div style={S.dropMenuTitle}>🤖 AI 엔진 선택</div>
              {ENGINES.map(eng => (
                <button key={eng.id} style={{ ...S.dropItem, ...(engine===eng.id ? S.dropItemActive : {}) }}
                  onClick={() => { setEngine(eng.id); setShowEngMenu(false); }}>
                  <span style={{ ...S.engDot, background: eng.color }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{eng.label}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{eng.tier}</div>
                  </div>
                  {engine===eng.id && <span style={S.checkMark}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 버전 관리 */}
        <div ref={verRef} style={S.dropWrap}>
          <button style={S.dropBtn} onClick={() => setShowVerMenu(o=>!o)}>
            <span style={{ fontSize: 14 }}>🗂️</span>
            <span style={S.dropBtnLabel}>{activeVerId}</span>
            <span style={{ fontSize: 10, color: "#aaa", marginLeft: 4 }}>▾</span>
          </button>
          {showVerMenu && (
            <div style={{ ...S.dropMenu, width: 280 }}>
              <div style={S.dropMenuTitle}>📁 버전 관리</div>
              {versions.map(v => (
                <div key={v.id} style={{ ...S.dropItem, ...(activeVerId===v.id ? S.dropItemActive : {}), justifyContent:"space-between" }}>
                  <button style={S.verSelectBtn} onClick={() => { setActiveVerId(v.id); setShowVerMenu(false); }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{v.id}</div>
                    <div style={{ fontSize: 10, color: "#aaa" }}>{v.createdAt}</div>
                  </button>
                  {versions.length > 1 && (
                    <button style={S.verDelBtn} onClick={() => deleteVersion(v.id)}>✕</button>
                  )}
                </div>
              ))}
              <div style={{ borderTop: "1px solid #eee", marginTop: 6, paddingTop: 6, display:"flex", gap:6 }}>
                <button style={S.verActionBtn} onClick={createVersion}>+ 새 버전</button>
                <button style={{ ...S.verActionBtn, background:"#F5F5FF", color:"#6366F1" }} onClick={duplicateVersion}>복사 버전</button>
              </div>
            </div>
          )}
        </div>

        {/* 진행률 */}
        <div style={S.progressArea}>
          <div style={S.progressLabelRow}>
            <span style={S.progressLabel}>{pct}% 완성</span>
            <span style={S.progressCount}>{done}/{total}</span>
          </div>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width:`${pct}%` }} />
          </div>
        </div>

        {/* 미리보기 버튼 */}
        <button
          style={{ ...S.previewBtn, ...(showPreview ? S.previewBtnOn : {}) }}
          onClick={() => { setShowPreview(o=>!o); setShowFlowModal(null); setShowWireframe(false); }}
        >
          {showPreview ? "← 질문으로" : "📄 명세서"}
        </button>
      </header>

      {/* ── 보조 툴바 (Flow / Wireframe) ─── */}
      <div style={{ background:"#F5F3FF", borderBottom:"1.5px solid #E0DCFF", padding:"6px 16px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#7C3AED", marginRight:4 }}>다이어그램 ▸</span>
        <button
          onClick={() => { setShowFlowModal(showFlowModal === "full" ? null : "full"); setShowPreview(false); setShowWireframe(false); }}
          style={{ padding:"4px 14px", borderRadius:6, border:"1.5px solid #10B981", background: showFlowModal === "full" ? "#10B981" : "transparent", color: showFlowModal === "full" ? "#fff" : "#059669", cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit", transition:"all .2s" }}
        >
          🔀 전체 Flow
        </button>
        <button
          onClick={() => { setShowWireframe(w=>!w); setShowPreview(false); setShowFlowModal(null); }}
          style={{ padding:"4px 14px", borderRadius:6, border:"1.5px solid #F59E0B", background: showWireframe ? "#F59E0B" : "transparent", color: showWireframe ? "#fff" : "#D97706", cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit", transition:"all .2s" }}
        >
          🖼 Wireframe
        </button>
        <span style={{ fontSize:11, fontWeight:700, color:"#7C3AED", marginLeft:12, marginRight:4 }}>섹션 ▸</span>
        <span style={{ fontSize:10, color:"#9CA3AF" }}>각 섹션 오른쪽의 <strong>🔀 Flow</strong> 버튼을 클릭하면 해당 섹션의 다이어그램이 표시됩니다</span>
      </div>

      {/* ══════ 바디 ══════ */}
      <div style={S.body}>
        {/* 사이드바 */}
        {sidebarOpen && (
          <nav style={S.sidebar}>
            <div style={S.sidebarHead}>섹션 ({SECTIONS.length})</div>
            {SECTIONS.map((sec, idx) => {
              const {done:d, total:t} = secProg(sec, answers);
              const isAct = idx === activeSec;
              const pctS = Math.round((d/t)*100);
              return (
                <button key={sec.id}
                  style={{ ...S.navItem, ...(isAct ? { ...S.navItemOn, borderLeftColor: sec.color } : {}) }}
                  onClick={() => { setActiveSec(idx); setShowPreview(false); }}
                >
                  <span style={S.navEmoji}>{sec.emoji}</span>
                  <div style={{ flex:1, textAlign:"left", overflow:"hidden" }}>
                    <div style={{ fontSize:12, fontWeight: isAct?700:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{sec.label}</div>
                    <div style={S.navBar}>
                      <div style={{ ...S.navBarFill, width:`${pctS}%`, background: sec.color }} />
                    </div>
                  </div>
                  <span style={{ fontSize:10, color: d===t?"#10B981":"#aaa", fontWeight:600, marginLeft:4 }}>{d}/{t}</span>
                  <button
                    title="섹션 MD 복사"
                    style={{ fontSize:10, background:"none", border:"none", cursor:"pointer", padding:"2px", color: copiedSec===sec.id?"#10B981":"#ccc", flexShrink:0 }}
                    onClick={(e) => { e.stopPropagation(); copySectionMD(sec); }}
                  >
                    {copiedSec===sec.id ? "✓" : "📋"}
                  </button>
                </button>
              );
            })}
          </nav>
        )}

        {/* 메인 */}
        <main style={S.main}>
          {showPreview ? (
            <div style={S.previewWrap}>
              <div style={S.previewBar}>
                <div>
                  <div style={S.previewTitle}>📄 {activeVerId} 명세서</div>
                  <div style={S.previewSub}>{engine} · {pct}% 완성 · {done}/{total} 답변</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={S.copyBtn} onClick={copy}>{copied?"✅ 복사됨":"📋 복사"}</button>
                  <button style={{ ...S.copyBtn, background:"#059669" }} onClick={downloadMD}>📥 MD 다운로드</button>
                </div>
              </div>
              <pre style={S.previewCode}>{markdown}</pre>
            </div>
          ) : showFlowModal === "full" ? (
            /* 전체 Flow 다이어그램 */
            <div style={{ padding:24 }}>
              <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16, color:"#1a1a2e" }}>🔀 전체 프로젝트 Flow</h2>
              <MermaidDiagram code={generateActivityFullFlow(answers)} />
            </div>
          ) : showWireframe ? (
            /* Wireframe 미리보기 */
            <div style={{ padding:24 }}>
              <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16, color:"#1a1a2e" }}>🖼 Wireframe 미리보기</h2>
              <p style={{ fontSize:12, color:"#888", marginBottom:16 }}>UI/UX 섹션에서 선택한 화면의 와이어프레임을 미리 볼 수 있습니다.</p>
              <WireframePreview selectedScreens={Array.isArray(answers.ui1) ? answers.ui1 : []} />
            </div>
          ) : (
            <>
              {/* 섹션 Flow 다이어그램 (펼쳐진 경우) */}
              {showFlowModal && showFlowModal === section.id && (
                <div style={{ background:"#F0FDF9", border:"1.5px solid #D1FAE5", borderRadius:14, padding:20, marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <h3 style={{ fontSize:14, fontWeight:700, color:"#065F46" }}>🔀 {section.label} Flow</h3>
                    <button onClick={() => setShowFlowModal(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#64748b" }}>✕</button>
                  </div>
                  <MermaidDiagram code={generateActivityFlow(section.id, answers)} />
                </div>
              )}

              {/* 섹션 헤더 */}
              <div style={S.secHead}>
                <div style={{ ...S.secIcon, background: section.color }}>{section.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={S.secTitle}>{section.label}</div>
                  <div style={S.secDesc}>{section.desc}</div>
                </div>
                <button
                  style={{ padding:"5px 10px", borderRadius:7, border:"1.5px solid #E0E0E8", background: copiedSec===section.id?"#ECFDF5":"#FAFAFA", cursor:"pointer", fontSize:11, fontWeight:600, color: copiedSec===section.id?"#10B981":"#777", whiteSpace:"nowrap", transition:"all .2s" }}
                  onClick={() => copySectionMD(section)}
                >
                  {copiedSec===section.id ? "✅ 복사됨" : "📋 섹션 MD"}
                </button>
                <button
                  style={{ padding:"5px 10px", borderRadius:7, border:"1.5px solid #D1FAE5", background: showFlowModal===section.id?"#ECFDF5":"#FAFAFA", cursor:"pointer", fontSize:11, fontWeight:600, color: showFlowModal===section.id?"#10B981":"#059669", whiteSpace:"nowrap", transition:"all .2s" }}
                  onClick={() => setShowFlowModal(showFlowModal===section.id ? null : section.id)}
                >
                  {showFlowModal===section.id ? "✕ 닫기" : "🔀 Flow"}
                </button>
                <div style={S.secCounter}>
                  {(() => { const {done:d,total:t}=secProg(section,answers); return `${d}/${t} 완료`; })()}
                </div>
              </div>

              {/* 질문 카드 */}
              <div style={S.cards}>
                {section.questions.map((q, qi) => {
                  const ans = answers[q.id];
                  const ok = ans && (Array.isArray(ans) ? ans.length>0 : ans.trim());
                  return (
                    <div key={q.id} style={{ ...S.card, ...(ok ? { borderColor: section.color+"40", boxShadow:`0 0 0 1px ${section.color}20` } : {}) }}>
                      <div style={S.cardTop}>
                        <span style={{ ...S.qNum, background: section.color }}>Q{qi+1}</span>
                        <div style={{ flex:1 }}>
                          <div style={S.qText}>{q.text}</div>
                          <div style={S.qTagRow}>
                            {q.hint && <span style={S.qHint}>💡 {q.hint}</span>}
                            {q.type==="multi" && <span style={S.tagMulti}>복수 선택</span>}
                            {ok && <span style={S.tagDone}>✓ 완료</span>}
                          </div>
                        </div>
                      </div>
                      <div style={S.optGrid}>
                        {q.options.map(opt => {
                          const sel = q.type==="multi" ? (ans||[]).includes(opt) : ans===opt;
                          return (
                            <button key={opt}
                              style={{ ...S.opt, ...(sel ? { ...S.optOn, borderColor: section.color, background: section.color+"12" } : {}) }}
                              onClick={() => q.type==="multi" ? handleMulti(q.id,opt) : handleSingle(q.id,opt)}
                            >
                              <span style={{ ...S.optDot, ...(sel ? { background:section.color, borderColor:section.color } : {}) }}>
                                {sel && <span style={S.dotCheck}>✓</span>}
                              </span>
                              <span style={{ ...S.optText, ...(sel?{fontWeight:600, color:"#222"}:{}) }}>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 섹션 이동 */}
              <div style={S.navRow}>
                {activeSec > 0 && (
                  <button style={S.btnPrev} onClick={() => setActiveSec(activeSec-1)}>← 이전</button>
                )}
                <div style={{ flex:1, textAlign:"center" }}>
                  <span style={{ fontSize:12, color:"#aaa" }}>{activeSec+1} / {SECTIONS.length}</span>
                </div>
                {activeSec < SECTIONS.length-1 ? (
                  <button style={{ ...S.btnNext, background: section.color }}
                    onClick={() => setActiveSec(activeSec+1)}>
                    다음 →
                  </button>
                ) : (
                  <button style={{ ...S.btnNext, background:"#10B981" }}
                    onClick={() => setShowPreview(true)}>
                    🎉 명세서 생성
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  스타일
// ════════════════════════════════════════════════════════
const S = {
  root:{ fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif", minHeight:"100vh", background:"#F0F2F7", display:"flex", flexDirection:"column", color:"#1A1A2E" },

  // header
  header:{ background:"#fff", borderBottom:"1px solid #E2E4EC", padding:"0 16px", display:"flex", alignItems:"center", gap:12, height:58, flexShrink:0, boxShadow:"0 1px 8px rgba(0,0,0,.06)", zIndex:50 },
  logoWrap:{ display:"flex", alignItems:"center", gap:8, marginRight:4 },
  menuBtn:{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#666", padding:"4px 6px", borderRadius:6 },
  logoIcon:{ fontSize:22 },
  logoText:{ fontSize:15, fontWeight:900, letterSpacing:"-0.5px" },
  logoSub:{ fontSize:10, color:"#999", marginTop:1 },

  // dropdown
  dropWrap:{ position:"relative" },
  dropBtn:{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, border:"1.5px solid #E0E0E8", background:"#FAFAFA", cursor:"pointer", fontSize:12, fontWeight:600, color:"#333", whiteSpace:"nowrap" },
  dropBtnLabel:{ fontSize:12, fontWeight:600 },
  dropBtnTier:{ fontSize:10, background:"#F0F0F8", color:"#666", borderRadius:4, padding:"1px 5px" },
  engDot:{ width:8, height:8, borderRadius:99, flexShrink:0 },
  dropMenu:{ position:"absolute", top:"calc(100% + 6px)", left:0, background:"#fff", border:"1px solid #E4E4EC", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,.12)", padding:"8px", zIndex:100, minWidth:220 },
  dropMenuTitle:{ fontSize:11, fontWeight:700, color:"#aaa", padding:"4px 8px 8px", letterSpacing:"0.5px", textTransform:"uppercase" },
  dropItem:{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, border:"none", background:"transparent", cursor:"pointer", width:"100%", textAlign:"left", transition:"background .1s" },
  dropItemActive:{ background:"#F0F0F8" },
  checkMark:{ marginLeft:"auto", color:"#6366F1", fontWeight:700, fontSize:14 },
  verSelectBtn:{ flex:1, background:"none", border:"none", cursor:"pointer", textAlign:"left" },
  verDelBtn:{ background:"none", border:"none", cursor:"pointer", color:"#ccc", fontSize:12, padding:"2px 6px", borderRadius:4 },
  verActionBtn:{ flex:1, padding:"7px 10px", borderRadius:8, border:"1px solid #E0E0E8", background:"#F5F5F5", cursor:"pointer", fontSize:12, fontWeight:600, color:"#555" },

  // progress
  progressArea:{ flex:1, minWidth:120 },
  progressLabelRow:{ display:"flex", justifyContent:"space-between", marginBottom:5 },
  progressLabel:{ fontSize:11, color:"#666", fontWeight:700 },
  progressCount:{ fontSize:11, color:"#aaa" },
  progressBar:{ height:6, background:"#E8E8F0", borderRadius:99, overflow:"hidden" },
  progressFill:{ height:"100%", background:"linear-gradient(90deg,#6366F1,#EC4899)", borderRadius:99, transition:"width .4s ease" },

  previewBtn:{ padding:"7px 16px", borderRadius:8, border:"1.5px solid #6366F1", background:"transparent", color:"#6366F1", fontWeight:700, cursor:"pointer", fontSize:12, whiteSpace:"nowrap", flexShrink:0 },
  previewBtnOn:{ background:"#6366F1", color:"#fff" },

  // body
  body:{ display:"flex", flex:1, overflow:"hidden" },

  // sidebar
  sidebar:{ width:210, flexShrink:0, background:"#fff", borderRight:"1px solid #E4E4EC", overflowY:"auto", padding:"12px 0" },
  sidebarHead:{ fontSize:10, fontWeight:700, color:"#bbb", letterSpacing:1, padding:"0 14px 10px", textTransform:"uppercase" },
  navItem:{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", border:"none", borderLeft:"3px solid transparent", background:"transparent", cursor:"pointer", width:"100%", transition:"all .1s" },
  navItemOn:{ background:"#F5F5FF" },
  navEmoji:{ fontSize:15, flexShrink:0 },
  navBar:{ height:3, background:"#EEE", borderRadius:99, marginTop:4, overflow:"hidden" },
  navBarFill:{ height:"100%", borderRadius:99, transition:"width .3s" },

  // main
  main:{ flex:1, overflowY:"auto", padding:"24px 32px" },

  // section header
  secHead:{ display:"flex", alignItems:"center", gap:12, marginBottom:20 },
  secIcon:{ width:42, height:42, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#fff", flexShrink:0 },
  secTitle:{ fontSize:18, fontWeight:900, letterSpacing:"-0.5px" },
  secDesc:{ fontSize:12, color:"#888", marginTop:3 },
  secCounter:{ fontSize:12, fontWeight:700, color:"#999", background:"#F0F0F8", padding:"4px 12px", borderRadius:99, whiteSpace:"nowrap" },

  // cards
  cards:{ display:"flex", flexDirection:"column", gap:14 },
  card:{ background:"#fff", borderRadius:14, padding:"18px 22px", border:"1.5px solid #EAEAEF", transition:"border-color .2s, box-shadow .2s" },
  cardTop:{ display:"flex", alignItems:"flex-start", gap:11, marginBottom:13 },
  qNum:{ color:"#fff", fontSize:10, fontWeight:800, borderRadius:6, padding:"3px 8px", flexShrink:0, marginTop:2 },
  qText:{ fontSize:13.5, fontWeight:700, lineHeight:1.55 },
  qTagRow:{ display:"flex", flexWrap:"wrap", gap:5, marginTop:5 },
  qHint:{ fontSize:11, color:"#999" },
  tagMulti:{ fontSize:10, background:"#EEF2FF", color:"#6366F1", borderRadius:5, padding:"1px 7px", fontWeight:600 },
  tagDone:{ fontSize:10, background:"#ECFDF5", color:"#10B981", borderRadius:5, padding:"1px 7px", fontWeight:600 },

  // options
  optGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:7 },
  opt:{ display:"flex", alignItems:"flex-start", gap:8, padding:"9px 11px", borderRadius:9, border:"1.5px solid #E4E4EC", background:"#FAFAFA", cursor:"pointer", textAlign:"left", transition:"all .12s" },
  optOn:{},
  optDot:{ width:16, height:16, borderRadius:99, border:"2px solid #CCC", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, transition:"all .12s" },
  dotCheck:{ fontSize:9, color:"#fff", fontWeight:900 },
  optText:{ fontSize:12, color:"#444", lineHeight:1.5 },

  // nav row
  navRow:{ display:"flex", alignItems:"center", marginTop:24, paddingBottom:40, gap:10 },
  btnPrev:{ padding:"10px 20px", borderRadius:9, border:"1.5px solid #DDD", background:"#fff", cursor:"pointer", fontWeight:600, fontSize:13, color:"#666" },
  btnNext:{ padding:"10px 22px", borderRadius:9, border:"none", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, boxShadow:"0 4px 12px rgba(0,0,0,.15)" },

  // preview
  previewWrap:{ background:"#fff", borderRadius:14, border:"1px solid #E2E4EC", overflow:"hidden" },
  previewBar:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid #EEE", background:"#FAFBFF" },
  previewTitle:{ fontSize:14, fontWeight:700 },
  previewSub:{ fontSize:11, color:"#999", marginTop:2 },
  copyBtn:{ padding:"7px 16px", borderRadius:8, border:"none", background:"#6366F1", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12 },
  previewCode:{ padding:"20px", margin:0, fontSize:12, lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#333", fontFamily:"'Courier New',monospace", maxHeight:"74vh", overflowY:"auto" },
};
