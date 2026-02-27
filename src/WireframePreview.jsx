import { useState } from "react";

// ─── 와이어프레임 템플릿 정의 ───
const WIREFRAMES = {
  // 공통 화면
  "인트로/스플래시 화면": { id: "intro", screens: [
    { label: "스플래시", render: SplashScreen },
  ]},
  "인트로": { id: "intro", screens: [
    { label: "스플래시", render: SplashScreen },
  ]},
  "UI-01 인트로": { id: "intro", screens: [
    { label: "스플래시", render: SplashScreen },
  ]},
  "로그인·회원가입": { id: "auth", screens: [
    { label: "로그인", render: LoginScreen },
    { label: "회원가입", render: SignupScreen },
  ]},
  "UI-02 로그인": { id: "auth", screens: [
    { label: "로그인", render: LoginScreen },
  ]},
  "UI-03 회원가입": { id: "signup", screens: [
    { label: "회원가입", render: SignupScreen },
  ]},
  "아바타 생성·선택": { id: "avatar", screens: [
    { label: "아바타", render: AvatarScreen },
  ]},
  "UI-04 아바타 생성": { id: "avatar", screens: [
    { label: "아바타", render: AvatarScreen },
  ]},
  "메인 대시보드 (교재 목록)": { id: "dashboard", screens: [
    { label: "대시보드", render: DashboardScreen },
  ]},
  "UI-05 메인 대시보드": { id: "dashboard", screens: [
    { label: "대시보드", render: DashboardScreen },
  ]},
  "교재 상세 (레슨·Day 목록)": { id: "bookdetail", screens: [
    { label: "교재 상세", render: BookDetailScreen },
  ]},
  "UI-06 시리즈 목록": { id: "series", screens: [
    { label: "시리즈", render: DashboardScreen },
  ]},
  "UI-07 교재 목록": { id: "booklist", screens: [
    { label: "교재 목록", render: DashboardScreen },
  ]},
  "UI-08 레슨/데이 뷰": { id: "lessonday", screens: [
    { label: "레슨/Day", render: BookDetailScreen },
  ]},
  "액티비티 뷰 (각 타입별)": { id: "activity", screens: [
    { label: "퀴즈형", render: ActivityQuizScreen },
    { label: "카드형", render: ActivityCardScreen },
    { label: "게임형", render: ActivityGameScreen },
  ]},
  "UI-09 액티비티 뷰 (80+ 타입)": { id: "activity", screens: [
    { label: "퀴즈형", render: ActivityQuizScreen },
    { label: "카드형", render: ActivityCardScreen },
  ]},
  "학습 완료 결과 화면": { id: "result", screens: [
    { label: "결과", render: ResultScreen },
  ]},
  "학습 현황 대시보드": { id: "progress", screens: [
    { label: "학습 현황", render: ProgressScreen },
  ]},
  "UI-10 학습 현황": { id: "progress", screens: [
    { label: "학습 현황", render: ProgressScreen },
  ]},
  "퀴즈룸 로비·실시간 플레이": { id: "quizroom", screens: [
    { label: "퀴즈룸 로비", render: QuizRoomScreen },
  ]},
  "UI-11 퀴즈룸 로비": { id: "quizroom", screens: [
    { label: "퀴즈룸 로비", render: QuizRoomScreen },
  ]},
  "설정 (닉네임·비밀번호·알림)": { id: "settings", screens: [
    { label: "설정", render: SettingsScreen },
  ]},
  "UI-14 설정": { id: "settings", screens: [
    { label: "설정", render: SettingsScreen },
  ]},
  "AI 튜터 채팅 화면": { id: "aitutor", screens: [
    { label: "AI 채팅", render: AIChatScreen },
  ]},
  "UI-16 AI 튜터 채팅": { id: "aitutor", screens: [
    { label: "AI 채팅", render: AIChatScreen },
  ]},
  "관리자 대시보드 (B2B)": { id: "admin", screens: [
    { label: "관리자", render: AdminScreen },
  ]},
};

// ─── 공통 스타일 ───
const S = {
  phone: { width: 280, height: 500, borderRadius: 20, border: "2px solid #475569", background: "#0f172a", overflow: "hidden", position: "relative", flexShrink: 0 },
  statusBar: { height: 24, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 9, color: "#64748b" },
  header: { height: 44, background: "#1e293b", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", padding: "0 14px", gap: 10 },
  headerTitle: { fontSize: 14, fontWeight: 700, color: "#f1f5f9" },
  headerBack: { fontSize: 16, color: "#94a3b8", cursor: "pointer" },
  content: { flex: 1, overflow: "auto", padding: 12 },
  bottomNav: { height: 48, background: "#1e293b", borderTop: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "space-around" },
  bottomNavItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 8, color: "#64748b" },
  card: { background: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 8, border: "1px solid #334155" },
  input: { width: "100%", height: 36, borderRadius: 8, background: "#1e293b", border: "1px solid #334155", marginBottom: 8 },
  btn: { width: "100%", height: 40, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" },
  label: { fontSize: 10, color: "#94a3b8", marginBottom: 4, display: "block" },
  skeleton: (w, h) => ({ width: w, height: h, borderRadius: 6, background: "#334155", marginBottom: 6 }),
};

// ─── 화면 렌더 함수들 ───
function SplashScreen() {
  return (
    <div style={{ ...S.phone }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff" }}>M</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>Metaon</div>
        <div style={{ fontSize: 10, color: "#64748b" }}>Loading...</div>
        <div style={{ width: 120, height: 3, borderRadius: 2, background: "#334155", overflow: "hidden" }}>
          <div style={{ width: "60%", height: "100%", background: "#6366f1", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

function LoginScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#a78bfa)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff" }}>M</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>로그인</div>
        </div>
        <span style={S.label}>이메일</span>
        <div style={S.input} />
        <span style={S.label}>비밀번호</span>
        <div style={S.input} />
        <div style={{ ...S.btn, marginTop: 8 }}>로그인</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#FEE500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>K</div>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>G</div>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>A</div>
        </div>
        <div style={{ textAlign: "center", fontSize: 10, color: "#64748b", marginTop: 12 }}>계정이 없으신가요? <span style={{ color: "#818cf8" }}>회원가입</span></div>
      </div>
    </div>
  );
}

function SignupScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={S.header}><span style={S.headerBack}>←</span><span style={S.headerTitle}>회원가입</span></div>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={S.label}>이름</span><div style={S.input} />
        <span style={S.label}>이메일</span><div style={S.input} />
        <span style={S.label}>비밀번호</span><div style={S.input} />
        <span style={S.label}>비밀번호 확인</span><div style={S.input} />
        <span style={S.label}>역할</span>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["학생", "교사", "학부모"].map(r => (
            <div key={r} style={{ padding: "6px 14px", borderRadius: 6, background: r === "학생" ? "#6366f120" : "#1e293b", border: `1px solid ${r === "학생" ? "#6366f1" : "#334155"}`, fontSize: 11, color: r === "학생" ? "#a5b4fc" : "#64748b" }}>{r}</div>
          ))}
        </div>
        <div style={S.btn}>가입하기</div>
      </div>
    </div>
  );
}

function AvatarScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={S.header}><span style={S.headerTitle}>아바타 만들기</span></div>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a78bfa)", margin: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>😊</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, width: "100%", marginTop: 16 }}>
          {["😀","😎","🤓","😊","🥳","😺","🐶","🦊"].map(e => (
            <div key={e} style={{ width: "100%", aspectRatio: "1", borderRadius: 10, background: "#1e293b", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, cursor: "pointer" }}>{e}</div>
          ))}
        </div>
        <div style={{ ...S.btn, marginTop: "auto", marginBottom: 16 }}>선택 완료</div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ ...S.header, justifyContent: "space-between" }}>
        <span style={S.headerTitle}>My Library</span>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6366f120", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>😊</div>
      </div>
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
          {["전체", "영어", "수학", "과학"].map((t, i) => (
            <div key={t} style={{ padding: "5px 14px", borderRadius: 16, background: i === 0 ? "#6366f1" : "#1e293b", border: "1px solid #334155", fontSize: 11, color: i === 0 ? "#fff" : "#94a3b8", whiteSpace: "nowrap" }}>{t}</div>
          ))}
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={S.card}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 56, height: 72, borderRadius: 6, background: `hsl(${i * 80}, 60%, 30%)`, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={S.skeleton("80%", 12)} />
                <div style={S.skeleton("60%", 10)} />
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "#334155", marginTop: 8, overflow: "hidden" }}>
                  <div style={{ width: `${30 * i}%`, height: "100%", background: "#6366f1", borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 9, color: "#64748b", marginTop: 4 }}>{30 * i}% 완료</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={S.bottomNav}>
        {[{ icon: "🏠", label: "홈" }, { icon: "📚", label: "교재" }, { icon: "📊", label: "현황" }, { icon: "👤", label: "MY" }].map(n => (
          <div key={n.label} style={S.bottomNavItem}><span style={{ fontSize: 16 }}>{n.icon}</span><span>{n.label}</span></div>
        ))}
      </div>
    </div>
  );
}

function BookDetailScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={S.header}><span style={S.headerBack}>←</span><span style={S.headerTitle}>Lesson 1 - Day 1</span></div>
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        {["VocaPreview", "FlashCard", "VocaQuiz", "Matching", "Dictation", "StoryBook"].map((act, i) => (
          <div key={act} style={{ ...S.card, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: i < 3 ? "rgba(34,197,94,.12)" : "#1e293b", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
              {i < 3 ? "✓" : (i + 1)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{act}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{i < 3 ? "완료" : "미완료"}</div>
            </div>
            <span style={{ fontSize: 14, color: "#475569" }}>›</span>
          </div>
        ))}
      </div>
      <div style={S.bottomNav}>
        {[{ icon: "🏠", label: "홈" }, { icon: "📚", label: "교재" }, { icon: "📊", label: "현황" }, { icon: "👤", label: "MY" }].map(n => (
          <div key={n.label} style={S.bottomNavItem}><span style={{ fontSize: 16 }}>{n.icon}</span><span>{n.label}</span></div>
        ))}
      </div>
    </div>
  );
}

function ActivityQuizScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ ...S.header, justifyContent: "space-between" }}>
        <span style={S.headerBack}>✕</span>
        <div style={{ width: 120, height: 4, borderRadius: 2, background: "#334155", overflow: "hidden" }}>
          <div style={{ width: "40%", height: "100%", background: "#6366f1" }} />
        </div>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>3/10</span>
      </div>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: 12, background: "#1e293b", border: "1px solid #334155", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🍎</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>apple</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>올바른 뜻을 선택하세요</div>
        </div>
        {["사과", "배", "포도", "딸기"].map((opt, i) => (
          <div key={opt} style={{ ...S.card, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", border: i === 0 ? "1px solid #6366f1" : "1px solid #334155" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${i === 0 ? "#6366f1" : "#475569"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i === 0 && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1" }} />}
            </div>
            <span style={{ fontSize: 13, color: "#e2e8f0" }}>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityCardScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ ...S.header, justifyContent: "space-between" }}>
        <span style={S.headerBack}>✕</span>
        <span style={S.headerTitle}>FlashCard</span>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>5/10</span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", height: 240, borderRadius: 16, background: "linear-gradient(135deg,#1e293b,#334155)", border: "1px solid #475569", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ fontSize: 32 }}>🐱</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>cat</div>
          <div style={{ fontSize: 10, color: "#64748b" }}>탭하여 뒤집기</div>
        </div>
      </div>
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 10, background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#f87171", fontWeight: 600 }}>모르겠어 ✕</div>
        <div style={{ flex: 1, height: 44, borderRadius: 10, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#4ade80", fontWeight: 600 }}>알겠어 ✓</div>
      </div>
    </div>
  );
}

function ActivityGameScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ ...S.header, justifyContent: "space-between" }}>
        <span style={S.headerBack}>✕</span>
        <span style={S.headerTitle}>Memory Game</span>
        <span style={{ fontSize: 11, color: "#f59e0b" }}>⏱ 01:23</span>
      </div>
      <div style={{ flex: 1, padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
          {Array(16).fill(0).map((_, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 8, background: [2, 5, 9].includes(i) ? "#6366f120" : "#1e293b", border: `1px solid ${[2, 5, 9].includes(i) ? "#6366f1" : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: [2, 5].includes(i) ? 16 : 20 }}>
              {[2, 5].includes(i) ? "🐱" : i === 9 ? "cat" : "?"}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>시도: 8회 | 찾은 쌍: 1/8</span>
        </div>
      </div>
    </div>
  );
}

function ResultScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>학습 완료!</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 24 }}>⭐</span>)}
        </div>
        <div style={{ ...S.card, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#6366f1" }}>85점</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>정답률 85% | 소요 시간 2분 30초</div>
        </div>
        <div style={{ ...S.card, width: "100%", display: "flex", justifyContent: "space-around" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>+50</div><div style={{ fontSize: 9, color: "#64748b" }}>포인트</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>Lv.3</div><div style={{ fontSize: 9, color: "#64748b" }}>레벨</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa" }}>7일</div><div style={{ fontSize: 9, color: "#64748b" }}>스트릭</div></div>
        </div>
        <div style={{ ...S.btn, width: "100%", marginTop: 12 }}>다음 학습</div>
      </div>
    </div>
  );
}

function ProgressScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={S.header}><span style={S.headerTitle}>학습 현황</span></div>
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        <div style={{ ...S.card, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: "#6366f1" }}>42</div><div style={{ fontSize: 9, color: "#64748b" }}>완료</div></div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b" }}>85%</div><div style={{ fontSize: 9, color: "#64748b" }}>정답률</div></div>
          <div><div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>7일</div><div style={{ fontSize: 9, color: "#64748b" }}>스트릭</div></div>
        </div>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>주간 학습량</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
            {[30, 60, 45, 80, 50, 70, 20].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 6 ? "#6366f1" : "#334155", height: `${h}%`, borderRadius: 3 }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {["월", "화", "수", "목", "금", "토", "일"].map(d => <span key={d} style={{ fontSize: 8, color: "#64748b" }}>{d}</span>)}
          </div>
        </div>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>교재별 진행률</div>
          {["Book A", "Book B"].map((b, i) => (
            <div key={b} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginBottom: 3 }}><span>{b}</span><span>{60 + i * 20}%</span></div>
              <div style={{ height: 4, borderRadius: 2, background: "#334155", overflow: "hidden" }}><div style={{ width: `${60 + i * 20}%`, height: "100%", background: "#6366f1" }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.bottomNav}>
        {[{ icon: "🏠", label: "홈" }, { icon: "📚", label: "교재" }, { icon: "📊", label: "현황" }, { icon: "👤", label: "MY" }].map(n => (
          <div key={n.label} style={S.bottomNavItem}><span style={{ fontSize: 16 }}>{n.icon}</span><span>{n.label}</span></div>
        ))}
      </div>
    </div>
  );
}

function QuizRoomScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={S.header}><span style={S.headerBack}>←</span><span style={S.headerTitle}>퀴즈룸 로비</span></div>
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        <div style={{ ...S.card, textAlign: "center", background: "linear-gradient(135deg,#6366f108,#a78bfa08)" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🎮</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>실시간 퀴즈 대결</div>
          <div style={{ fontSize: 10, color: "#64748b" }}>친구와 함께 퀴즈를 풀어보세요</div>
          <div style={{ ...S.btn, marginTop: 10, fontSize: 11 }}>방 만들기</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", margin: "12px 0 8px" }}>참여 가능한 방</div>
        {["민수의 방 (2/4)", "영어반 (3/6)"].map(room => (
          <div key={room} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontSize: 11, color: "#e2e8f0" }}>{room}</div><div style={{ fontSize: 9, color: "#64748b" }}>Book A - Lesson 1</div></div>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: "#6366f120", border: "1px solid #6366f1", fontSize: 10, color: "#a5b4fc" }}>참여</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={S.header}><span style={S.headerTitle}>설정</span></div>
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        {[
          { icon: "👤", label: "프로필 수정", desc: "닉네임, 아바타" },
          { icon: "🔔", label: "알림 설정", desc: "푸시, 이메일" },
          { icon: "🌙", label: "다크 모드", desc: "켜짐" },
          { icon: "🔒", label: "비밀번호 변경", desc: "" },
          { icon: "🌐", label: "언어", desc: "한국어" },
          { icon: "📱", label: "앱 정보", desc: "v1.0.0" },
        ].map(item => (
          <div key={item.label} style={{ ...S.card, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: "#e2e8f0" }}>{item.label}</div>{item.desc && <div style={{ fontSize: 9, color: "#64748b" }}>{item.desc}</div>}</div>
            <span style={{ color: "#475569" }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIChatScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column" }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ ...S.header, justifyContent: "space-between" }}>
        <span style={S.headerBack}>←</span>
        <span style={S.headerTitle}>AI 튜터</span>
        <span style={{ fontSize: 14 }}>⚙️</span>
      </div>
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>AI</div>
          <div style={{ background: "#1e293b", borderRadius: "4px 12px 12px 12px", padding: "8px 12px", fontSize: 11, color: "#e2e8f0", lineHeight: 1.5, maxWidth: "75%" }}>Hello! What would you like to practice today?</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: "flex-end" }}>
          <div style={{ background: "#6366f1", borderRadius: "12px 4px 12px 12px", padding: "8px 12px", fontSize: 11, color: "#fff", lineHeight: 1.5, maxWidth: "75%" }}>I want to practice speaking!</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>AI</div>
          <div style={{ background: "#1e293b", borderRadius: "4px 12px 12px 12px", padding: "8px 12px", fontSize: 11, color: "#e2e8f0", lineHeight: 1.5, maxWidth: "75%" }}>Great! Let's start with today's lesson topic. Can you tell me about your favorite animal?</div>
        </div>
      </div>
      <div style={{ padding: "8px 12px", borderTop: "1px solid #334155", display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1, height: 36, borderRadius: 18, background: "#1e293b", border: "1px solid #334155", padding: "0 14px", display: "flex", alignItems: "center", fontSize: 11, color: "#475569" }}>메시지 입력...</div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎤</div>
      </div>
    </div>
  );
}

function AdminScreen() {
  return (
    <div style={{ ...S.phone, display: "flex", flexDirection: "column", width: 360, height: 500 }}>
      <div style={S.statusBar}><span>9:41</span><span>100%</span></div>
      <div style={{ ...S.header, justifyContent: "space-between" }}>
        <span style={S.headerTitle}>관리자 대시보드</span>
        <span style={{ fontSize: 11, color: "#64748b" }}>admin@metaon.com</span>
      </div>
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6, marginBottom: 10 }}>
          {[
            { label: "총 사용자", value: "1,234", color: "#6366f1" },
            { label: "오늘 활성", value: "256", color: "#4ade80" },
            { label: "학습 완료", value: "89%", color: "#f59e0b" },
            { label: "매출", value: "₩2.4M", color: "#a78bfa" },
          ].map(s => (
            <div key={s.label} style={{ ...S.card, textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>최근 활동</div>
          {["새 사용자 가입 +12", "교재 업데이트 v2.1", "결제 완료 3건"].map(a => (
            <div key={a} style={{ fontSize: 10, color: "#94a3b8", padding: "4px 0", borderBottom: "1px solid #1e293b" }}>{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ───
export default function WireframePreview({ selectedScreens = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const matchedScreens = [];
  const seen = new Set();
  selectedScreens.forEach(name => {
    const wf = WIREFRAMES[name];
    if (wf && !seen.has(wf.id)) {
      seen.add(wf.id);
      wf.screens.forEach(s => matchedScreens.push({ ...s, parentName: name }));
    }
  });

  if (matchedScreens.length === 0) {
    // 기본 화면들
    const defaults = [
      { label: "로그인", render: LoginScreen },
      { label: "대시보드", render: DashboardScreen },
      { label: "액티비티", render: ActivityQuizScreen },
      { label: "결과", render: ResultScreen },
    ];
    return (
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>
          UI/UX 섹션에서 화면을 선택하면 해당 와이어프레임이 표시됩니다. (기본 화면 표시 중)
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {defaults.map((s, i) => (
            <button key={s.label} onClick={() => setActiveIdx(i)}
              style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${activeIdx === i ? "#6366f1" : "rgba(255,255,255,.08)"}`, background: activeIdx === i ? "#6366f120" : "rgba(255,255,255,.02)", color: activeIdx === i ? "#a5b4fc" : "#94a3b8", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {defaults[activeIdx]?.render()}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {matchedScreens.map((s, i) => (
          <button key={`${s.label}-${i}`} onClick={() => setActiveIdx(i)}
            style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${activeIdx === i ? "#6366f1" : "rgba(255,255,255,.08)"}`, background: activeIdx === i ? "#6366f120" : "rgba(255,255,255,.02)", color: activeIdx === i ? "#a5b4fc" : "#94a3b8", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {matchedScreens[activeIdx]?.render()}
      </div>
    </div>
  );
}
