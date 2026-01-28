import { useEffect, useState } from "react";

export default function App() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  },
  []);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ margin: 0 }}>SongSniffer</h1>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid #ccc",
            fontSize: 12,
          }}
          aria-label={online ? "Online" : "Offline"}
        >
          {online ? "Online" : "Offline"}
        </span>
      </header>

      <p style={{ lineHeight: 1.5 }}>
        Prepoznaj pjesmu iz <b>uploadanog audio isječka</b> ili snimi <b>12 sekundi</b> mikrofonom.
        Ako nema interneta, isječak se sprema i šalje kad se veza vrati.
      </p>

      <section style={{ display: "grid", gap: 12 }}>
        <button type="button">🎙️ Snimi 12s (mikrofon)</button>
        <button type="button">📁 Upload audio isječka</button>
        <button type="button" disabled>
          🔄 Sync pending (kasnije)
        </button>
      </section>

      <hr style={{ margin: "16px 0" }} />

      <section>
        <h2 style={{ marginTop: 0 }}>Povijest</h2>
        <p style={{ color: "#555" }}>
          Ovdje će kasnije biti lista prepoznatih pjesama i pending snimki (offline queue).
        </p>
      </section>
    </div>
  );
}
