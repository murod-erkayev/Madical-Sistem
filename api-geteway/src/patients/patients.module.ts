import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { PatientsController } from "./patients.controller";
import { PatientsService } from "./patients.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      global: true, // ← Bu muhim!
      secret: process.env.ACCESS_TOKEN_KEY || "AccessSecretKey",
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME || "15h" },
    }),
    ClientsModule.register([
      {
        name: "PATIENT_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "patient",
          protoPath: join(__dirname, "./../proto/patient.proto"),
          url: "localhost:50052",
        },
      },
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
