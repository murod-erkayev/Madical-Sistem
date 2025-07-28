import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { VisitsModule } from "./visits/visits.module";
import { NotesModule } from "./notes/notes.module";
import { AdminModule } from "./admin/admin.module";
import { AnnouncementsModule } from "./announcements/announcements.module";
import { NewsModule } from "./news/news.module";
import { DoctorsModule } from "./doctors/doctors.module";
import { PatientsModule } from "./patients/patients.module";
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "DOCTOR_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "doctor",
          protoPath: join(__dirname, "proto/doctor.proto"),
          url: "localhost:50051",
        },
      },
      {
        name: "PATIENT_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "patient",
          protoPath: join(__dirname, "proto/patient.proto"),
          url: "localhost:50052",
        },
      },
      {
        name: "ADMIN_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "admin",
          protoPath: join(__dirname, "proto/admin.proto"),
          url: "localhost:50053",
        },
      },
    ]),
    DoctorsModule,
    PatientsModule,
    VisitsModule,
    NotesModule,
    AdminModule,
    AnnouncementsModule,
    NewsModule,
    AuthModule,
  ],
})
export class AppModule {}
