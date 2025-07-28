import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Patient } from "./patient/entities/patient.entity";
import { Visit } from "./visit/entities/visit.entity";
import { Note } from "./note/entities/note.entity";
dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432"),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [Patient, Visit,Note],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: true,
});
