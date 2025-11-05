import { Request } from "express"
import { state } from "./state"

export type Role = "guest" | "user" | "admin"
export type CurrentUser = { username: string, role: Role }

export function getCurrentUser(req: Request): CurrentUser {
  const username = (req.cookies?.username as string) || "guest"

  let role: Role = "guest"
  if (state.bacEnabled) {
    const q = (req.query.role as string) || (req.cookies?.role as string)
    role = q === "admin" ? "admin" : (q === "user" ? "user" : "guest")
  } else {
    role = username === "admin" ? "admin" : (username === "TestUser" ? "user" : "guest")
  }

  return { username, role }
}
