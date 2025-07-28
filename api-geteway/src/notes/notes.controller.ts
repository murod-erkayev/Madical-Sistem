// src/notes/notes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Observable } from "rxjs";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "../common/guards/user.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorator/role.decorator";

@ApiTags("notes")
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new note" })
  @ApiResponse({ status: 201, description: "Note created successfully" })
  create(@Body() createNoteDto: CreateNoteDto): Observable<any> {
    return this.notesService.createNote(createNoteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all notes" })
  @ApiResponse({ status: 200, description: "List of all notes" })
  findAll(): Observable<any> {
    return this.notesService.getAllNotes();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get note by ID" })
  @ApiParam({ name: "id", description: "Note ID" })
  @ApiResponse({ status: 200, description: "Note details" })
  findOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.notesService.getNoteById(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update note" })
  @ApiParam({ name: "id", description: "Note ID" })
  @ApiResponse({ status: 200, description: "Note updated successfully" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto
  ): Observable<any> {
    return this.notesService.updateNote(id, updateNoteDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete note" })
  @ApiParam({ name: "id", description: "Note ID" })
  @ApiResponse({ status: 200, description: "Note deleted successfully" })
  remove(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.notesService.remove(id);
  }
}
