import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,  // Automatically creates tables (set to false in production)
    logging: false,
    ssl: {
        rejectUnauthorized: false, // Required for AWS RDS connections
    },
    entities: ["src/models/*.ts"],
});

export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Connected to AWS PostgreSQL");
    } catch (error) {
        console.error("PostgreSQL Connection Error:", error);
        process.exit(1);
    }
};
