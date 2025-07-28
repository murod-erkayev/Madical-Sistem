import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CreateAdminDto } from "./dto/create-admin.dto";

// Proto fayldan kelgan type'lar
interface CreateAdminRequest {
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
}

interface AdminResponse {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface GetAllAdminsResponse {
  admins: AdminResponse[];
}

interface DeleteResponse {
  message: string;
}

interface GetAdminRequest {
  id: number;
}

interface UpdateAdminRequest {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
}

interface DeleteAdminRequest {
  id: number;
}

// To'g'ri type'lar bilan interface
interface AdminServiceGrpc {
  CreateAdmin(data: CreateAdminRequest): Observable<AdminResponse>;
  GetAdminById(data: GetAdminRequest): Observable<AdminResponse>;
  GetAllAdmins(data: {}): Observable<GetAllAdminsResponse>;
  UpdateAdmin(data: UpdateAdminRequest): Observable<AdminResponse>;
  DeleteAdmin(data: DeleteAdminRequest): Observable<DeleteResponse>;
}

@Injectable()
export class AdminService implements OnModuleInit {
  private adminService: AdminServiceGrpc;

  constructor(@Inject("ADMIN_SERVICE") private client: ClientGrpc) {}

  onModuleInit() {
    this.adminService =
      this.client.getService<AdminServiceGrpc>("AdminService");
  }

  createAdmin(data: CreateAdminDto): Observable<AdminResponse> {
    console.log("Creating admin:", data);
    return this.adminService.CreateAdmin(data);
  }

  getAllAdmins(): Observable<GetAllAdminsResponse> {
    return this.adminService.GetAllAdmins({});
  }

  getAdminById(id: number): Observable<AdminResponse> {
    return this.adminService.GetAdminById({ id });
  }

  updateAdmin(id: number, data: any): Observable<AdminResponse> {
    return this.adminService.UpdateAdmin({ id, ...data });
  }

  deleteAdmin(id: number): Observable<DeleteResponse> {
    return this.adminService.DeleteAdmin({ id });
  }
}
