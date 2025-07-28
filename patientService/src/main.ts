import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./common/logger/winston.logger"; 

async function DoctorMain() {
  const winstonLogger = WinstonModule.createLogger(winstonConfig);
  Logger.overrideLogger(winstonLogger);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "patient",
        protoPath: join(__dirname, "../../proto/patient.proto"),
        url: `0.0.0.0:${process.env.PORT}`,
      },
    }
  );
  await app.listen();
  winstonLogger.log(
    "info",
    `Patient Service is listening on port ${process.env.PORT}`
  );
  console.log(`Patient Service is listening on port ${process.env.PORT}`);
}

DoctorMain();
