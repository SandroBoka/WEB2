import express from "express";
import morgan from "morgan";
import "dotenv/config";
import prisma from "./prisma.js";
import { adminRouter } from "./routes/admin.js";
import { oidc } from "./auth/oidc.js";
 
const app = express();

// Middleware
app.use(express.json());
app.use(oidc);
app.use(morgan("dev"));

// Routes
// Heatlh check
app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, uptime: process.uptime() })
});

// DB health check
app.get("/db-health", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ db: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ db: "ERROR" });
    }
});

app.get("/", (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.send(`
            <h2>Hello, ${req.oidc.user?.name || req.oidc.user?.email}</h2>
            <p><a href="/logout">Logout</p>
            `);
    } else {
        res.send(`
            <h3>Hello, login to continue.</h3>
            <a href="/login">Login</a>
            `);
    }
});


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