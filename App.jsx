import { useState } from "react";
import ActivitySpecGenerator from "./ActivitySpecGenerator";
import MetaonSpecGenerator from "./MetaonSpecGenerator";

// ─── 도구 정의 ───
const TOOLS = [
  {
    id: "activity",
    label: "📚 초등 언어교육 앱",
    desc: "15개 섹션 · 영어 학습 앱 명세서 생성기",
    badge: "15 섹션",
    badgeColor: "#6366F1",
  },
  {
    id: "metaon",
    label: "🏗️ Metaon 종합 명세",
    desc: "30개 섹션 · 전체 프로젝트 명세서 생성기",
    badge: "30 섹션",
    badgeColor: "#059669",
  },
];

// ─── 루트 앱 ───
export default function App() {
  const [activeTool, setActiveTool] = useState("activity");
  const current = TOOLS.find((t) => t.id === activeTool);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ── 상단 글로벌 네비게이션 ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          height: 48,
          gap: 6,
          zIndex: 300,
          flexShrink: 0,
        }}
      >
        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 12 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.3px",
              whiteSpace: "nowrap",
              fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif",
            }}
          >
            SpecCraft Studio
          </span>
        </div>

        {/* 메뉴 탭 */}
        <div style={{ display: "flex", gap: 3 }}>
          {TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 7,
                  border: isActive
                    ? `1px solid ${tool.badgeColor}60`
                    : "1px solid transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif",
                  background: isActive
                    ? `${tool.badgeColor}18`
                    : "rgba(255,255,255,0.04)",
                  color: isActive ? "#f1f5f9" : "#64748b",
                  transition: "all 0.18s",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  whiteSpace: "nowrap",
                }}
              >
                {tool.label}
                <span
                  style={{
                    fontSize: 9,
                    padding: "1px 5px",
                    borderRadius: 4,
                    background: isActive ? `${tool.badgeColor}30` : "rgba(255,255,255,0.06)",
                    color: isActive ? tool.badgeColor : "#475569",
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                  }}
                >
                  {tool.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* 현재 도구 설명 */}
        <div
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#475569",
            fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {current?.desc}
        </div>
      </div>

      {/* ── 도구 콘텐츠 ── */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTool === "activity" && <ActivitySpecGenerator />}
        {activeTool === "metaon" && <MetaonSpecGenerator />}
      </div>
    </div>
  );
}
