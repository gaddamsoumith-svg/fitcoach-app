/* Shared style generators — reduces the duplicated inline-style objects that were previously
   redefined per-screen (primary CTA buttons, form inputs, secondary buttons all had 3-4 slightly
   different copies across the app). Not a full design-system rewrite, but the highest-traffic
   patterns now have one source of truth. */

function primaryButtonStyle(t, { disabled = false } = {}) {
  return {
    background: disabled ? t.border : t.turmeric,
    border: "none",
    borderRadius: 14,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 700,
    color: disabled ? t.inkFaint : "#241705",
    opacity: disabled ? 0.7 : 1,
  };
}

function secondaryButtonStyle(t) {
  return {
    background: "none",
    border: `1px solid ${t.border}`,
    borderRadius: 14,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 700,
    color: t.inkDim,
  };
}

function textInputStyle(t) {
  return {
    width: "100%",
    background: t.bgElevated,
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    padding: "11px 12px",
    color: t.ink,
    fontSize: 16,
  };
}

function fieldLabelStyle(t) {
  return { fontSize: 12, fontWeight: 600, color: t.inkDim };
}

export { primaryButtonStyle, secondaryButtonStyle, textInputStyle, fieldLabelStyle };
