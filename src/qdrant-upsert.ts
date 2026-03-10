import { QdrantVector } from "@mastra/qdrant";
import 'dotenv/config'

const INDEX_NAME = "qdrant-upsert-error-reproduction";

try {
    const qdrantConnection = new QdrantVector({
        id: "qdrant-vector",
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
    });

    await qdrantConnection.createIndex({
        indexName: INDEX_NAME,
        dimension: 4,
    });

    const result = await qdrantConnection.upsert({
        indexName: INDEX_NAME,
        vectors: [
            [0.1, 0.2, 0.3, 0.4],
            [0.5, 0.6, 0.7, 0.8],
        ],
        ids: ['100', '200'], // Line that triggers the error. Is string type as required by Mastra TypeScript definitions
    });

    console.log("Upsert result: ", result);
} catch (error) {
    console.error("Error upserting vectors.");
    console.error(error);
}
