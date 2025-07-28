import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { VisitModule } from '../visit/visit.module';

@Module({
  imports:[TypeOrmModule.forFeature([Note]), VisitModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
