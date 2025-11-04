import { Request } from "express"
import { state } from "./state"

export type Role = "guest" | "user" | "admin"
export type CurrentUser = { username: string, role: Role }

export function getCurrentUser(req: Request): CurrentUser {
  const username = (req.cookies?.username as string) || 'guest'

  let role: Role = "guest"
  if (state.bacEnabled) {
    // LOSE: vjerujemo klijentu (query string ili cookie)
    const q = (req.query.role as string) || (req.cookies?.role as string)
    role = q === "admin" ? "admin" : (q === "user" ? "user" : "guest")
  } else {
    // DOBRO: role zakljucujemo na serveru, ignoriramo klijenta
    role = username === "admin" ? "admin" : (username === "alice" ? "user" : "guest")
  }

  return { username, role }
}
