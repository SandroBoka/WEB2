import { useState } from "react";
import { submitTicket, validateTicket } from "../api";

export default function TicketForm({ uplateAktivne }: { uplateAktivne: boolean }) {
  const [documentId, setDocumentId] = useState("");
  const [numbers, setNumbers] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  if (!uplateAktivne) {
    return <div>Ticket payments are not currently active</div>;
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
      const { blob, url } = await submitTicket(documentId, numbers);
      const obj = URL.createObjectURL(blob);
      setQrUrl(obj);
      setTicketUrl(url || null);
      setServerMsg("Ticket successfully purchased. Scan or download the QR code to save it.");
    } catch (err: any) {
      setServerMsg(err.message || "Something went wrong.");
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
    <>
      <h3>Buy ticket</h3>

      {}
      <form onSubmit={onSubmit} className="stack w-fit">
        <label className="stack">
          ID or passport number
          <input
            type="text"
            placeholder="e.g. 0045689123"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            required
            maxLength={20}
            size={24}
            style={{ width: "24ch" }}
          />
        </label>

        <label className="stack">
          Numbers (6 to 10 numbers) from 1 to 45, seperated with a comma (",")
          <input
            type="text"
            placeholder="e.g. 3, 7, 12, 18, 33, 44"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            required
            size={36}
            style={{ width: "36ch" }}
          />
        </label>

        {errors.length > 0 && (
          <div role="alert">
            <ul>{errors.map((er, i) => <li key={i}>{er}</li>)}</ul>
          </div>
        )}

        <button type="submit" aria-busy={submitting}>
          {submitting ? "Sending" : "Buy ticket"}
        </button>
      </form>

      {serverMsg && <p style={{ marginTop: 12 }}>{serverMsg}</p>}

      {qrUrl && (
        <div className="stack" style={{ marginTop: 16 }}>
          <img src={qrUrl} alt="Ticket QR code" width={240} height={240} />
          <div className="row" style={{ gap: 8 }}>
            <button onClick={onDownload}>Download QR code</button>
            {ticketUrl && (
              <a role="button" href={ticketUrl} target="_blank" rel="noopener noreferrer">
                Open ticket
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
