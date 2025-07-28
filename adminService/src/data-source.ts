import {  DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { News } from "./news/entities/news.entity";
import { Announcement } from "./announcement/entities/announcement.entity";
import { Admin } from "./admin/entities/admin.entity";
dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432"),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [Admin, News, Announcement],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: true,
});
