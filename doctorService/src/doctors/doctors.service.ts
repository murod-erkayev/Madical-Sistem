import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Doctor } from "./entities/doctor.entity";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import * as bcrypt from "bcrypt";
import { RpcException } from "@nestjs/microservices";
import { throwError } from "rxjs";
@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>
  ) {}
  async create(createDoctorDto: CreateDoctorDto) {
    try {
      const { password, email, phoneNumber } = createDoctorDto;
      const checkEmail = await this.doctorRepository.findOne({
        where: { email },
      });
      if (checkEmail) {
        throw new RpcException("Email already exists");
      }
      const checkPhone = await this.doctorRepository.findOne({
        where: { phoneNumber },
      });
      if (checkPhone) {
        throw new RpcException("Phone number already exists");
      }
      const passworrdHashed = await bcrypt.hash(password, 7);
      const doctor = this.doctorRepository.create({
        ...createDoctorDto,
        password: passworrdHashed,
      });
      const saved = await this.doctorRepository.save(doctor);
      return this.toResponseDto(saved);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      if (error.code === "23505") {
        if (error.detail.includes("email")) {
          throw new RpcException("Email already exists");
        }
        if (error.detail.includes("phone_number")) {
          throw new RpcException("Phone number already exists");
        }
      }
      throw new RpcException("Failed to create doctor");
    }
  }
  async findOne(id: number) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) {
        throw new RpcException("Doctor not found");
      }
      return this.toResponseDto(doctor);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException("Failed to create doctor");
    }
  }
  async findAll() {
    const doctors = await this.doctorRepository.find();
    return doctors.map((doctor) => this.toResponseDto(doctor));
  }
  async update(id: number, dto: UpdateDoctorDto) {
    try {
      const { password, email, phoneNumber } = dto;
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) {
        throw new RpcException("Doctor not found");
      }
      if (phoneNumber && phoneNumber !== doctor.phoneNumber) {
        const checkPhone = await this.doctorRepository.findOne({
          where: { phoneNumber, id: Not(id) },
        });
        if (checkPhone) {
          throw new RpcException("Phone number already exists");
        }
      }
      if (email && email !== doctor.email) {
        const checkEmail = await this.doctorRepository.findOne({
          where: { email, id: Not(id) },
        });
        if (checkEmail) {
          throw new RpcException("Email already exists");
        }
      }

      if (password) {
        dto.password = await bcrypt.hash(password, 7);
      }
      await this.doctorRepository.update(id, dto);
      const updated = await this.doctorRepository.findOne({ where: { id } });
      return this.toResponseDto(updated!);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      if (error.code === "23505") {
        if (error.detail.includes("email")) {
          throw new RpcException("Email already exists");
        }
        if (error.detail.includes("phone_number")) {
          throw new RpcException("Phone number already exists");
        }
      }
      throw new RpcException("Failed to create doctor");
    }
  }
  async remove(id: number) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) {
        throw new RpcException("Doctor not found");
      }
      await this.doctorRepository.remove(doctor);
      return { message: `Doctor with ID ${id} deleted` };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException("Failed to create doctor");
    }
  }

  async findByEmail(email: string) {
    try {
      const findEmail = await this.doctorRepository.findOne({
        where: { email },
      });
      if (!findEmail) {
        throw new RpcException({ message: "Not Found Email " });
      }
      console.log("Find Password FinEmail", findEmail);
      return findEmail;
    } catch (error) {
      throw null;
    }
  }
  async findOneForAuth(id: number) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) {
        throw new RpcException("Doctor not found");
      }
      return doctor; // To'liq doctor (hashedRefreshToken bilan)
    } catch (error) {
      throw new RpcException("Failed to find doctor");
    }
  }

  async updateRefreshToken(id: number, hashedRefreshToken: string) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) {
        throw new RpcException({ message: "DOctor Not Found" });
      }
      doctor.hashedRefreshToken = hashedRefreshToken;
      await this.doctorRepository.save(doctor);
      return {
        message: "Refresh token successfully updated",
      };
    } catch (error) {
      throw error;
    }
  }
  async clearRefreshToken(id: number) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) {
        throw new RpcException({ message: "Doctor not found" });
      }
      doctor.hashedRefreshToken = null!;
      await this.doctorRepository.save(doctor);
      return {
        success: true,
        message: "Refresh token successfully cleared",
      };
    } catch (error) {
      throw error;
    }
  }
  private toResponseDto(doctor: Doctor) {
    return {
      id: doctor.id,
      fullName: doctor.fullName,
      phoneNumber: doctor.phoneNumber,
      email: doctor.email,
      specialization: doctor.specialization,
      experience: doctor.experience,
      is_active: doctor.isActive,
    };
  }
}
