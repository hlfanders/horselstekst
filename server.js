import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Token issuer is running"));

app.get("/api/scribe-token", async (req, res) => {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/single-use-token/realtime_scribe", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },
      // optionally add a short body to scope token if docs support scoping
      // body: JSON.stringify({ /* optional */ })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("ElevenLabs token create failed:", response.status, text);
      return res.status(502).json({ error: "eleven_token_failed", detail: text });
    }

    const data = await response.json();
    // data contains { token: "..." }
    return res.json({ token: data.token });
  } catch (err) {
    console.error("Token endpoint error:", err);
    return res.status(500).json({ error: "server_error", detail: String(err) });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

