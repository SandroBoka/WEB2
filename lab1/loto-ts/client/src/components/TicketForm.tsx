import { useState } from "react";
import { submitTicket, validateTicket } from "../api";

export default function TicketForm({ uplateAktivne }: { uplateAktivne: boolean }) {
  const [documentId, setDocumentId] = useState("");
  const [numbers, setNumbers] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  if (!uplateAktivne) {
    return <div className="card">Uplate trenutno nisu aktivne.</div>;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMsg(null);
    setQrUrl(null);

    const errs = validateTicket(documentId, numbers);
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);

    try {
      setSubmitting(true);
      const blob = await submitTicket(documentId, numbers);
      const url = URL.createObjectURL(blob);
      setQrUrl(url);
      setServerMsg("Listić uspješno zaprimljen. Skeniraj ili preuzmi QR kod.");
    } catch (err: any) {
      setServerMsg(err.message || "Došlo je do pogreške.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "ticket-qr.png";
    a.click();
  };

  return (
    <div className="card">
      <h3>Uplata listića</h3>
      <form onSubmit={onSubmit} className="grid" style={{maxWidth:520}}>
        <label>
          Broj osobne iskaznice ili putovnice
          <input
            type="text"
            placeholder="npr. OI1234567"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            required
            maxLength={20}
          />
        </label>

        <label>
          Brojevi (6 do 10) od 1 do 45, odvojeni zarezima
          <input
            type="text"
            placeholder="npr. 3, 7, 12, 18, 33, 44"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            required
          />
        </label>

        {errors.length > 0 && (
          <div role="alert">
            <ul>
              {errors.map((er, i) => <li key={i}>• {er}</li>)}
            </ul>
          </div>
        )}

        <button type="submit" aria-busy={submitting}>
          {submitting ? "Slanje…" : "Uplati listić"}
        </button>
      </form>

      {serverMsg && <p style={{marginTop:12}}>{serverMsg}</p>}

      {qrUrl && (
        <div className="center" style={{marginTop:16, flexDirection:"column"}}>
          <img src={qrUrl} alt="QR kod listića" width={240} height={240} />
          <button style={{marginTop:12}} onClick={onDownload}>Preuzmi QR</button>
          <p className="muted" style={{marginTop:8}}>
            Otvara <code>/ticket/&lt;code&gt;</code> stranicu na serveru (već implementirano u backendu).
          </p>
        </div>
      )}
    </div>
  );
}