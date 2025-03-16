import * as fs from "fs";

export function splitFile(
  filePath: string,
  chunkSize: number = 10 * 1024 * 1024
): string[] {
  const fileSize = fs.statSync(filePath).size;
  const chunks: string[] = [];
  let index = 0;
  let position = 0;

  while (position < fileSize) {
    const chunkName = `${filePath}.part${index}`;
    const buffer = Buffer.alloc(Math.min(chunkSize, fileSize - position));

    const fileDescriptor = fs.openSync(filePath, "r");
    fs.readSync(fileDescriptor, buffer, 0, buffer.length, position);
    fs.writeFileSync(chunkName, buffer);
    fs.closeSync(fileDescriptor);

    chunks.push(chunkName);
    position += chunkSize;
    index++;
  }

  return chunks;
}

// Example Usage
const chunks = splitFile("large_dataset.csv");
console.log(`Split into ${chunks.length} chunks.`);
