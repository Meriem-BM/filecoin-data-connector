import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { uploadToFilecoin } from "./storage/filecoinClient";
import { storeMetadata } from "./metadata/metadataManager";
import { cacheDataset, getCachedDataset } from "./caching/cacheManager";

dotenv.config();

const app: Application = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/upload", async (req: Request, res: Response): Promise<any> => {
  try {
    const { filePath, datasetName, format, size } = req.body;

    if (!filePath || !datasetName || !format || !size) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Upload file to Filecoin via Lighthouse
    const cid: string = await uploadToFilecoin(filePath);

    // Store metadata in the database
    storeMetadata(datasetName, cid, format, size);

    // Cache dataset info
    await cacheDataset(cid, JSON.stringify({ datasetName, format, size }));

    return res.json({ message: "File uploaded successfully", cid });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get(
  "/dataset/:cid",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { cid } = req.params;

      // Check cache first
      const cachedData = await getCachedDataset(cid);
      if (cachedData) {
        return res.json({ fromCache: true, data: JSON.parse(cachedData) });
      }

      return res.json({
        fromCache: false,
        message: "Fetching from DB (Not implemented)",
      });
    } catch (error) {
      console.error("Retrieval Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Health check endpoint
app.get("/", (req: Request, res: Response): any => {
  return res.send("Filecoin Data Connector API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
