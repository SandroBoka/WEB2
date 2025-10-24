export type SessionResponse = {
  isAuthenticated: boolean;
  user: null | {
    name?: string;
    email?: string;
    picture?: string;
    [k: string]: unknown;
  };
};

export type StatusResponse = {
  round: null | {
    id: number;
    active: boolean;
    ticketCount: number;
    drawNumbers: number[] | null;
  };
};

export async function getSession(): Promise<SessionResponse> {
  const r = await fetch("/session", { credentials: "include" });
  if (!r.ok) throw new Error("Ne mogu dohvatiti session");
  return r.json();
}

export async function getStatus(): Promise<StatusResponse> {
  const r = await fetch("/status", { credentials: "include" });
  if (!r.ok) throw new Error("Ne mogu dohvatiti status");
  return r.json();
}

export async function submitTicket(documentId: string, numbersInput: string): Promise<Blob> {
  const r = await fetch("/tickets", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId, numbers: numbersInput }),
  });
  if (!r.ok) {
    const ct = r.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await r.json();
      throw new Error(data?.error ?? "Greška pri spremanju listića");
    }
    throw new Error(await r.text());
  }
  return r.blob(); // image/png (QR)
}

// Klijentska validacija – jednaka logici na serveru
export function parseNumbers(input: string): number[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s));
}

export function validateTicket(documentId: string, numbersInput: string): string[] {
  const errors: string[] = [];
  if (documentId.length < 1) errors.push("Broj dokumenta je obavezan");
  if (documentId.length > 20) errors.push("Broj dokumenta smije imati najviše 20 znakova");

  const arr = parseNumbers(numbersInput);
  if (arr.length < 6 || arr.length > 10) errors.push("Unesi između 6 i 10 brojeva");
  if (arr.some((n) => !Number.isInteger(n))) errors.push("Svi brojevi moraju biti cijeli");
  if (arr.some((n) => n < 1 || n > 45)) errors.push("Svi brojevi moraju biti u rasponu 1–45");
  if (new Set(arr).size !== arr.length) errors.push("Svi brojevi moraju biti jedinstveni");
  return errors;
}
