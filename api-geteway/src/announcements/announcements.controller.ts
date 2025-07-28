// src/announcements/announcements.controller.ts
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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { AnnouncementsService } from "./announcements.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { JwtAuthGuard } from "../common/guards/user.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorator/role.decorator";

@ApiTags("announcements")
@Controller("announcements")
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new announcement" })
  @ApiResponse({
    status: 201,
    description: "Announcement created successfully",
  })
  create(
    @Body() createAnnouncementDto: CreateAnnouncementDto
  ): Observable<any> {
    return this.announcementsService.createAnnouncement(createAnnouncementDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all announcements" })
  @ApiResponse({ status: 200, description: "List of all announcements" })
  findAll(): Observable<any> {
    return this.announcementsService.getAllAnnouncements();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get announcement by ID" })
  @ApiParam({ name: "id", description: "Announcement ID" })
  @ApiResponse({ status: 200, description: "Announcement details" })
  findOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.announcementsService.getAnnouncementById(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update announcement" })
  @ApiParam({ name: "id", description: "Announcement ID" })
  @ApiResponse({
    status: 200,
    description: "Announcement updated successfully",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto
  ): Observable<any> {
    return this.announcementsService.updateAnnouncement(
      id,
      updateAnnouncementDto
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete announcement" })
  @ApiParam({ name: "id", description: "Announcement ID" })
  @ApiResponse({
    status: 200,
    description: "Announcement deleted successfully",
  })
  remove(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.announcementsService.deleteAnnouncement(id);
  }
}
