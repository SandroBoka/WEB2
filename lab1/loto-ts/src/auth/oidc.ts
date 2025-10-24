import { auth } from "express-openid-connect";

export const oidc = auth({
    authRequired: false,
    auth0Logout: true,
    idpLogout: true,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.AUTH0_SECRET,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
      authorizationParams: {
    response_type: "code",
    scope: "openid profile email"
  }
});

export function requireLogin(req: any, res: any, next: any) {
    if (!req.oidc?.isAuthenticated()) {
        return res.status(401).send("Login needed.");
    }

    return next();
}