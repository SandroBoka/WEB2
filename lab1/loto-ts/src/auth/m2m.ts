import { expressjwt as jwt } from "express-jwt";
import jwks from "jwks-rsa";
import { env } from "../env.js";

export const requireM2M = jwt({
    secret: jwks.expressJwtSecret({
        jwksUri: `${env.M2M_ISSUER}.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
    }) as any,
    audience: env.M2M_AUDIENCE,
    algorithms: ["RS256"]
});

/**
 * 
 * Provjera ima li token trazeni scope
 */
export function requireScope(required: string) {
  return (req: any, res: any, next: any) => {
    // permissions array (RBAC "Add Permissions in the Access Token")
    if (Array.isArray(req.auth?.permissions)) {
      if (req.auth.permissions.includes(required)) return next();
      return res.status(403).json({ error: "Forbidden", detail: "Missing permission in permissions[]" });
    }

    // scope kao string
    if (typeof req.auth?.scope === "string") {
      const list = req.auth.scope.split(" ").filter(Boolean);
      if (list.includes(required)) return next();
      return res.status(403).json({ error: "Forbidden", detail: "Missing scope in scope string" });
    }

    // fallback
    return res.status(403).json({ error: "Forbidden", detail: "No permissions/scope claim" });
  };
}