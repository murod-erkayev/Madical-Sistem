import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AdminService } from "./admin.service";

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @GrpcMethod("AdminService", "CreateAdmin")
  async createAdmin(data: any) {
    console.log("Create AdminServicedstgfgfgfgh", data);
    return await this.adminService.createAdmin(data);
  }

  @GrpcMethod("AdminService", "GetAllAdmins")
  async getAllAdmins() {
    const admins = await this.adminService.findAll();
    return { admins };
  }

  @GrpcMethod("AdminService", "GetAdminById")
  async getAdminById(data: { id: number }) {
    return await this.adminService.findOne(data.id);
  }

  @GrpcMethod("AdminService", "GetAdminByEmail")
  async getAdminByEmail(data: { email: string }) {
    return await this.adminService.findByEmail(data.email);
  }

  @GrpcMethod("AdminService", "GetAdminForAuth")
  async getAdminForAuth(data: { id: number }) {
    console.log("Getting admin for auth:", data.id);
    return await this.adminService.findOneForAuth(data.id);
  }
  @GrpcMethod("AdminService", "UpdateRefreshToken")
  async updateRefreshToken(data: { id: number; refreshToken: string }) {
    console.log("Updating refresh token for admin:", data.id);
    return await this.adminService.updateRefreshToken(
      data.id,
      data.refreshToken
    );
  }
  @GrpcMethod("AdminService", "ClearRefreshToken")
  async clearRefreshToken(data: { id: number }) {
    console.log("Clearing refresh token for admin:", data.id);
    return await this.adminService.clearRefreshToken(data.id);
  }

  @GrpcMethod("AdminService", "UpdateAdmin")
  async updateAdmin(data: any) {
    const { id, ...updateData } = data;
    return await this.adminService.update(id, updateData);
  }

  @GrpcMethod("AdminService", "DeleteAdmin")
  async deleteAdmin(data: { id: number }) {
    return await this.adminService.remove(data.id);
  }
}
