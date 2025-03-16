import axios from "axios";
import * as dotenv from "dotenv";
import * as fs from "fs";
import FormData from "form-data";

dotenv.config();

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;
const LIGHTHOUSE_UPLOAD_URL = "https://node.lighthouse.storage/api/v0/add";

export async function uploadToFilecoin(filePath: string): Promise<string> {
  const formData = new FormData();

  // Add the file to the form data
  const fileStream = fs.createReadStream(filePath);
  formData.append("file", fileStream, {
    filename: filePath.split("/").pop(),
  });

  try {
    const response = await axios.post(LIGHTHOUSE_UPLOAD_URL, formData, {
      headers: {
        Authorization: `Bearer ${LIGHTHOUSE_API_KEY}`,
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    if (response.status === 200) {
      return response.data.Hash; // Returns the IPFS CID
    } else {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error(
      "Error uploading file:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Example Usage
uploadToFilecoin("dataset.csv").then((cid) => {
  console.log(`File stored with CID: ${cid}`);
});
