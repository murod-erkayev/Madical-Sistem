import { Module } from "@nestjs/common";
import { DoctorService } from "./doctors.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./entities/doctor.entity";
import { DoctorGrpcController } from "./doctors.controller"
@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  controllers: [DoctorGrpcController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorsModule {}
