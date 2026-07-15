import React, { useState, useRef } from "react";
import { Trash2, ChevronLeft } from "lucide-react";

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Ring({ pct, size = 84, stroke = 9, color, track, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - Math.min(Math.max(pct, 0), 1) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function Card({ children, style, t, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 18,
        padding: 16, ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color, background: bg, padding: "3px 9px", borderRadius: 999, letterSpacing: 0.2 }}>
      {children}
    </span>
  );
}

function ProgressBar({ pct, color, track }) {
  return (
    <div style={{ height: 8, borderRadius: 999, background: track, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, height: "100%", background: color, transition: "width 0.4s ease" }} />
    </div>
  );
}

/* Swipe-left-to-reveal-delete wrapper. Works with touch and mouse (pointer events). */
function SwipeableRow({ t, onDelete, children }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const baseXRef = useRef(0);
  const DELETE_WIDTH = 78;

  const onPointerDown = (e) => {
    setDragging(true);
    startXRef.current = e.clientX;
    baseXRef.current = dragX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const delta = e.clientX - startXRef.current;
    setDragX(Math.min(0, Math.max(baseXRef.current + delta, -DELETE_WIDTH)));
  };
  const endDrag = () => {
    setDragging(false);
    setDragX(prev => (prev < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 18 }}>
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: DELETE_WIDTH,
        background: t.coral, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <button onClick={onDelete} style={{
          background: "none", border: "none", color: "#2A0E08", display: "flex",
          flexDirection: "column", alignItems: "center", gap: 2, width: "100%", height: "100%", justifyContent: "center",
        }}>
          <Trash2 size={16} />
          <span style={{ fontSize: 10, fontWeight: 700 }}>Delete</span>
        </button>
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? "none" : "transform 0.2s ease",
          touchAction: "pan-y",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Shared "< Back" navigation button — was a hand-copied identical style object in ~4+ places */
function BackButton({ t, onClick, label = "Back", style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", color: t.inkDim, display: "flex",
      alignItems: "center", gap: 4, padding: 0, ...style,
    }}>
      <ChevronLeft size={18} /> {label}
    </button>
  );
}

/* Shared page title + subtitle header — was redefined per-screen with identical font sizes/weights */
function PageHeader({ t, title, subtitle, style = {} }) {
  return (
    <div style={style}>
      <div className="display" style={{ fontSize: 20, fontWeight: 800 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: t.inkDim, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

/* ============================================================
   BODY MAP — interactive front/back muscle diagram (original SVG, tappable regions)
   ============================================================ */

export { Ring, Card, Pill, ProgressBar, SwipeableRow, BackButton, PageHeader };
