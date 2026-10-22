import mysql from "mysql2";
import * as schema from "@/drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";

const pool = mysql.createPool({
   uri: process.env.DATABASE_URL!,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
});

export const db = (drizzle as any)({ client: pool, schema, mode: "default" });