// src/news/news.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY || "AccessSecretKey",
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME || "15h" },
    }),
    ClientsModule.register([
      {
        name: "ADMIN_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "admin",
          protoPath: join(__dirname, "../proto/admin.proto"),
          url: "localhost:50053",
        },
      },
    ]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
