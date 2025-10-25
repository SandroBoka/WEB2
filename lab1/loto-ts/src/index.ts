import express from "express";
import morgan from "morgan";
import "dotenv/config";
import prisma from "./prisma.js";
import { adminRouter } from "./routes/admin.js";
import { oidc } from "./auth/oidc.js";
import { userRouter } from "./routes/user.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const app = express();

app.use(express.json());
app.use(oidc);
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, uptime: process.uptime() })
});

app.get("/session", (req, res) => {
    res.json({
        isAuthenticated: req.oidc?.isAuthenticated?.() ?? false,
        user: req.oidc?.user ?? null
    })
})

app.get("/db-health", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ db: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ db: "ERROR" });
    }
});

const clientDist = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDist));

app.get(
  /^\/(?!health$|db-health$|session$|status$|new-round$|close$|store-results$|tickets$|api\/).*/,

  (_req, res, next) => {
    if (res.headersSent) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  }
);

app.use(userRouter);
app.use(adminRouter);

// 404 Error handler
app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
});

app.use(
  (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === "UnauthorizedError" || err.code === "invalid_token" || err.code === "invalid_request") {
      return res.status(401).json({ error: "Unauthorized", detail: err.message });
    }
    return next(err);
  }
);

app.use(
    (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error(err);
        res.status(err.status || 500).json({ error: "Internal Server Error" });
    }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});