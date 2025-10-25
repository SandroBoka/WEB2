import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import TicketForm from "./components/TicketForm";
import { getSession, getStatus } from "./api";
import type { SessionResponse, StatusResponse } from "./api";
import TicketViewer from "./components/TicketViewer";

type Tab = "home" | "pay";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);

  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const onTabChange = (t: Tab) => {
    if (window.location.pathname.startsWith("/ticket/")) {
      window.history.pushState({}, "", "/");
      setPath("/");
    }
    setTab(t);
  };

  useEffect(() => {
    getSession().then(setSession).catch(() => {});
    getStatus().then(setStatus).catch(() => {});
  }, []);

  const canPay = !!session?.isAuthenticated && !!status?.round?.active;
  const ticketCode = path.startsWith("/ticket/")
    ? decodeURIComponent(path.slice("/ticket/".length))
    : null;

  return (
    <>
      <Header tab={tab} onTabChange={onTabChange} session={session} canPay={canPay} />
      <main className="container">
        {ticketCode ? (
          <div className="stack">
            <TicketViewer code={ticketCode} />
          </div>
        ) : tab === "home" ? (
          <div className="stack">
            {}
            <div className="w-fit"><StatusCard /></div>

            {}
            <div className="card w-fit">
              {!session?.isAuthenticated ? (
                <p>Login required to buy a ticket.</p>
              ) : status?.round?.active ? (
                <button onClick={() => onTabChange("pay")}>Buy a ticket</button>
              ) : (
                <p className="muted">Buying a ticket is not currently available.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="stack">
            <div className="card w-fit">
              <TicketForm uplateAktivne={!!status?.round?.active} />
            </div>
          </div>
        )}
      </main>
      <footer className="container muted" style={{ marginTop: 24 }}>
        <hr />
        <small>© {new Date().getFullYear()} Sandro Loto</small>
      </footer>
    </>
  );
}
