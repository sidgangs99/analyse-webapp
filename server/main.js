// server.js
import cors from "cors";
import express from "express";
// require("dotenv").config()
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const CRUX_API_KEY = process.env.CRUX_API_KEY;
const CRUX_API = "https://chromeuxreport.googleapis.com/v1/records";

app.post("/api/crux/batch", async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "URLs array is required" });
    }

    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await axios.post(
            `${CRUX_API}:queryRecord?key=${CRUX_API_KEY}`,
            {
              url: url,
            }
          );

          // Simplify the response if needed
          const simplified = {
            record: {
              key: response.data.record.key,
              metrics: response.data.record.metrics,
              collectionPeriod: response.data.record.collectionPeriod,
            },
            urlNormalizationDetails: response.data.urlNormalizationDetails,
          };

          return { url, data: simplified, error: null };
        } catch (error) {
          throw new Error("URL not found: " + url);
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Error fetching batch CrUX data:", error);
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
