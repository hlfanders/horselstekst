import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
const upload = multer();

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;

app.post("/stt", upload.single("audio"), async (req, res) => {
    try {
        const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
            method: "POST",
            headers: {
                "xi-api-key": ELEVEN_API_KEY,
                "Content-Type": "audio/webm"
            },
            body: req.file.buffer
        });

        const result = await response.json();
        res.json({ text: result.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));


