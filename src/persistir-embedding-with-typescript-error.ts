import { QdrantVector } from "@mastra/qdrant";
import 'dotenv/config'

const INDEX_NAME = "laws";
const DIMENSION = 4;

function createConnection(): QdrantVector {
    return new QdrantVector({
        id: "qdrant-vector",
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
    });
};

async function createCollection(): Promise<void> {
    const qdrantConnection = createConnection();

    await qdrantConnection.createIndex({
        indexName: INDEX_NAME,
        dimension: DIMENSION,
    });
};

async function upsert(vectors: number[][], ids: number[]): Promise<string[]> {
    if (vectors.length !== ids.length) {
        throw new Error("Vectors and IDs must have the same length");
    }

    const qdrantConnection = createConnection();

    return await qdrantConnection.upsert({
        indexName: INDEX_NAME,
        vectors,
        ids,
    });
};

const vectors: number[][] = [
    [0.1, 0.2, 0.3, 0.4],
    [0.5, 0.6, 0.7, 0.8],
];

const ids: number[] = [100, 200];

try {
    await createCollection();
    const result = await upsert(vectors, ids);

    console.log("Upsert result: ", result);
} catch (error) {
    console.error("Error upserting vectors.");
    console.error(error);
}
