import { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#6366f1",
    primaryTextColor: "#f1f5f9",
    primaryBorderColor: "#818cf8",
    lineColor: "#94a3b8",
    secondaryColor: "#1e293b",
    tertiaryColor: "#0f172a",
    background: "#0f172a",
    mainBkg: "#1e293b",
    nodeBorder: "#6366f1",
    clusterBkg: "#1e293b22",
    clusterBorder: "#475569",
    titleColor: "#f1f5f9",
    edgeLabelBackground: "#1e293b",
  },
  flowchart: { curve: "basis", padding: 16 },
  fontFamily: "'Noto Sans KR', sans-serif",
});

let renderCount = 0;

export default function MermaidDiagram({ code, onCopy, onDownload }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code || !code.trim()) {
      setSvg("");
      return;
    }
    const render = async () => {
      try {
        renderCount++;
        const id = `mmd-${renderCount}-${Date.now()}`;
        const { svg: result } = await mermaid.render(id, code.trim());
        setSvg(result);
        setError(null);
      } catch (e) {
        setError(e.message || "Mermaid rendering error");
        setSvg("");
      }
    };
    render();
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flow-diagram-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!code || !code.trim()) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: 13 }}>
        이 섹션에 응답을 입력하면 Flow 다이어그램이 자동 생성됩니다.
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button
          onClick={handleCopy}
          style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,.1)", background: copied ? "rgba(34,197,94,.1)" : "rgba(255,255,255,.04)", color: copied ? "#4ade80" : "#94a3b8", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}
        >
          {copied ? "✅ 복사됨" : "📋 Mermaid 코드 복사"}
        </button>
        <button
          onClick={handleDownloadSVG}
          style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "#94a3b8", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}
        >
          📥 SVG 다운로드
        </button>
      </div>

      {/* Diagram */}
      {error ? (
        <div style={{ padding: 16, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 8, color: "#fca5a5", fontSize: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>렌더링 오류</div>
          <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", color: "#f87171" }}>{error}</pre>
          <div style={{ marginTop: 12, fontWeight: 600, color: "#94a3b8" }}>Mermaid 코드:</div>
          <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", color: "#cbd5e1", marginTop: 4, padding: 12, background: "rgba(0,0,0,.3)", borderRadius: 6 }}>{code}</pre>
        </div>
      ) : (
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ background: "rgba(255,255,255,.02)", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,.05)", overflow: "auto", textAlign: "center" }}
        />
      )}

      {/* Code preview */}
      <details style={{ marginTop: 12 }}>
        <summary style={{ fontSize: 11, color: "#64748b", cursor: "pointer", userSelect: "none" }}>
          Mermaid 소스코드 보기
        </summary>
        <pre style={{ fontSize: 11, color: "#94a3b8", background: "rgba(0,0,0,.2)", padding: 12, borderRadius: 6, marginTop: 6, whiteSpace: "pre-wrap", lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
          {code}
        </pre>
      </details>
    </div>
  );
}
