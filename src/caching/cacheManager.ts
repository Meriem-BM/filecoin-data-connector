import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export async function cacheDataset(cid: string, data: string) {
  await redisClient.connect();
  await redisClient.set(cid, data);
  await redisClient.disconnect();
}

export async function getCachedDataset(cid: string): Promise<string | null> {
  await redisClient.connect();
  const data = await redisClient.get(cid);
  await redisClient.disconnect();
  return data;
}

// Example Usage
(async () => {
  await cacheDataset("Qm123abc", "Dataset contents here...");
  const data = await getCachedDataset("Qm123abc");
  console.log(data);
})();
