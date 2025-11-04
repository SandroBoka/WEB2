import React, { useEffect, useState } from "react"
import { getState, postToggle, postXss, login, logout, getAdmin, buildAdminUrl } from "./api";
import type { AppState } from "./types";

import Section from "./components/Section";
import TogglePanel from "./components/TogglePanel";
import XssForm from "./components/XssForm";
import MessagesList from "./components/MessagesList";
import LoginPanel from "./components/LoginPanel";
import AdminPanel from "./components/AdminPanel";
import Logs from "./components/Logs";

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      setLoading(true);
      const s = await getState();
      setState(s);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh() }, []);

  if (loading) return <div className="container"><h1>…Učitavanje</h1></div>;
  if (error) return <div className="container"><h1>Greška</h1><p className="err">{error}</p></div>;
  if (!state) return null;

  return (
    <div className="container">
      <h1>XSS + Broken Access Control — React + TS</h1>

      <Section title="Prekidači ranjivosti">
        <TogglePanel
          xssEnabled={state.xssEnabled}
          bacEnabled={state.bacEnabled}
          onApply={async next => {
            await postToggle(next);
            await refresh();
          }}
        />
      </Section>

      <Section
        title="XSS (reflected)"
        subtitle="Kad je UKLJUČENO: poruke se prikazuju ne-escapeane (može se izvršiti JS). Kad je ISKLJUČENO: escapeano (sigurnije)."
      >
        <XssForm
          onSubmit={async (message) => {
            await postXss(message);
            await refresh();
          }}
        />
        <h3>Posljednje poruke</h3>
        <MessagesList messages={state.messages} xssEnabled={state.xssEnabled} />
      </Section>

      <Section title="Prijava i BAC">
        <LoginPanel
          onLogin={async (u, p) => {
            await login(u, p);
            window.open(buildAdminUrl(), "_blank", "noopener");
            await refresh();
          }}
          onLogout={async () => {
            await logout();
            await refresh();
          }}
          currentUser={state.currentUser}
        />
        <p>
          {state.bacEnabled ? (
            <span className="danger">
              RANJIVO: probaj pristupiti kao obični korisnik s dodanim <code>?role=admin</code> u URL-u pri pozivu admin endpointa.
            </span>
          ) : (
            <span>Sigurnije: admin pristup samo za stvarnog korisnika <code>admin</code>.</span>
          )}
        </p>
        <AdminPanel onRequest={getAdmin} />
        <p style={{ marginTop: ".5rem" }}>
          URL za admin (otvara se u novom tabu):{" "}
          <a href={buildAdminUrl()} target="_blank" rel="noopener">
            {buildAdminUrl()}
          </a>
        </p>
      </Section>

      <Section title="Dnevnik (log)">
        <Logs logs={state.logs} />
      </Section>
    </div>
  );
}
