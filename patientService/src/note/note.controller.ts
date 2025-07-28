import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { NoteService } from "./note.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @GrpcMethod("NoteService", "CreateNote")
  async createNote(createNoteDto: CreateNoteDto) {
    return await this.noteService.create(createNoteDto);
  }

  @GrpcMethod("NoteService", "GetAllNotes")
  async getAllNotes() {
    const notes = await this.noteService.findAll();
    return { notes }; // Proto format uchun wrap qiling
  }

  @GrpcMethod("NoteService", "GetNoteById")
  async getNoteById(data: { id: number }) {
    return await this.noteService.findOne(data.id);
  }



  @GrpcMethod("NoteService", "UpdateNote")
  async updateNote(data: { id: number; text?: string; visitId?: number }) {
    const { id, ...updateData } = data;
    return await this.noteService.update(id, updateData);
  }

  @GrpcMethod("NoteService", "DeleteNote")
  async deleteNote(data: { id: number }) {
    return await this.noteService.remove(data.id);
  }
}
