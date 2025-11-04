import type { Request, Response, CookieOptions } from "express"
import { state } from "./state"
import type { Role } from "./user"

function isHttps(req: Request) {
  return req.secure || req.headers["x-forwarded-proto"] === "https"
}

export function setSessionCookies(req: Request, res: Response, username: string, role: Role) {
  const opts: CookieOptions = state.xssEnabled
    ? { httpOnly: false, sameSite: "lax" }
    : { httpOnly: true,  sameSite: "strict", secure: isHttps(req) }

  res.cookie("username", username, opts)
  res.cookie("role", role, opts)
}
