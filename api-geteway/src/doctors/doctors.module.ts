import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { DoctorsController } from "./doctors.controller";
import { DoctorsService } from "./doctors.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY || "AccessSecretKey",
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME || "15h" },
    }),
    ClientsModule.register([
      {
        name: "DOCTOR_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "doctor",
          protoPath: join(__dirname, "./../proto/doctor.proto"),
          url: "localhost:50051", // Docotr serivce =>0051
        },
      },
    ]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
