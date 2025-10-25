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

  if (loading) return <div className="card">Loading...</div>;
  if (err) return <div className="card"><strong>Error:</strong> {err}</div>;
  if (!data?.round) return <div className="card">No rounds available</div>;

  const r = data.round;
  return (
    <div className="card">
      <h3>Current round</h3>
      <div className="row">
        <span className="badge">Round: {r.id}</span>
        <span className="badge">Payments: {r.active ? "ACTIVE" : "NOT ACTIVE"}</span>
        <span className="badge">Ticket count: {r.ticketCount}</span>
      </div>
      <div style={{marginTop:12}}>
        <span className="muted">Drawn numbers: </span>
        {r.drawNumbers && !r.active ? (
          <strong>{r.drawNumbers.join(", ")}</strong>
        ) : (
          <span className="muted">— Numbers not drawn yet</span>
        )}
      </div>
      <button onClick={load} style={{marginTop:12}}>Refresh</button>
    </div>
  );
}
