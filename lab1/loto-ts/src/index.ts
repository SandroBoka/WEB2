import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { error } from "console";

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

// 404 Error handler
app.use((_req, res) => {
    res.status(404).json({ error: "Not Found"});
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