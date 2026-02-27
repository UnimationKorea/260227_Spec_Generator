import { useState, useCallback } from "react";

// ─── 필드 이름 추상화 ───────────────────────────────────────
const getSecName  = s => s.label  ?? s.title  ?? "이름 없음";
const getSecEmoji = s => s.emoji  ?? s.icon   ?? "📌";
const getSecColor = s => s.color  ?? "#6366F1";
const getQText    = q => q.text   ?? q.q      ?? "";

const setSecName  = (s, v) => s.label  !== undefined ? { label: v  } : { title: v  };
const setSecEmoji = (s, v) => s.emoji  !== undefined ? { emoji: v  } : { icon:  v  };
const setQText    = (q, v) => q.text   !== undefined ? { text:  v  } : { q:     v  };

// ─── 유틸 ────────────────────────────────────────────────────
const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;
const cloneDeep = d => JSON.parse(JSON.stringify(d));
const COLORS = ["#6366F1","#EC4899","#F59E0B","#10B981","#3B82F6","#8B5CF6","#F97316","#EF4444","#0EA5E9","#14B8A6"];
const TYPE_OPTS = [
  { value: "single", label: "단일 선택 (single)" },
  { value: "multi",  label: "복수 선택 (multi)"  },
  { value: "text",   label: "텍스트 입력 (text)" },
];

// ─── 스타일 상수 ─────────────────────────────────────────────
const D = {
  overlay:  { position:"fixed", inset:0, background:"rgba(0,0,0,.65)", backdropFilter:"blur(6px)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" },
  modal:    { width:"min(1100px,96vw)", height:"min(780px,92vh)", background:"#0f172a", border:"1px solid rgba(255,255,255,.1)", borderRadius:16, display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,.6)" },
  hdr:      { padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.02)", flexShrink:0 },
  body:     { flex:1, display:"flex", overflow:"hidden" },
  left:     { width:260, flexShrink:0, borderRight:"1px solid rgba(255,255,255,.07)", display:"flex", flexDirection:"column", overflow:"hidden" },
  right:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
  secItem:  { display:"flex", alignItems:"center", gap:8, padding:"8px 12px", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,.04)", transition:"background .15s" },
  badge:    { padding:"1px 7px", borderRadius:10, fontSize:10, fontWeight:700 },
  btn:      { border:"none", borderRadius:7, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12 },
  iconBtn:  { border:"1px solid rgba(255,255,255,.1)", borderRadius:6, width:26, height:26, background:"rgba(255,255,255,.04)", color:"#94a3b8", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit", transition:"all .15s", flexShrink:0 },
  inp:      { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:7, padding:"6px 10px", color:"#e2e8f0", fontSize:12, outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" },
  label:    { fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:4 },
};

// ─── 타입 배지 색상 ───────────────────────────────────────────
const typeBadge = t => ({
  single: { bg:"rgba(99,102,241,.15)", color:"#a5b4fc" },
  multi:  { bg:"rgba(236,72,153,.12)", color:"#f9a8d4" },
  text:   { bg:"rgba(16,185,129,.12)", color:"#6ee7b7"  },
}[t] ?? { bg:"rgba(255,255,255,.06)", color:"#94a3b8" });

// ════════════════════════════════════════════════════
//  SectionDashboard
// ════════════════════════════════════════════════════
export default function SectionDashboard({ sections, onSave, onClose }) {
  const [secs, setSecs]   = useState(() => cloneDeep(sections));
  const [actId, setActId] = useState(secs[0]?.id ?? null);      // 선택된 섹션 ID
  const [editSec, setEditSec]   = useState(null);   // 인라인 수정 중인 섹션 ID
  const [editQKey, setEditQKey] = useState(null);   // "secId:qIdx" 수정 중인 질문
  const [dirty, setDirty] = useState(false);

  const mark = () => setDirty(true);

  // ── 섹션 CRUD ──────────────────────────────────────
  const updateSec = useCallback((id, patch) => {
    setSecs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    mark();
  }, []);

  const deleteSec = useCallback((id) => {
    if (!window.confirm("이 카테고리를 삭제하시겠습니까?")) return;
    setSecs(prev => {
      const next = prev.filter(s => s.id !== id);
      if (actId === id) setActId(next[0]?.id ?? null);
      return next;
    });
    mark();
  }, [actId]);

  const addSec = useCallback(() => {
    const newId = uid();
    const template = sections[0];
    const newSec = {
      id: newId,
      ...(template.label  !== undefined ? { label: "새 카테고리", emoji: "📌", color: COLORS[secs.length % COLORS.length] } : {}),
      ...(template.title  !== undefined ? { title: "새 카테고리", icon:  "📌" } : {}),
      desc: "",
      questions: [],
    };
    setSecs(prev => [...prev, newSec]);
    setActId(newId);
    setEditSec(newId);
    mark();
  }, [secs.length, sections]);

  const moveSecUp = useCallback((idx) => {
    if (idx === 0) return;
    setSecs(prev => { const a = [...prev]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; return a; });
    mark();
  }, []);

  const moveSecDown = useCallback((idx) => {
    setSecs(prev => {
      if (idx === prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; return a;
    });
    mark();
  }, []);

  // ── 질문 CRUD ──────────────────────────────────────
  const updateQ = useCallback((secId, qIdx, patch) => {
    setSecs(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const qs = [...s.questions];
      qs[qIdx] = { ...qs[qIdx], ...patch };
      return { ...s, questions: qs };
    }));
    mark();
  }, []);

  const deleteQ = useCallback((secId, qIdx) => {
    if (!window.confirm("이 질문을 삭제하시겠습니까?")) return;
    setSecs(prev => prev.map(s => {
      if (s.id !== secId) return s;
      return { ...s, questions: s.questions.filter((_, i) => i !== qIdx) };
    }));
    if (editQKey === `${secId}:${qIdx}`) setEditQKey(null);
    mark();
  }, [editQKey]);

  const addQ = useCallback((secId) => {
    const sec = secs.find(s => s.id === secId);
    const qField = sec?.questions[0]?.text !== undefined ? "text" : "q";
    const newQ = { id: uid(), type: "single", [qField]: "새 질문을 입력하세요", hint: "", options: ["옵션 1", "옵션 2"] };
    setSecs(prev => prev.map(s => s.id === secId ? { ...s, questions: [...s.questions, newQ] } : s));
    const secNow = secs.find(s => s.id === secId);
    setEditQKey(`${secId}:${(secNow?.questions.length ?? 0)}`);
    mark();
  }, [secs]);

  const moveQ = useCallback((secId, qIdx, dir) => {
    setSecs(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const qs = [...s.questions];
      const n = qIdx + dir;
      if (n < 0 || n >= qs.length) return s;
      [qs[qIdx], qs[n]] = [qs[n], qs[qIdx]];
      return { ...s, questions: qs };
    }));
    mark();
  }, []);

  // ── 옵션 CRUD ──────────────────────────────────────
  const addOpt = useCallback((secId, qIdx) => {
    setSecs(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const qs = [...s.questions];
      qs[qIdx] = { ...qs[qIdx], options: [...(qs[qIdx].options ?? []), "새 옵션"] };
      return { ...s, questions: qs };
    }));
    mark();
  }, []);

  const updateOpt = useCallback((secId, qIdx, oIdx, val) => {
    setSecs(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const qs = [...s.questions];
      const opts = [...(qs[qIdx].options ?? [])];
      opts[oIdx] = val;
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...s, questions: qs };
    }));
    mark();
  }, []);

  const deleteOpt = useCallback((secId, qIdx, oIdx) => {
    setSecs(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const qs = [...s.questions];
      const opts = (qs[qIdx].options ?? []).filter((_, i) => i !== oIdx);
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...s, questions: qs };
    }));
    mark();
  }, []);

  const moveOpt = useCallback((secId, qIdx, oIdx, dir) => {
    setSecs(prev => prev.map(s => {
      if (s.id !== secId) return s;
      const qs = [...s.questions];
      const opts = [...(qs[qIdx].options ?? [])];
      const n = oIdx + dir;
      if (n < 0 || n >= opts.length) return s;
      [opts[oIdx], opts[n]] = [opts[n], opts[oIdx]];
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...s, questions: qs };
    }));
    mark();
  }, []);

  // ── 현재 선택된 섹션 ────────────────────────────────
  const activeSec = secs.find(s => s.id === actId);

  // ── 저장 ───────────────────────────────────────────
  const handleSave = () => { onSave(secs); };

  // ══════════════════════════════════════════════════
  return (
    <div style={D.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={D.modal} onClick={e => e.stopPropagation()}>

        {/* ── 헤더 ── */}
        <div style={D.hdr}>
          <span style={{ fontSize:18 }}>🗂️</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#f1f5f9" }}>섹션 대시보드</div>
            <div style={{ fontSize:11, color:"#64748b" }}>카테고리 및 질문 항목을 추가·수정·삭제할 수 있습니다</div>
          </div>
          {dirty && <span style={{ fontSize:11, color:"#f59e0b", fontWeight:600 }}>● 미저장 변경</span>}
          <button onClick={onClose}
            style={{ ...D.btn, padding:"6px 14px", background:"rgba(255,255,255,.05)", color:"#94a3b8" }}>
            취소
          </button>
          <button onClick={handleSave}
            style={{ ...D.btn, padding:"6px 18px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff" }}>
            💾 저장
          </button>
        </div>

        {/* ── 바디 ── */}
        <div style={D.body}>

          {/* ── 좌: 섹션 목록 ── */}
          <div style={D.left}>
            <div style={{ padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,.06)", fontSize:11, fontWeight:700, color:"#64748b", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
              <span>카테고리 ({secs.length})</span>
              <button onClick={addSec}
                style={{ ...D.btn, padding:"3px 10px", background:"rgba(99,102,241,.15)", color:"#a5b4fc", border:"1px solid rgba(99,102,241,.3)", fontSize:11 }}>
                + 추가
              </button>
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {secs.map((sec, idx) => (
                <SecListItem
                  key={sec.id}
                  sec={sec}
                  idx={idx}
                  total={secs.length}
                  isActive={actId === sec.id}
                  isEditing={editSec === sec.id}
                  onClick={() => { setActId(sec.id); setEditSec(null); setEditQKey(null); }}
                  onEdit={() => setEditSec(editSec === sec.id ? null : sec.id)}
                  onDelete={() => deleteSec(sec.id)}
                  onMoveUp={() => moveSecUp(idx)}
                  onMoveDown={() => moveSecDown(idx)}
                  onUpdate={(patch) => updateSec(sec.id, patch)}
                  onCancelEdit={() => setEditSec(null)}
                />
              ))}
            </div>
          </div>

          {/* ── 우: 질문 목록 ── */}
          <div style={D.right}>
            {!activeSec ? (
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#475569", fontSize:13 }}>
                왼쪽에서 카테고리를 선택하세요
              </div>
            ) : (
              <>
                {/* 섹션 정보 헤더 */}
                <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", gap:10, flexShrink:0, background:"rgba(255,255,255,.015)" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background: getSecColor(activeSec) + "22", border:`1px solid ${getSecColor(activeSec)}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                    {getSecEmoji(activeSec)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>{getSecName(activeSec)}</div>
                    <div style={{ fontSize:11, color:"#64748b" }}>{activeSec.desc || "설명 없음"} · 질문 {activeSec.questions.length}개</div>
                  </div>
                  <button onClick={() => addQ(activeSec.id)}
                    style={{ ...D.btn, padding:"5px 14px", background:"rgba(16,185,129,.12)", color:"#4ade80", border:"1px solid rgba(16,185,129,.25)" }}>
                    + 질문 추가
                  </button>
                </div>

                {/* 질문 목록 */}
                <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
                  {activeSec.questions.length === 0 ? (
                    <div style={{ textAlign:"center", padding:40, color:"#475569", fontSize:12 }}>
                      질문이 없습니다. 위의 <strong>+ 질문 추가</strong>를 클릭하세요.
                    </div>
                  ) : activeSec.questions.map((q, qi) => (
                    <QItem
                      key={q.id ?? qi}
                      q={q}
                      qi={qi}
                      total={activeSec.questions.length}
                      secId={activeSec.id}
                      isEditing={editQKey === `${activeSec.id}:${qi}`}
                      onEdit={() => setEditQKey(editQKey === `${activeSec.id}:${qi}` ? null : `${activeSec.id}:${qi}`)}
                      onDelete={() => deleteQ(activeSec.id, qi)}
                      onMoveUp={() => moveQ(activeSec.id, qi, -1)}
                      onMoveDown={() => moveQ(activeSec.id, qi, 1)}
                      onUpdate={(patch) => updateQ(activeSec.id, qi, patch)}
                      onAddOpt={() => addOpt(activeSec.id, qi)}
                      onUpdateOpt={(oi, v) => updateOpt(activeSec.id, qi, oi, v)}
                      onDeleteOpt={(oi) => deleteOpt(activeSec.id, qi, oi)}
                      onMoveOpt={(oi, dir) => moveOpt(activeSec.id, qi, oi, dir)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
//  SecListItem
// ════════════════════════════════════════════════════
function SecListItem({ sec, idx, total, isActive, isEditing, onClick, onEdit, onDelete, onMoveUp, onMoveDown, onUpdate, onCancelEdit }) {
  const color = getSecColor(sec);
  const [draft, setDraft] = useState({ name: getSecName(sec), emoji: getSecEmoji(sec), color, desc: sec.desc ?? "" });

  const save = () => {
    onUpdate({ ...setSecName(sec, draft.name), ...setSecEmoji(sec, draft.emoji), color: draft.color, desc: draft.desc });
    onCancelEdit();
  };

  return (
    <div>
      {/* 목록 행 */}
      <div
        style={{ ...D.secItem, background: isActive ? "rgba(99,102,241,.1)" : "transparent" }}
        onClick={onClick}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,.03)"; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ width:3, height:20, borderRadius:2, background: color, flexShrink:0 }} />
        <span style={{ fontSize:15, flexShrink:0 }}>{getSecEmoji(sec)}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color: isActive ? "#e2e8f0" : "#94a3b8", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {getSecName(sec)}
          </div>
          <div style={{ fontSize:10, color:"#475569" }}>{sec.questions?.length ?? 0}개 질문</div>
        </div>
        <div style={{ display:"flex", gap:3 }} onClick={e => e.stopPropagation()}>
          <button style={D.iconBtn} onClick={onMoveUp}  title="위로" disabled={idx===0}>↑</button>
          <button style={D.iconBtn} onClick={onMoveDown} title="아래로" disabled={idx===total-1}>↓</button>
          <button style={{ ...D.iconBtn, color: isEditing ? "#a5b4fc" : "#94a3b8" }} onClick={onEdit} title="수정">✎</button>
          <button style={{ ...D.iconBtn, color:"#f87171" }} onClick={onDelete} title="삭제">🗑</button>
        </div>
      </div>

      {/* 인라인 수정 폼 */}
      {isEditing && (
        <div style={{ background:"rgba(99,102,241,.06)", border:"1px solid rgba(99,102,241,.15)", borderRadius:8, margin:"4px 10px", padding:12 }} onClick={e => e.stopPropagation()}>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <div style={{ flex:"0 0 56px" }}>
              <span style={D.label}>이모지</span>
              <input style={{ ...D.inp, textAlign:"center", fontSize:18, padding:"4px" }} value={draft.emoji} onChange={e => setDraft(d => ({ ...d, emoji: e.target.value }))} />
            </div>
            <div style={{ flex:1 }}>
              <span style={D.label}>카테고리 이름</span>
              <input style={D.inp} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom:8 }}>
            <span style={D.label}>색상</span>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setDraft(d => ({ ...d, color: c }))}
                  style={{ width:20, height:20, borderRadius:4, background:c, cursor:"pointer", border: draft.color === c ? "2px solid #fff" : "2px solid transparent", boxSizing:"border-box" }} />
              ))}
              <input type="color" value={draft.color} onChange={e => setDraft(d => ({ ...d, color: e.target.value }))}
                style={{ width:20, height:20, border:"none", padding:0, cursor:"pointer", borderRadius:4, background:"transparent" }} />
            </div>
          </div>
          <div style={{ marginBottom:10 }}>
            <span style={D.label}>설명</span>
            <input style={D.inp} value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} placeholder="카테고리 설명" />
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={save} style={{ ...D.btn, padding:"5px 14px", background:"rgba(99,102,241,.2)", color:"#a5b4fc", border:"1px solid rgba(99,102,241,.3)" }}>저장</button>
            <button onClick={onCancelEdit} style={{ ...D.btn, padding:"5px 14px", background:"rgba(255,255,255,.04)", color:"#64748b", border:"1px solid rgba(255,255,255,.08)" }}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
//  QItem — 개별 질문 행 + 인라인 편집기
// ════════════════════════════════════════════════════
function QItem({ q, qi, total, secId, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, onUpdate, onAddOpt, onUpdateOpt, onDeleteOpt, onMoveOpt }) {
  const qtext = getQText(q);
  const tc = typeBadge(q.type);
  const [draft, setDraft] = useState({ text: qtext, type: q.type, hint: q.hint ?? "", placeholder: q.placeholder ?? "" });

  const save = () => {
    onUpdate({ ...setQText(q, draft.text), type: draft.type, hint: draft.hint, placeholder: draft.placeholder });
    onEdit(); // toggle close
  };

  return (
    <div style={{ margin:"0 12px 4px", borderRadius:8, border:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.015)", overflow:"hidden" }}>
      {/* 질문 행 */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px" }}>
        <span style={{ fontSize:10, fontWeight:700, color:"#475569", flexShrink:0, minWidth:24 }}>Q{qi+1}</span>
        <span style={{ ...D.badge, background:tc.bg, color:tc.color, flexShrink:0 }}>{q.type}</span>
        <div style={{ flex:1, fontSize:12, color:"#cbd5e1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={qtext}>
          {qtext || <span style={{ color:"#475569", fontStyle:"italic" }}>질문 없음</span>}
        </div>
        <div style={{ display:"flex", gap:3 }}>
          <button style={D.iconBtn} onClick={onMoveUp}   title="위로"   disabled={qi===0}>↑</button>
          <button style={D.iconBtn} onClick={onMoveDown} title="아래로" disabled={qi===total-1}>↓</button>
          <button style={{ ...D.iconBtn, color: isEditing ? "#a5b4fc" : "#94a3b8" }} onClick={onEdit} title="수정">✎</button>
          <button style={{ ...D.iconBtn, color:"#f87171" }} onClick={onDelete} title="삭제">🗑</button>
        </div>
      </div>

      {/* 인라인 편집 폼 */}
      {isEditing && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", padding:"12px", background:"rgba(99,102,241,.04)" }}>
          {/* 타입 */}
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <div style={{ flex:"0 0 160px" }}>
              <span style={D.label}>질문 유형</span>
              <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}
                style={{ ...D.inp, cursor:"pointer" }}>
                {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div style={{ flex:1 }}>
              <span style={D.label}>힌트 (선택)</span>
              <input style={D.inp} value={draft.hint} onChange={e => setDraft(d => ({ ...d, hint: e.target.value }))} placeholder="예: 복수 선택 가능" />
            </div>
          </div>

          {/* 질문 텍스트 */}
          <div style={{ marginBottom:8 }}>
            <span style={D.label}>질문 텍스트</span>
            <textarea value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
              rows={2}
              style={{ ...D.inp, resize:"vertical", lineHeight:1.5 }} />
          </div>

          {/* text 타입이면 placeholder */}
          {draft.type === "text" && (
            <div style={{ marginBottom:8 }}>
              <span style={D.label}>Placeholder</span>
              <input style={D.inp} value={draft.placeholder} onChange={e => setDraft(d => ({ ...d, placeholder: e.target.value }))} />
            </div>
          )}

          {/* single / multi 타입이면 옵션 목록 */}
          {(draft.type === "single" || draft.type === "multi") && (
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={D.label}>선택지 ({q.options?.length ?? 0}개)</span>
                <button onClick={onAddOpt}
                  style={{ ...D.btn, padding:"2px 10px", background:"rgba(16,185,129,.1)", color:"#4ade80", border:"1px solid rgba(16,185,129,.2)", fontSize:11 }}>
                  + 옵션 추가
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {(q.options ?? []).map((opt, oi) => (
                  <div key={oi} style={{ display:"flex", gap:4, alignItems:"center" }}>
                    <span style={{ fontSize:10, color:"#475569", width:20, textAlign:"right", flexShrink:0 }}>{oi+1}</span>
                    <input value={opt}
                      onChange={e => onUpdateOpt(oi, e.target.value)}
                      style={{ ...D.inp, flex:1 }} />
                    <button style={D.iconBtn} onClick={() => onMoveOpt(oi,-1)} title="위" disabled={oi===0}>↑</button>
                    <button style={D.iconBtn} onClick={() => onMoveOpt(oi, 1)} title="아래" disabled={oi===(q.options?.length??1)-1}>↓</button>
                    <button style={{ ...D.iconBtn, color:"#f87171" }} onClick={() => onDeleteOpt(oi)} title="삭제">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 저장/취소 */}
          <div style={{ display:"flex", gap:6, marginTop:6 }}>
            <button onClick={save} style={{ ...D.btn, padding:"5px 16px", background:"rgba(99,102,241,.2)", color:"#a5b4fc", border:"1px solid rgba(99,102,241,.3)" }}>저장</button>
            <button onClick={onEdit} style={{ ...D.btn, padding:"5px 14px", background:"rgba(255,255,255,.04)", color:"#64748b", border:"1px solid rgba(255,255,255,.08)" }}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}
