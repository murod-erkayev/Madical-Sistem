import { VisitService } from "./../visit/visit.service";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";
import { RpcException } from "@nestjs/microservices";
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepo: Repository<Note>,
    private readonly visitService: VisitService
  ) {}
  async create(createNoteDto: CreateNoteDto) {
    const { visitId } = createNoteDto;
    const visit = await this.visitService.findOne(visitId);
    if (!visit) {
      throw new NotFoundException({ message: "Not Found Id Visit" });
    }
    const note = this.noteRepo.create({ ...createNoteDto, visit });
    const saved = await this.noteRepo.save(note);
    return this.toResponseDto(saved);
  }

  async findAll() {
    const notes = await this.noteRepo.find({ relations: ["visit"] });
    return notes.map((note) => this.toResponseDto(note));
  }

  async findOne(id: number) {
    try {
      const note = await this.noteRepo.findOne({
        where: { id },
        relations: ["visit"],
      });
      if (!note) {
        throw new RpcException({ message: "Not Found Id" });
      }
      return this.toResponseDto(note);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    try {
      const { visitId } = updateNoteDto;

      const note = await this.noteRepo.findOne({ where: { id } });
      if (!note) {
        throw new RpcException({ message: "Not Found  Id" });
      }

      if (visitId) {
        const visit = await this.visitService.findOne(visitId);
        if (!visit) {
          throw new RpcException({ message: "Not Found  Id" });
        }
      }
      await this.noteRepo.update(id, updateNoteDto);
      const updated = await this.noteRepo.findOne({
        where: { id },
        relations: ["visit"],
      });
      return this.toResponseDto(updated!);
    } catch (error) {
      throw error;
    }
  }
  async remove(id: number) {
    try {
      
      const note = await this.noteRepo.findOne({ where: { id } });
      if (!note) {
        throw new RpcException({ message: "Not Found Id" });
      }
      await this.noteRepo.delete(id);
      return { message: `Note successfuly remvoed ${id}` };
    } catch (error) {
      throw error
    }
  }
  private toResponseDto(note: Note) {
    return {
      id: note.id,
      text: note.text,
      visit_id: note.visit?.id,
      visit: note.visit,
      createAt: note.createAt,
    };
  }
}
