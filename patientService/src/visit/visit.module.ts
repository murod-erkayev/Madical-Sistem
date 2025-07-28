import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports:[TypeOrmModule.forFeature([Visit]),PatientModule],
  controllers: [VisitController],
  providers: [VisitService],
  exports:[VisitService]
})
export class VisitModule {}
