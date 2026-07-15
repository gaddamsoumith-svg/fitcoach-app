import React from "react";

/* Real crash prevention: without this, any uncaught render error in a child component
   (a bad workout entry, a malformed date, etc.) would unmount the entire app to a blank
   white screen with no way to recover short of fully reloading. This catches it, shows a
   recoverable message instead, and lets the person reset that screen without losing
   everything else stored in localStorage. */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a production build with a real backend, this is where a crash-reporting call
    // (e.g. to a logging endpoint) would go. There is no backend yet, so we log locally.
    console.error("FitCoach crashed:", error, info);
  }

  copyError = () => {
    const text = `${this.state.error?.name || "Error"}: ${this.state.error?.message || "Unknown"}\n\n${this.state.error?.stack || ""}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => this.setState({ copied: true }));
    }
  };

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || "Unknown error";
      return (
        <div style={{
          minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: 24, background: "#12151C", color: "#F3F1EA",
          fontFamily: "-apple-system, sans-serif", textAlign: "center",
        }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontSize: 13, color: "#9AA0AE", marginBottom: 16, maxWidth: 320 }}>
            This screen hit an unexpected error. Your saved data is safe — tap below to reload.
          </div>

          {/* Real diagnostic info instead of a generic message — copy/paste this if reporting a bug */}
          <div style={{
            background: "#1A1E28", border: "1px solid #2E3340", borderRadius: 10, padding: "10px 12px",
            marginBottom: 20, maxWidth: 320, textAlign: "left", fontFamily: "monospace", fontSize: 11,
            color: "#E8664D", wordBreak: "break-word",
          }}>
            {message}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={this.copyError}
              style={{ background: "none", border: "1px solid #2E3340", borderRadius: 12, padding: "12px 20px", fontWeight: 700, color: "#9AA0AE", fontSize: 13 }}
            >
              {this.state.copied ? "Copied!" : "Copy error"}
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              style={{ background: "#E8A33D", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, color: "#241705", fontSize: 14 }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
