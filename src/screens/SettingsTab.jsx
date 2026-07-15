import React, { useState } from "react";
import { User, LogOut, Sun, MoonStar } from "lucide-react";
import { Card, PageHeader } from "../components/ui.jsx";

/* ============================================================
   SETTINGS TAB
   ============================================================ */
function SettingsTab({ t, isDark, setIsDark, targets, setTargets, profile, onEditProfile }) {
  const [local, setLocal] = useState(targets);
  return (
    <div style={{ padding: "20px 18px" }}>
      <PageHeader t={t} title="Settings" />

      <Card t={t} style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: t.turmericDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={17} color={t.turmeric} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{profile?.name || "Your profile"}</div>
            <div style={{ fontSize: 11, color: t.inkFaint }}>{profile?.age}y · {profile?.height}cm · {profile?.weight}kg</div>
          </div>
        </div>
        <button onClick={onEditProfile} style={{
          background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: "6px 12px",
          fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, color: t.ink,
        }}>
          <LogOut size={12} /> Edit
        </button>
      </Card>

      <Card t={t} style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Appearance</span>
        <button onClick={() => setIsDark(d => !d)} style={{
          background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: "6px 12px",
          fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
        }}>
          {isDark ? <><Sun size={13} /> Light mode</> : <><MoonStar size={13} /> Dark mode</>}
        </button>
      </Card>

      <Card t={t} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Daily targets</div>
        {[
          { key: "calories", label: "Calories (kcal)" },
          { key: "protein", label: "Protein (g)" },
          { key: "carbs", label: "Carbs (g)" },
          { key: "fat", label: "Fat (g)" },
          { key: "water", label: "Water (bottles)" },
        ].map(f => (
          <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: t.inkDim }}>{f.label}</span>
            <input type="number" value={local[f.key]} onChange={e => setLocal(l => ({ ...l, [f.key]: Number(e.target.value) }))}
              style={{ width: 84, background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 8px", color: t.ink, fontSize: 16, textAlign: "right" }} />
          </div>
        ))}
        <button onClick={() => setTargets(local)} style={{
          width: "100%", marginTop: 6, background: t.turmeric, border: "none", borderRadius: 10,
          padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#241705",
        }}>Save targets</button>
      </Card>

      <div style={{ marginTop: 16, fontSize: 11, color: t.inkFaint, lineHeight: 1.6, textAlign: "center" }}>
        Your data is saved on this device and survives closing the app.<br />
        Steps and sleep are entered manually — Safari/web apps have no access to Apple Health data.<br />
        Automatic Apple Health/Watch sync needs a native app built with Xcode on a Mac.
      </div>
    </div>
  );
}

export { SettingsTab };
