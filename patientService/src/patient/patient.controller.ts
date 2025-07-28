import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { PatientService } from "./patient.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";

@Controller() // ✅ FIXED: "patients" ni olib tashlang!
export class PatientGrpcController {
  constructor(private readonly patientService: PatientService) {}

  @GrpcMethod("PatientService", "CreatePatient")
  async createPatient(data: CreatePatientDto) {
    console.log("🔥 gRPC CreatePatient:", data);
    return this.patientService.create(data);
  }

  @GrpcMethod("PatientService", "GetAllPatients")
  async getAllPatients() {
    console.log("🔥 gRPC GetAllPatients called!");
    const result = await this.patientService.findAllPPP();
    console.log("🔥 Found", result.length, "patients");
    return { patients: result };
  }

  @GrpcMethod("PatientService", "GetPatientById")
  async getPatientById(data: { id: number }) {
    console.log("🔥 gRPC GetPatientById:", data);
    return this.patientService.findOne(data.id);
  }

  @GrpcMethod("PatientService", "UpdatePatient")
  async updatePatient(data: UpdatePatientDto & { id: number }) {
    console.log("🔥 gRPC UpdatePatient:", data);
    const { id, ...updateData } = data;
    return this.patientService.update(id, updateData);
  }

  @GrpcMethod("PatientService", "DeletePatient")
  async deletePatient(data: { id: number }) {
    console.log("🔥 gRPC DeletePatient:", data);
    await this.patientService.remove(data.id);
    return { message: "Patient deleted successfully" };
  }
}
