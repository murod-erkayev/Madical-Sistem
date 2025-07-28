import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";

// ✅ VisitService interface (proto fayldagi VisitService uchun)
interface VisitServiceGrpc {
  CreateVisit(data: any): Observable<any>;
  GetVisitById(data: { id: number }): Observable<any>;
  GetAllVisits(data: {}): Observable<any>;
  GetVisitsByPatientId(data: { id: number }): Observable<any>; // Proto dagi nom
  UpdateVisit(data: any): Observable<any>;
  DeleteVisit(data: { id: number }): Observable<any>;
}

@Injectable()
export class VisitsService implements OnModuleInit {
  private visitService: VisitServiceGrpc; // ✅ visitService o'zgaruvchisi

  constructor(@Inject("PATIENT_SERVICE") private client: ClientGrpc) {}

  onModuleInit() {
    // ✅ VisitService ni olish (PatientService emas!)
    this.visitService =
      this.client.getService<VisitServiceGrpc>("VisitService");
  }

  createVisit(data: any): Observable<any> {
    return this.visitService.CreateVisit(data); // ✅ visitService.CreateVisit
  }

  getAllVisits(): Observable<any> {
    return this.visitService.GetAllVisits({});
  }

  getVisitById(id: number): Observable<any> {
    return this.visitService.GetVisitById({ id });
  }

  getVisitsByPatient(patientId: number): Observable<any> {
    return this.visitService.GetVisitsByPatientId({ id: patientId }); // ✅ To'g'ri method nomi
  }

  updateVisit(id: number, data: any): Observable<any> {
    return this.visitService.UpdateVisit({ id, ...data });
  }

  deleteVisit(id: number): Observable<any> {
    return this.visitService.DeleteVisit({ id });
  }
}
