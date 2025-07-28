import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "./entities/admin.entity";
import * as bcrypt from "bcrypt";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const { email, password } = createAdminDto;
      const existsEmail = await this.adminRepo.findOne({ where: { email } });
      if (existsEmail) {
        throw new RpcException({ message: "Email already exists" });
      }
      const passworrdHashed = await bcrypt.hash(password, 7);
      const admin = this.adminRepo.create({
        ...createAdminDto,
        password: passworrdHashed,
      });
      const saveAdmim = await this.adminRepo.save(admin);
      return saveAdmim;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const admin = await this.adminRepo.find();
    return admin.map((ad) => this.toResponseDto(ad));
  }

  async findOne(id: number) {
    try {
      const admin = await this.adminRepo.findOne({ where: { id } });
      if (!admin) {
        throw new RpcException({ message: "Not Found Id Admin" });
      }
      return this.toResponseDto(admin);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const adminEmail = await this.adminRepo.findOne({ where: { email } });
      if (!adminEmail) {
        throw new RpcException({ message: "Not found admin email" });
      }
      return adminEmail; //=>passwordni olish uchun toresponsi ishaltiladi
      //Ozi shunign uchun Havsizlikni taminlash uchun qildim toresponseDto ni !!
    } catch (error) {
      throw error;
    }
  }
  async findOneForAuth(id: number) {
    try {
      const admin = await this.adminRepo.findOne({ where: { id } });
      if (!admin) {
        throw new RpcException({ message: "Admin not found" });
      }
      return admin; // To'liq admin ma'lumotlari (hashedRefreshToken bilan)
    } catch (error) {
      throw new RpcException({ message: "Failed to find admin" });
    }
  }
  async updateRefreshToken(id: number, hashedRefreshToken: string) {
    try {
      const admin = await this.adminRepo.findOne({ where: { id } });
      if (!admin) {
        throw new RpcException({ message: "Admin not found" });
      }

      admin.hashedRefreshToken = hashedRefreshToken;

      await this.adminRepo.save(admin);

      return {
        message: "Refresh token successfully updated",
      };
    } catch (error) {
      console.error("Update refresh token error:", error);
      throw new RpcException({ message: "Failed to update refresh token" });
    }
  }
  async clearRefreshToken(id: number) {
    try {
      const admin = await this.adminRepo.findOne({ where: { id } });
      if (!admin) {
        throw new RpcException({ message: "Admin not found" });
      }

      admin.hashedRefreshToken = "";

      await this.adminRepo.save(admin);

      return {
        message: "Refresh token successfully cleared",
      };
    } catch (error) {
      console.error("Clear refresh token error:", error);
      throw new RpcException({ message: "Failed to clear refresh token" });
    }
  }
  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const { email, password } = updateAdminDto;
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new RpcException({ message: "Not Found Id Admin" });
    }
    if (email && email !== admin.email) {
      const existsEmail = await this.adminRepo.findOne({ where: { email } });
      if (existsEmail) {
        throw new RpcException({ message: "Email already exists" });
      }
    }
    if (password) {
      admin.password = await bcrypt.hash(password, 7);
    }
    await this.adminRepo.update(id, updateAdminDto);
    const update = await this.adminRepo.findOne({ where: { id } });
    return this.toResponseDto(update!);
  }
  async remove(id: number) {
    try {
      const admin = await this.adminRepo.findOne({ where: { id } });
      if (!admin) {
        throw new RpcException({ message: "Not Found Id admin" });
      }
      if (admin.role === "superAdmin") {
        throw new RpcException({
          message: "SuperAdmin ni o'chirish taqiqlangan!",
        });
      }
      await this.adminRepo.delete(id);
      return { message: `Admin successfully removed ${id}` };
    } catch (error) {
      throw error;
    }
  }

  private toResponseDto(admin: Admin) {
    return {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      isActive: admin.isActive,
      createdAt: admin.createdAt.toISOString(),
      role: admin.role,
    };
  }
}
