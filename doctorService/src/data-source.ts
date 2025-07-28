import { DataSource } from "typeorm";
import { Doctor } from "./doctors/entities/doctor.entity";
import * as dotenv from "dotenv";
dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432"),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [Doctor],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: true,
});
