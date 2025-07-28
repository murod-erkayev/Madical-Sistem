import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc, RpcException } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
//interface typOrm va typscript erroni oldin olish uchun va run erroni ham oldini olish uchun yozildi
interface DoctorServiceGrpc {
  CreateDoctor(data: CreateDoctorDto): Observable<CreateDoctorDto>;
  GetDoctor(data: { id: number }): Observable<any>;
  GetAllDoctors(data: {}): Observable<any>;
  UpdateDoctor(data: CreateDoctorDto): Observable<any>;
  DeleteDoctor(data: { id: number }): Observable<any>;
}
@Injectable()
export class DoctorsService implements OnModuleInit {
  private doctorService: DoctorServiceGrpc;
  constructor(@Inject("DOCTOR_SERVICE") private client: ClientGrpc) {}

  onModuleInit() {
    this.doctorService =
      this.client.getService<DoctorServiceGrpc>("DoctorService");

  }
  createDoctor(data: CreateDoctorDto): Observable<CreateDoctorDto> {
    return this.doctorService.CreateDoctor(data);
  }
  getAllDoctors() {
    return this.doctorService.GetAllDoctors({});
  }
  getDoctorById(id: number) {
    return this.doctorService.GetDoctor({ id });
  }
  updateDoctor(id: number, data: any) {
    return this.doctorService.UpdateDoctor({ id, ...data });
  }
  deleteDoctor(id: number) {
    return this.doctorService.DeleteDoctor({ id });
  }
}
