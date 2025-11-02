import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});