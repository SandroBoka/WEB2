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
  if (!r.ok) throw new Error("Failed to fetch session");
  return r.json();
}

export async function getStatus(): Promise<StatusResponse> {
  const r = await fetch("/status", { credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch status");
  return r.json();
}

export async function submitTicket(
  documentId: string,
  numbersInput: string
): Promise<{ blob: Blob; url: string | null }> {
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
      throw { error: data?.error ?? "Wrong data", details: data?.details };
    }
    throw new Error(await r.text());
  }

  const url =
    r.headers.get("content-location") ||
    r.headers.get("x-ticket-url");

  const blob = await r.blob();
  return { blob, url };
}

export function parseNumbers(input: string): number[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s));
}

export function validateID(documentId: string): string[] {
  const errors: string[] = [];

  if (documentId.length < 1) errors.push("Document ID is required");
  if (documentId.length > 20) errors.push("Document ID can have at most 20 characters");
  if (!/^\d+$/.test(documentId)) errors.push("Document ID must contain digits only");

  return errors;
}

export function validateTicketNumbers(numbersInput: string): string[] {
  const errors: string[] = [];

  const arr = parseNumbers(numbersInput);
  if (arr.length < 6 || arr.length > 10) errors.push("Enter between 6 and 10 numbers");
  if (arr.some((n) => !Number.isInteger(n))) errors.push("All numbers must be integers");
  if (arr.some((n) => n < 1 || n > 45)) errors.push("Numbers must be between 1 and 45");
  if (new Set(arr).size !== arr.length) errors.push("All numbers must be unique");

  return errors;
}