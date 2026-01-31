import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";
import webpush from "web-push";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: "1mb" }));

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

const subscriptions = new Set();

// heatlh check
app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

app.get("/api/vapidPublicKey", (req, res) => {
    if (!vapidPublicKey) return res.status(500).json({ error: "Missing VAPID_PUBLIC_KEY" });
    res.json({ key: vapidPublicKey });
});

app.post("/api/saveSubscription", (req, res) => {
    const sub = req.body;
    if (!sub?.endpoint) return res.status(400).json({ error: "Invalid subscription" });

    subscriptions.add(JSON.stringify(sub));
    res.json({ ok: true });
});

app.post("/api/notifyRecognized", async (req, res) => {
    const { title, body, image } = req.body || {};
    await sendPushToAll({
        title: title || "Song recognized 🎵",
        body: body || "New recognition result.",
        image: image || null
    });
    res.json({ ok: true });
});

app.post("/api/recognize", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file" });

        const token = process.env.AUDD_API_TOKEN;
        if (!token) return res.status(500).json({ error: "Missing AUDD_API_TOKEN" });

        const form = new FormData();
        form.append("api_token", token);
        form.append("return", "apple_music,spotify,deezer");
        form.append("file", req.file.buffer, {
            filename: req.file.originalname || "sample.webm",
            contentType: req.file.mimetype || "application/octet-stream"
        });

        const auddRes = await fetch("https://api.audd.io/", {
            method: "POST",
            body: form
        });

        const data = await auddRes.json()

        if (!data || data.status !== "success") {
            return res.status(200).json({
                status: "not_found",
                result: null,
                raw: data
            });
        }

        const result = data.result

        return res.json({
            status: "recognized",
            result: {
                title: result?.title ?? null,
                artist: result?.artist ?? null,
                album: result?.album ?? null,
                image: getBestAlbumImage(result),
                release_date: result?.release_date ?? null,
                song_link: result?.song_link ?? null,
                spotify: result?.spotify ?? null,
                apple_music: result?.apple_music ?? null,
                deezer: result?.deezer ?? null,
            },
            raw: data
        });
    } catch {
        return res.status(500).json({ error: "ServerError" })
    }
})

function getBestAlbumImage(result) {
    if (!result) return null;

    const spotifyImage =
        result?.spotify?.album?.images?.[0]?.url;

    if (spotifyImage) return spotifyImage;

    const appleTemplate =
        result?.apple_music?.artwork?.url;

    if (appleTemplate) {
        return appleTemplate.replace("{w}x{h}", "512x512");
    }

    const deezerImage =
        result?.deezer?.album?.cover_big ||
        result?.deezer?.album?.cover;

    if (deezerImage) return deezerImage;

    return null;
}

async function sendPushToAll(payloadObj) {
    if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) return;

    const payload = JSON.stringify(payloadObj);

    for (const subStr of subscriptions) {
        const sub = JSON.parse(subStr);
        try {
            await webpush.sendNotification(sub, payload);
        } catch {
            subscriptions.delete(subStr);
        }
    }
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running at Port ${port}`);
})
