import { useEffect, useState } from "react";

export default function TicketViewer({ code }: { code: string }) {
  const [data, setData] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const r = await fetch(`/api/ticket/${encodeURIComponent(code)}`, { credentials: "include" });
        if (!r.ok) throw new Error(await r.text());
        const j = await r.json();
        setData(j);
      } catch (e: any) {
        setErr(e?.message || "No ticket information.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [code]);

  if (loading) return <div className="card w-fit">Loading…</div>;
  if (err) return <div className="card w-fit" role="alert">Error: {err}</div>;
  if (!data) return null;

  return (
    <div className="card w-fit">
      <h3>Ticket</h3>
      <div className="row" style={{ gap: 12 }}>
        <span className="badge">Code: {data.ticket.code}</span>
        <span className="badge">Round: {data.round.id}</span>
        <span className="badge">Ticket purchase: {data.round.active ? "ACTIVE" : "NOT ACTIVE"}</span>
      </div>
      <p style={{ marginTop: 12 }}>
        <strong>Numbers:</strong> {data.ticket.numbers.join(", ")}
      </p>
      {data.round.drawNumbers ? (
        <p>
          <strong>Drawn numbers:</strong> {data.round.drawNumbers.join(", ")}
          {data.round.drawAt && (
            <span className="muted"> (Draw date: {new Date(data.round.drawAt).toLocaleString()})</span>
          )}
        </p>
      ) : (
        <p className="muted">Numbers have not yet been drawn for this round.</p>
      )}
    </div>
  );
}
