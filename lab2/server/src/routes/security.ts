import { Router } from "express"
import { state, log } from "../state"
import { getCurrentUser } from "../user"
import { setSessionCookies } from "../cookies"

export const securityRouter = Router()

securityRouter.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

securityRouter.get("/api/state", (req, res) => {
  const currentUser = getCurrentUser(req)
  res.json({
    xssEnabled: state.xssEnabled,
    bacEnabled: state.bacEnabled,
    messages: state.messages,
    logs: state.logs,
    currentUser
  })
})

securityRouter.post("/api/toggle", (req, res) => {
  const { xssEnabled, bacEnabled } = req.body ?? {}
  if (typeof xssEnabled === "boolean") state.xssEnabled = xssEnabled
  if (typeof bacEnabled === "boolean") state.bacEnabled = bacEnabled
  log(`Toggles -> XSS=${state.xssEnabled ? "ON" : "OFF"}, BAC=${state.bacEnabled ? "ON" : "OFF"}`)
  res.json({ ok: true, state: { xssEnabled: state.xssEnabled, bacEnabled: state.bacEnabled } })
})

function isLikelyXss(input: string): boolean {
  const s = input.toLowerCase();
  return /<script|onerror=|onload=|javascript:|=alert|<img|<svg|<iframe|<object|href\s*=\s*["']?\s*javascript:/.test(s);
}

securityRouter.post("/api/xss", (req, res) => {
  const msg = (req.body?.message ?? "").toString()
  if (!state.xssEnabled) {
    if (isLikelyXss(msg)) {
      log("Blocked XSS-like payload while XSS is OFF");
      return res.status(400).json({ ok: false, error: "XSS disabled; payload blocked" });
    }
  }

  state.messages.unshift(msg);
  state.messages = state.messages.slice(0, 12);
  log(`XSS input stored (vulnerable ON): ${msg}`);
  res.json({ ok: true });
})

securityRouter.post("/api/login", (req, res) => {
  const { username, password } = req.body ?? {}
  let ok = false, role: "guest" | "user" | "admin" = "guest"

  if (username === "admin" && password === "admin123") { ok = true; role = "admin" }
  else if (username === "alice" && password === "alice123") { ok = true; role = "user" }

  if (!ok) {
    log(`Login failed for ${username}`)
    return res.status(401).json({ error: "Bad credentials" })
  }
  setSessionCookies(req, res, username, role)
  log(`Login ${username} (${role})`)
  res.json({ ok: true })
})

securityRouter.post("/api/logout", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("role")
  log("Logout");
  res.json({ ok: true });
});

securityRouter.get("/api/admin", (req, res) => {
  const currentUser = getCurrentUser(req)
  const allowed = state.bacEnabled
    ? (currentUser.role === "admin")                   // RANJIVO: role iz klijenta
    : ((req.cookies?.username as string) === "admin")  // SIGURNIJE: provjera stvarnog identiteta
  if (!allowed) return res.status(403).json({ error: "Forbidden" })

  res.json({
    secret: "very-secret-demo",
    message: `Welcome ${currentUser.username}`
  })
})
