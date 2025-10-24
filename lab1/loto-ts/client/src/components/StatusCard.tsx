import { useEffect, useState } from "react";
import { getStatus } from "../api";
import type { StatusResponse } from "../api";

export default function StatusCard() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getStatus().then(setData).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="card">Učitavanje statusa…</div>;
  if (err) return <div className="card"><strong>Greška:</strong> {err}</div>;
  if (!data?.round) return <div className="card">Trenutno u bazi nema evidentiranih kola.</div>;

  const r = data.round;
  return (
    <div className="card">
      <h3>Trenutno kolo</h3>
      <div className="row">
        <span className="badge">ID: {r.id}</span>
        <span className="badge">Uplate: {r.active ? "AKTIVNE" : "NEAKTIVNE"}</span>
        <span className="badge">Broj listića: {r.ticketCount}</span>
      </div>
      <div style={{marginTop:12}}>
        <span className="muted">Izvučeni brojevi: </span>
        {r.drawNumbers && !r.active ? (
          <strong>{r.drawNumbers.join(", ")}</strong>
        ) : (
          <span className="muted">— još nisu objavljeni</span>
        )}
      </div>
      <button onClick={load} style={{marginTop:12}}>Osvježi</button>
    </div>
  );
}
