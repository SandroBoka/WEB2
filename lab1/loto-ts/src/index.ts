import express from "express";
import morgan from "morgan";
import "dotenv/config";
import prisma from "./prisma.js";

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
// Heatlh check
app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, uptime: process.uptime() })
});

// Root
app.get("/", (_req, res) => {
    res.send("Hello World 👋");
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

// 404 Error handler
app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
});

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