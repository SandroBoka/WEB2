import { useEffect, useRef, useState } from "react";
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
  const [pushEnabled, setPushEnabled] = useState(false);
  const fileInputRef = useRef(null);

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
      if (!reg.active) {
        const sw = reg.installing || reg.waiting;
        if (sw) {
          await new Promise((resolve) => {
            if (sw.state === "activated") return resolve();
            sw.addEventListener("statechange", () => {
              if (sw.state === "activated") resolve();
            });
          });
        }
      }
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

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  async function enablePush() {
    if (!("serviceWorker" in navigator)) return;
    if (!("PushManager" in window)) return;

    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      setPushEnabled(false);
      return;
    }

    const keyRes = await fetch("/api/vapidPublicKey");
    const { key } = await keyRes.json();

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key)
      });
    }

    await fetch("/api/saveSubscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub)
    });

    setPushEnabled(true);
  }

  async function disablePush() {
    if (!("serviceWorker" in navigator)) return;
    if (!("PushManager" in window)) return;

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
    }

    setPushEnabled(false);
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
    if (!("serviceWorker" in navigator)) return;
    if (!("PushManager" in window)) return;

    (async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setPushEnabled(!!sub && Notification.permission === "granted");
    })();
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
    <div className="app-shell">
      <main className="app-card">
        <header className="app-header">
          <div className="title-block">
            <h1 className="app-title">SongSniffer</h1>
            <p className="app-description">
              Recognize a song from a <b>uploaded audio track</b> or record <b>12 seconds</b> with your microphone.
              If you are not connected to internet, audio track will be saved and checked when you are back online.
            </p>
          </div>

          <span
            className={`status-badge ${online ? "online" : "offline"}`}
            aria-label={online ? "Online" : "Offline"}
          >
            {online ? "Online" : "Offline"}
          </span>
        </header>

        <div className="app-layout">
          <section className="app-actions">
            {canRecord && (
              <button className="btn btn-primary" type="button" onClick={record12Seconds} disabled={recording}>
                {recording ? `🎙️ Recording (${countdown})` : "🎙️ Record 12s of audio"}
              </button>
            )}

            {lastRecording && (
              <div className="last-audio">
                <p>Last audio</p>
                {lastUrl && <audio controls src={lastUrl} />}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="file-input"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await addRecording({ blob: file, source: "upload" });
                await refreshItems();
                await registerSync();
                e.target.value = "";
              }}
            />
            <button className="btn btn-secondary" type="button" onClick={() => fileInputRef.current?.click()}>
              📁 Upload audio
            </button>
          </section>

          <aside className="app-side">
            <div className="side-card">
              <div className="side-title">Notifications</div>
              <div className="side-status">
                <span className={`dot ${pushEnabled ? "on" : "off"}`} />
                {pushEnabled ? "Enabled" : "Disabled"}
              </div>
              <p className="side-copy">
                Get a push when a song is recognized, even if the app is closed.
              </p>
              <button
                type="button"
                className={`btn ${pushEnabled ? "btn-secondary" : "btn-primary"}`}
                onClick={pushEnabled ? disablePush : enablePush}
              >
                {pushEnabled ? "Disable notifications" : "Enable notifications"}
              </button>
            </div>
          </aside>
        </div>

        <section className="history">
          <div className="section-header">
            <h2>History</h2>
          </div>
          <div className="section-body">
            {items.length === 0 ? (
              <p className="muted">No audio recordings.</p>
            ) : (
              <ul className="history-list">
                {items.map((it) => (
                  <li key={it.id} className="history-item">
                    <div className="history-top">
                      <div>
                        <div className="meta">
                          {new Date(it.createdAt).toLocaleString()} • {it.source}
                        </div>
                        <div className="status">
                          Status: {it.status}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-ghost"
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
                      <div className="result">
                        {it.result.image && (
                          <img
                            src={it.result.image}
                            alt={`Cover art for ${it.result.title ?? "song"}`}
                            width={64}
                            height={64}
                            className="cover"
                            loading="lazy"
                          />
                        )}

                        <div>
                          <div>
                            <b>{it.result.artist}</b> – {it.result.title}
                          </div>
                          {it.result.album && <div className="meta">Album: {it.result.album}</div>}
                        </div>
                      </div>
                    )}

                    {it.error && <div className="error">{it.error}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
