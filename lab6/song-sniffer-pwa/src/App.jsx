import { useEffect, useState } from "react";
import { addRecording, listRecordings, deleteRecording } from "./db";
import "./app.css";

export default function App() {
  const [online, setOnline] = useState(navigator.onLine);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(12);
  const [lastRecording, setLastRecording] = useState(null)
  const [items, setItems] = useState([]);
  const [lastUrl, setLastUrl] = useState(null);
  const [audioUrls, setAudioUrls] = useState({});

  const canRecord = "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices && "MediaRecorder" in window;

  async function refreshItems() {
    const all = await listRecordings()
    all.sort((a, b) => b.createdAt - a.createdAt);
    setItems(all);
  }

  async function registerSync() {
    if (!("serviceWorker" in navigator)) return;
    if (!("SyncManager" in window)) return;

    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register("sync-recordings");
    } catch (err) {
      console.warn("registerSync failed:", err);
    }
  }

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

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      try {
        await addRecording({ blob, source: "mic" });
        setLastRecording(blob);
        await refreshItems();
        await registerSync();
      } catch (err) {
        console.error("Error saving recording:", err);
      } finally {
        setRecording(false);
      }
    }
  }

  useEffect(() => {
    refreshItems();
  }, []);

  useEffect(() => {
    if (!lastRecording) {
      setLastUrl(null);

      return;
    }

    const url = URL.createObjectURL(lastRecording);
    setLastUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [lastRecording]);

  useEffect(() => {
    const next = {};
    items.forEach((it) => {
      if (it?.blob) {
        next[it.id] = URL.createObjectURL(it.blob);
      }
    });

    setAudioUrls(next);

    return () => {
      Object.values(next).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

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
    if (!("serviceWorker" in navigator)) return;

    const handler = (event) => {
      if (event.data?.type === "SYNC_DONE") {
        refreshItems();
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      refreshItems();
    };
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
      <header className="app-header">
        <h1 className="app-title">SongSniffer</h1>

        <span
          className={`status-badge ${online ? "online" : "offline"}`}
          aria-label={online ? "Online" : "Offline"}
        >
          {online ? "Online" : "Offline"}
        </span>
      </header>


      <p style={{ lineHeight: 1.5 }}>
        Recognize a song from a <b>uploaded audio track</b> or record <b>12 seconds</b> with your microphone.
        If you are not connected to internet, audio track will be saved and checked when you are back online.
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
            {lastUrl && <audio controls src={lastUrl} />}
          </div>
        )}
        <label style={{ display: "block" }}>
          <input
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await addRecording({ blob: file, source: "upload" });
              await refreshItems();
              e.target.value = "";
            }}
          />
          <button type="button">📁 Upload audio</button>
        </label>
      </section>

      <hr style={{ margin: "16px 0" }} />

      <section>
        <h2 style={{ marginTop: 0 }}>History</h2>
        <div style={{ color: "#555" }}>
          {items.length === 0 ? (
            <p style={{ color: "#555" }}>No audio recordings.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
              {items.map((it) => (
                <li
                  key={it.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#555" }}>
                        {new Date(it.createdAt).toLocaleString()} • {it.source}
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        Status: {it.status}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        await deleteRecording(it.id);
                        await refreshItems();
                      }}
                    >
                      Delete 🗑️
                    </button>
                  </div>

                  {audioUrls[it.id] && <audio controls src={audioUrls[it.id]} />}

                  {it.result && (
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {it.result.image && (
                        <img
                          src={it.result.image}
                          alt={`Cover art for ${it.result.title ?? "song"}`}
                          width={64}
                          height={64}
                          style={{ borderRadius: 8, objectFit: "cover", border: "1px solid #ddd" }}
                          loading="lazy"
                        />
                      )}

                      <div>
                        <div>
                          <b>{it.result.artist}</b> – {it.result.title}
                        </div>
                        {it.result.album && (
                          <div style={{ fontSize: 12, color: "#555" }}>
                            Album: {it.result.album}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {it.error && <div style={{ color: "crimson" }}>{it.error}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
