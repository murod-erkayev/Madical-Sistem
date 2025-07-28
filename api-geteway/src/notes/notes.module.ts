// src/notes/notes.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";

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
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
