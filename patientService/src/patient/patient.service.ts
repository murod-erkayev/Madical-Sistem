import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "./entities/patient.entity";
import { Any, Not, Repository } from "typeorm";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { ClientGrpc, RpcException } from "@nestjs/microservices";
import { Observable, firstValueFrom, timeout } from "rxjs";

interface DoctorService {
  GetDoctor(data: { id: number }): Observable<any>;
}

@Injectable()
export class PatientService implements OnModuleInit {
  private readonly logger = new Logger(PatientService.name);

  private doctorService: DoctorService;

  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @Inject("DOCTOR_SERVICE")
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.doctorService = this.client.getService<DoctorService>("DoctorService");
  }

  async create(createPatientDto: CreatePatientDto) {
    try {
      const { email, phoneNumber, doctorId } = createPatientDto;
      const checkEmail = await this.patientRepo.findOne({ where: { email } });
      if (checkEmail) {
        throw new RpcException({ message: "Email already exists" });
      }
      const checkPhone = await this.patientRepo.findOne({
        where: { phoneNumber },
      });
      if (checkPhone) {
        throw new RpcException({ message: "Phone number already exists" });
      }
      const doctor = await firstValueFrom(
        this.doctorService.GetDoctor({ id: doctorId }).pipe(timeout(5000))
      );
      if (!doctor?.id) {
        throw new RpcException({ message: "Doctor not found" });
      }
      const patient = this.patientRepo.create(createPatientDto);
      const saved = await this.patientRepo.save(patient);
      return this.toResponseDto(saved);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      if (error.code === 2) {
        throw new RpcException({ message: "Doctor not found" });
      }
      if (error.code === 5) {
        throw new RpcException({ message: "Doctor not found" });
      }
      if (error.name === "TimeoutError") {
        throw new RpcException({ message: "Doctor service timeout" });
      }
      if (error.code === "23505") {
        if (error.detail?.includes("email")) {
          throw new RpcException({ message: "Email already exists" });
        }
        if (error.detail?.includes("phone_number")) {
          throw new RpcException({ message: "Phone number already exists" });
        }
      }
      throw new RpcException({ message: "Failed to create patient" });
    }
  }

  // PatientService da GET ALL ni sodda qiling:
  async findAllPPP() {
    const patients = await this.patientRepo.find();
    return patients
  }

  async findOne(id: number) {
    try {
      const patient = await this.patientRepo.findOne({where:{ id }});
      if (!patient) {
        throw new RpcException({ message: "Patient not found" });
      }
      const result = await this.toResponseDto(patient);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async update(id: number, updatePatientDto: UpdatePatientDto) {
    try {
      console.log(updatePatientDto);
      const { email, phoneNumber, doctorId } = updatePatientDto;
      const exists = await this.patientRepo.findOne({ where: { id } });
      if (!exists) {
        throw new RpcException({ message: "Patient not found " });
      }
      const doctor = await firstValueFrom(
        this.doctorService.GetDoctor({ id: doctorId! }).pipe(timeout(5000))
      );
      if (!doctor?.id) {
        throw new RpcException({ message: "Doctor not found" });
      }
      if (email && email !== exists.email) {
        const existsEmail = await this.patientRepo.findOne({
          where: { email, id: Not(id) },
        });
        if (existsEmail) {
          throw new RpcException("Email already exists");
        }
      }
      if (phoneNumber && phoneNumber !== exists.phoneNumber) {
        const existsPhoneNumber = await this.patientRepo.findOne({
          where: { phoneNumber, id: Not(id) },
        });
        if (existsPhoneNumber) {
          throw new RpcException("Phone number already exists");
        }
      }
      await this.patientRepo.update(id, updatePatientDto);
      const updated = await this.patientRepo.findOne({ where: { id } });
      return this.toResponseDto(updated!);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      if (error.code === 2) {
        throw new RpcException({ message: "Doctor not found" });
      }
      if (error.code === 5) {
        throw new RpcException({ message: "Doctor not found" });
      }
      if (error.name === "TimeoutError") {
        throw new RpcException({ message: "Doctor service timeout" });
      }
      if (error.code === "23505") {
        if (error.detail.includes("email")) {
          throw new RpcException("Email already exists");
        }
        if (error.detail.includes("phone_number")) {
          throw new RpcException("Phone number already exists");
        }
      }
      throw new RpcException("Failed to create patient");
    }
  }
  async remove(id: number) {
    const patientRemove = await this.patientRepo.findOne({ where: { id } });
    if (!patientRemove) {
      throw new NotFoundException({
        message: "Patient not found for deletion",
      });
    }
    await this.patientRepo.remove(patientRemove);
    return { message: `Patient successfully removed ${id}` };
  }
  private async toResponseDto(patient: Patient) {
    let doctor:any = null;
    if (patient.doctorId) {
      try {
        doctor = await firstValueFrom(
          this.doctorService.GetDoctor({ id: patient.doctorId })
        );
      } catch (error) {
        doctor = { message: "Doctor service unavailable" };
      }
    }
    return {
      id: patient.id,
      fullName: patient.fullName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      address: patient.address,
      doctorId: patient.doctorId,
      doctor,
    };
  }
}
