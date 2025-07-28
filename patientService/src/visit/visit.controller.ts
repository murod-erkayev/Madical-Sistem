import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { VisitService } from "./visit.service";
import { CreateVisitDto } from "./dto/create-visit.dto";
import { UpdateVisitDto } from "./dto/update-visit.dto";

@Controller()
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @GrpcMethod("VisitService", "CreateVisit")
  async createVisit(createVisitDto: CreateVisitDto) {
    return await this.visitService.create(createVisitDto);
  }

  @GrpcMethod("VisitService", "GetAllVisits")
  async getAllVisits() {
    const visits = await this.visitService.findAll();
    return { visits }; // Proto format uchun wrap qiling
  }

  @GrpcMethod("VisitService", "GetVisitById")
  async getVisitById(data: { id: number }) {
    return await this.visitService.findOne(data.id);
  }


  @GrpcMethod("VisitService", "UpdateVisit")
  async updateVisit(data: {
    id: number;
    patientId?: number;
    visitDate?: string;
    reason?: string;
  }) {
    const { id, ...updateData } = data;
    return await this.visitService.update(id, updateData);
  }

  @GrpcMethod("VisitService", "DeleteVisit")
  async deleteVisit(data: { id: number }) {
    return await this.visitService.remove(data.id);
  }
}
