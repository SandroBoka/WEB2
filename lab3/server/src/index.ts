import path from "path";
import express from "express";
import helmet from "helmet";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }))

app.get("/api/health", (_req, res) => {
    res.json({
        ok: true,
        service: "lab3-server",
        time: new Date().toISOString()
    });
});

if (process.env.NODE_ENV === "production") {
    const clientDist = path.resolve(__dirname, "../../client/dist");
    app.use(express.static(clientDist));

    app.get(/^\/(?!api\/).*/, (_req, res) => {
        res.sendFile(path.join(clientDist, "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
});
