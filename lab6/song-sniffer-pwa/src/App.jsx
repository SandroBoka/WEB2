import { useEffect, useState } from "react";

export default function App() {
  const [online, setOnline] = useState(navigator.onLine);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(12);
  const [lastRecording, setLastRecording] = useState(null)

  const canRecord = "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices && "MediaRecorder" in window;

  async function record12Seconds() {
    if (!canRecord || recording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.start();
    setRecording(true);
    setCountdown(12);

    setTimeout(() => {
      recorder.stop()
      stream.getTracks().forEach((t) => t.stop());
    }, 12_000);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      setLastRecording(blob);
      setRecording(false);
    }
  }

  useEffect(() => {
    if (!recording) return;

    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);

          return 0;
        }
        
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [recording]);

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
        {canRecord && (
          <button type="button" onClick={record12Seconds} disabled={recording}>
            {recording ? `🎙️ Recording (${countdown})` : "🎙️ Record 12s of audio"}
          </button>
        )}
        {lastRecording && (
          <div>
            <p>Last Audio:</p>
            <audio controls src={URL.createObjectURL(lastRecording)} />
          </div>
        )}
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
