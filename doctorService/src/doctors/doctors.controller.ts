import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { DoctorService } from "./doctors.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";

@Controller()
export class DoctorGrpcController {
  private readonly logger = new Logger(DoctorGrpcController.name);

  constructor(private readonly doctorService: DoctorService) {}

  @GrpcMethod("DoctorService", "CreateDoctor")
  async createDoctor(data: CreateDoctorDto) {
    // console.log("=== RAW gRPC DATA ===", data);
    // console.log("full_name:", data.fullName);
    console.log("phone_number:", data.phoneNumber);
    return await this.doctorService.create(data);
  }

  @GrpcMethod("DoctorService", "GetDoctor")
  async getDoctor(data: { id: number }) {
    this.logger.log(`gRPC GetDoctor called: ${data.id}`);
    return await this.doctorService.findOne(data.id);
  }

  //yanig medo qoshdim
  @GrpcMethod("DoctorService", "GetDoctorByEmail")
  async getDoctorByEmail(data: { email: string }) {
    this.logger.log(`gRPC GetDoctorByEmail called: ${data.email}`);
    try {
      const doctor = await this.doctorService.findByEmail(data.email);
      return doctor;
    } catch (error) {
      return null;
    }
  }

  @GrpcMethod("DoctorService", "UpdateRefreshToken")
  async updateRefreshToken(data: { id: number; refreshToken: string }) {
    console.log("🔄 Updating refresh token for doctor:", data.id);
    return await this.doctorService.updateRefreshToken(
      data.id,
      data.refreshToken
    );
  }
  @GrpcMethod("DoctorService", "GetDoctorForAuth")
  async getDoctorForAuth(data: { id: number }) {
    return await this.doctorService.findOneForAuth(data.id);
  }

  @GrpcMethod("DoctorService", "ClearRefreshToken")
  async clearRefreshToken(data: { id: number }) {
    console.log("🗑️ Clearing refresh token for doctor:", data.id);
    return await this.doctorService.clearRefreshToken(data.id);
  }

  @GrpcMethod("DoctorService", "GetAllDoctors")
  async getAllDoctors() {
    this.logger.log("gRPC GetAllDoctors called");
    return { doctors: await this.doctorService.findAll() };
  }

  @GrpcMethod("DoctorService", "UpdateDoctor")
  async updateDoctor(data: UpdateDoctorDto & { id: number }) {
    this.logger.log(`gRPC UpdateDoctor called: ${data.id}`);

    const { id, ...updateData } = data;
    return await this.doctorService.update(id, updateData);
  }

  @GrpcMethod("DoctorService", "DeleteDoctor")
  async deleteDoctor(data: { id: number }) {
    this.logger.log(`gRPC DeleteDoctor called: ${data.id}`);
    await this.doctorService.remove(data.id);
    return { message: `Doctor with id ${data.id} deleted successfully` };
  }
}
