import { PatientService } from "./patient.service";
import { PatientGrpcController } from "./patient.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "./entities/patient.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    ClientsModule.register([
      {
        name: "DOCTOR_SERVICE",
        transport: Transport.GRPC,
        options: {
          url: `localhost:${process.env.DOCTOR_SERVICE_PORT || 50051}`,
          package: "doctor",
          protoPath: join(__dirname, "../proto/doctor.proto"),
        },
      },
    ]),
  ],
  controllers: [PatientGrpcController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
