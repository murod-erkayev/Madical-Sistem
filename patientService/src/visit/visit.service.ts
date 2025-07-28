import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateVisitDto } from "./dto/create-visit.dto";
import { UpdateVisitDto } from "./dto/update-visit.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Visit } from "./entities/visit.entity";
import { PatientService } from "../patient/patient.service";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private visitRepo: Repository<Visit>,
    private readonly patientService: PatientService // ✅ typo to'g'rilandi
  ) {}

  async create(createVisitDto: CreateVisitDto) {
    const { patientId } = createVisitDto;
    const patient = await this.patientService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException({ message: "Patient not found" });
    }
    const visit = this.visitRepo.create({
      ...createVisitDto,
      patient,
    });
    const saved = await this.visitRepo.save(visit);
    return this.toResponseDto(saved);
  }

  async findAll() {
    const visits = await this.visitRepo.find({
      relations: ["patient"],
    });
    return visits.map((visit) => this.toResponseDto(visit));
  }

  async findOne(id: number) {
    try {
      const visit = await this.visitRepo.findOne({
        where: { id },
        relations: ["patient"],
      });
      if (!visit) {
        throw new RpcException({ message: "Visit not found" });
      }
      return this.toResponseDto(visit);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateVisitDto: UpdateVisitDto) {
    try {
      const { patientId } = updateVisitDto;
      const visit = await this.visitRepo.findOne({ where: { id } });
      if (!visit) {
        throw new RpcException({ message: "Visit not found" });
      }

      if (patientId) {
        const patient = await this.patientService.findOne(patientId);
        if (!patient) {
          throw new RpcException({ message: "Patient not found" });
        }
      }
      await this.visitRepo.update(id, updateVisitDto);
      const updated = await this.visitRepo.findOne({
        where: { id },
        relations: ["patient"],
      });
      return this.toResponseDto(updated!);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const visit = await this.visitRepo.findOne({ where: { id } });
      if (!visit) {
        throw new RpcException({ message: "Visit not found" });
      }
      await this.visitRepo.delete(id);
      return { message: `Visit successfully removed ${id}` };
      
    } catch (error) {
      throw error
    }
  }

  private toResponseDto(visit: Visit) {
    return {
      id: visit.id,
      patientId: visit.patient?.id,
      visitDate: visit.visitDate,
      reason: visit.reason,
      patient: visit.patient,
    };
  }
}
