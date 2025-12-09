import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());               // allow WordPress domain
app.use(express.json());

function isAuthorized(req) {
  return true;
}

app.get("/api/scribe-token", async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

  try {
    const r = await fetch("https://api.elevenlabs.io/v1/single-use-token/realtime_scribe", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      }
    });

    const data = await r.json();
    res.json(data);  // { token: "..." }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "token_error", details: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Backend running on " + PORT));
