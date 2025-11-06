import type { AppState, TogglePayload } from "./types";

async function json<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }

    return res.json() as Promise<T>
}

export async function getState(): Promise<AppState> {
    const res = await fetch("/api/state", { credentials: "include" });
    return json<AppState>(res);
}

export async function postToggle(payload: TogglePayload): Promise<void> {
    const res = await fetch("/api/toggle", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    await json<{ ok: boolean }>(res);
}

export async function postXss(message: string): Promise<{ saved: boolean; reason?: string }> {
    const res = await fetch("/api/xss", {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });

    const text = await res.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { }

    if (res.ok) return { saved: true };
    return { saved: false, reason: data.reason || data.error || `HTTP ${res.status} ${text}` };
}

export async function login(username: string, password: string): Promise<void> {
    const res = await fetch("/api/login", {
        method: "POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    await json<{ ok: boolean }>(res);
}

export async function logout(): Promise<void> {
    const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
    });
    await json<{ ok: boolean }>(res);
}

export async function getAdmin(): Promise<any> {
    const res = await fetch("/api/admin", { credentials: "include" });
    return json<any>(res);
}

export async function getFakeAdmin(): Promise<any> {
    const res = await fetch("/api/admin?role=admin", { credentials: "include" });
    return json<any>(res);
}

export function buildAdminUrl(): string {
    const base = window.location.origin;
    return `${base}/api/admin`;
}