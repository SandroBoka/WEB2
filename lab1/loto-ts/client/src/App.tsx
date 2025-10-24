// client/src/App.tsx
import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import TicketForm from "./components/TicketForm";
import { getSession, getStatus } from "./api";
import type { SessionResponse, StatusResponse } from "./api";

export default function App() {
  const [tab, setTab] = useState<"home"|"pay">("home");
  const [session, setSession] = useState<SessionResponse|null>(null);
  const [status, setStatus] = useState<StatusResponse|null>(null);

  useEffect(() => {
    getSession().then(setSession).catch(() => {});
    getStatus().then(setStatus).catch(() => {});
  }, []);

  const canPay = !!session?.isAuthenticated && !!status?.round?.active;

  return (
    <>
      <Header />
      <main className="container grid">
        <div className="row" role="tablist">
          <button role="tab" aria-selected={tab==="home"} onClick={() => setTab("home")}>Početna</button>
          <button role="tab" aria-selected={tab==="pay"} onClick={() => setTab("pay")} disabled={!canPay}>
            Uplata listića {canPay ? "" : " (prijava + aktivne uplate)"}
          </button>
        </div>

        {tab === "home" && (
          <>
            <StatusCard />
            {!session?.isAuthenticated ? (
              <div className="card">
                <p>Za uplatu listića potrebno je prijaviti se.</p>
                <a role="button" href="/login">Prijava</a>
              </div>
            ) : (
              <div className="card">
                <p>Prijavljeni ste kao <strong>{session.user?.name || session.user?.email}</strong>.</p>
                {status?.round?.active ? (
                  <button onClick={() => setTab("pay")}>Uplati listić</button>
                ) : (
                  <p className="muted">Uplate nisu aktivne.</p>
                )}
              </div>
            )}
          </>
        )}

        {tab === "pay" && (
          <TicketForm uplateAktivne={!!status?.round?.active} />
        )}
      </main>
      <footer className="container muted" style={{marginTop:24}}>
        <hr />
        <small>© {new Date().getFullYear()} Loto demo</small>
      </footer>
    </>
  );
}
