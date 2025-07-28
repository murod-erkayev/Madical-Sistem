import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";

interface PatientServiceGrpc {
  createPatient(data: any): Observable<any>; 
  getPatientById(data: { id: number }): Observable<any>;
  getAllPatients(data:{}):Observable<any>
  updatePatient(data: any): Observable<any>; 
  deletePatient(data: { id: number }): Observable<any>;
}

@Injectable()
export class PatientsService implements OnModuleInit {
  private patientGrpcService: PatientServiceGrpc;

  constructor(
    @Inject("PATIENT_SERVICE")
    private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.patientGrpcService = this.client.getService("PatientService");
  }

  createPatient(data: CreatePatientDto) {
    return this.patientGrpcService.createPatient(data);
  }

  GetAllPatients() {
    return this.patientGrpcService.getAllPatients({});
  }

  getPatientById(id: number) {
    return this.patientGrpcService.getPatientById({ id });
  }

  updatePatient(id: number, updateData: UpdatePatientDto) {
    return this.patientGrpcService.updatePatient({
      id,
      ...updateData,
    });
  }

  deletePatient(id: number) {
    return this.patientGrpcService.deletePatient({ id });
  }
}
