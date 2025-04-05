// server.js
import cors from "cors";
import express from "express";
// require("dotenv").config()
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// const API_KEY = process.env.CRUX_API_KEY;
const API_KEY = "AIzaSyAga2HliLqx32ID00tbdpY1vClPtLmH0s8";

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
            `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${API_KEY}`,
            {
              url: url,
              // formFactor: 'PHONE' // or 'DESKTOP', 'TABLET'
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
          return { url, data: null, error: error.message };
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Error fetching batch CrUX data:", error);
    res.status(500).json({ error: "Failed to fetch batch CrUX data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const response = {
  record: {
    key: {
      url: "https://google.com/",
    },
    metrics: {
      cumulative_layout_shift: {
        histogram: [
          {
            start: "0.00",
            end: "0.10",
            density: 0.9912,
          },
          {
            start: "0.10",
            end: "0.25",
            density: 0.0029,
          },
          {
            start: "0.25",
            density: 0.0059,
          },
        ],
        percentiles: {
          p75: "0.00",
        },
      },
      experimental_time_to_first_byte: {
        histogram: [
          {
            start: 0,
            end: 800,
            density: 0.4979,
          },
          {
            start: 800,
            end: 1800,
            density: 0.2958,
          },
          {
            start: 1800,
            density: 0.2062,
          },
        ],
        percentiles: {
          p75: 1578,
        },
      },
      first_contentful_paint: {
        histogram: [
          {
            start: 0,
            end: 1800,
            density: 0.5702,
          },
          {
            start: 1800,
            end: 3000,
            density: 0.2086,
          },
          {
            start: 3000,
            density: 0.2211,
          },
        ],
        percentiles: {
          p75: 2735,
        },
      },
      form_factors: {
        fractions: {
          phone: 0,
          tablet: 0,
          desktop: 1,
        },
      },
      interaction_to_next_paint: {
        histogram: [
          {
            start: 0,
            end: 200,
            density: 0.9513,
          },
          {
            start: 200,
            end: 500,
            density: 0.0221,
          },
          {
            start: 500,
            density: 0.0266,
          },
        ],
        percentiles: {
          p75: 32,
        },
      },
      largest_contentful_paint: {
        histogram: [
          {
            start: 0,
            end: 2500,
            density: 0.6581,
          },
          {
            start: 2500,
            end: 4000,
            density: 0.1758,
          },
          {
            start: 4000,
            density: 0.1661,
          },
        ],
        percentiles: {
          p75: 3133,
        },
      },
      navigation_types: {
        fractions: {
          reload: 0.1395,
          restore: 0,
          back_forward: 0,
          back_forward_cache: 0,
          prerender: 0,
          navigate: 0.8605,
          navigate_cache: 0,
        },
      },
    },
    collectionPeriod: {
      firstDate: {
        year: 2025,
        month: 3,
        day: 6,
      },
      lastDate: {
        year: 2025,
        month: 4,
        day: 2,
      },
    },
  },
  urlNormalizationDetails: {
    originalUrl: "https://google.com",
    normalizedUrl: "https://google.com/",
  },
};
