// client/src/components/Header.tsx
import { useEffect, useState } from "react";
import { getSession } from "../api";
import type { SessionResponse } from "../api";

export default function Header() {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(setSession).finally(() => setLoading(false));
  }, []);

  return (
    <header className="container">
      <nav className="row" aria-label="Main">
        <strong>Loto 6/45</strong>
        <span style={{flex:1}} />
        {loading ? (
          <span className="muted">Provjera prijave…</span>
        ) : session?.isAuthenticated ? (
          <div className="row">
            {session.user?.picture && (
              <img src={session.user.picture} alt="avatar" width={28} height={28} style={{borderRadius:"50%"}} />
            )}
            <span className="badge">{session.user?.name || session.user?.email}</span>
            <a role="button" href="/logout">Odjava</a>
          </div>
        ) : (
          <a role="button" href="/login">Prijava</a>
        )}
      </nav>
      <hr />
    </header>
  );
}
