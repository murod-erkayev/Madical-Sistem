// src/visits/visits.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { VisitsController } from "./visits.controller";
import { VisitsService } from "./visits.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "PATIENT_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "patient",
          protoPath: join(__dirname, "../proto/patient.proto"),
          url: "localhost:50052",
        },
      },
    ]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
