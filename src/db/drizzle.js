import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

const client = new pg.Client({
  connectionString: process.env.POSTGRES_URL
});

await client.connect();

export const db = drizzle(client, { schema });