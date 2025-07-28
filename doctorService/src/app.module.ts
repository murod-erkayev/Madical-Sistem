import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./doctors/entities/doctor.entity";
import { ConfigModule } from "@nestjs/config";
import { DoctorsModule } from "./doctors/doctors.module";
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      // dropSchema:true
    }),
    DoctorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
