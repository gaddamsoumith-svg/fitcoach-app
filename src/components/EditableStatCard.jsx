import React, { useState } from "react";
import { Card } from "./ui.jsx";

function EditableStatCard({ t, icon: Icon, color, label, value, onSave, suffix, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const save = () => { onSave(draft); setEditing(false); };
  if (editing) {
    return (
      <Card t={t} style={{ flex: 1 }}>
        <Icon size={16} color={color} />
        <input
          autoFocus inputMode="numeric" value={draft} placeholder={placeholder}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && save()}
          style={{ width: "100%", marginTop: 6, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 8px", color: t.ink, fontSize: 16 }}
        />
        <button onClick={save} style={{ width: "100%", marginTop: 6, background: color, border: "none", borderRadius: 8, padding: "5px 0", fontSize: 11, fontWeight: 700, color: t.bg }}>Save</button>
      </Card>
    );
  }
  return (
    <Card t={t} onClick={() => { setDraft(value || ""); setEditing(true); }} style={{ flex: 1, cursor: "pointer" }}>
      <Icon size={16} color={color} />
      <div className="mono" style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>{value ? `${value}${suffix}` : "— tap to log"}</div>
      <div style={{ fontSize: 11, color: t.inkFaint }}>{label}</div>
    </Card>
  );
}


export { EditableStatCard };
