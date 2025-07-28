import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";

// ✅ NoteService interface (PatientService emas!)
interface NoteServiceGrpc {
  CreateNote(data: any): Observable<any>;
  GetNoteById(data: { id: number }): Observable<any>;
  GetNotesByVisitId(data: { id: number }): Observable<any>;
  GetAllNotes(data: {}): Observable<any>;
  UpdateNote(data: any): Observable<any>;
  DeleteNote(data: { id: number }): Observable<any>;
}

@Injectable()
export class NotesService implements OnModuleInit {
  private noteService: NoteServiceGrpc; // ✅ noteService o'zgaruvchisi

  constructor(@Inject("PATIENT_SERVICE") private client: ClientGrpc) {}

  onModuleInit() {
    // ✅ NoteService ni olish (PatientService emas!)
    this.noteService = this.client.getService<NoteServiceGrpc>("NoteService");
  }

  createNote(data: any): Observable<any> {
    return this.noteService.CreateNote(data); // ✅ noteService.CreateNote
  }

  getAllNotes(): Observable<any> {
    return this.noteService.GetAllNotes({});
  }

  getNoteById(id: number): Observable<any> {
    return this.noteService.GetNoteById({ id });
  }

  getNotesByVisitId(visitId: number): Observable<any> {
    return this.noteService.GetNotesByVisitId({ id: visitId });
  }

  updateNote(id: number, data: any): Observable<any> {
    return this.noteService.UpdateNote({ id, ...data });
  }

  remove(id: number): Observable<any> {
    return this.noteService.DeleteNote({ id });
  }
}
