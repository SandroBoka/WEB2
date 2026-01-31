import express from "express";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// heatlh check
app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

app.post("/api/recognize", upload.single("file"), async (req, res) => {
    try {
        if(!req.file) return res.status(400).json({ error: "No file" });

        res.json({
            status: "success",
            result: {
                title: "Test song",
                artist: "Offline Sync",
                receivedBytes: req.file.size,
                mimeType: req.file.mimetype
            }
        });
    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running at Port ${port}`);
})