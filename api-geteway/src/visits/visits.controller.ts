// src/visits/visits.controller.ts
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
import { VisitsService } from "./visits.service";
import { CreateVisitDto } from "./dto/create-visit.dto";
import { UpdateVisitDto } from "./dto/update-visit.dto";
import { Roles } from "../common/decorator/role.decorator";
import { JwtAuthGuard } from "../common/guards/user.guard";
import { RolesGuard } from "../common/guards/role.guard";

@ApiTags("visits")
@Controller("visits")
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new visit" })
  @ApiResponse({ status: 201, description: "Visit created successfully" })
  create(@Body() createVisitDto: CreateVisitDto): Observable<any> {
    return this.visitsService.createVisit(createVisitDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all visits" })
  @ApiResponse({ status: 200, description: "List of all visits" })
  findAll(): Observable<any> {
    return this.visitsService.getAllVisits();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get visit by ID" })
  @ApiParam({ name: "id", description: "Visit ID" })
  @ApiResponse({ status: 200, description: "Visit details" })
  findOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.visitsService.getVisitById(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update visit" })
  @ApiParam({ name: "id", description: "Visit ID" })
  @ApiResponse({ status: 200, description: "Visit updated successfully" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateVisitDto: UpdateVisitDto
  ): Observable<any> {
    return this.visitsService.updateVisit(id, updateVisitDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete visit" })
  @ApiParam({ name: "id", description: "Visit ID" })
  @ApiResponse({ status: 200, description: "Visit deleted successfully" })
  remove(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.visitsService.deleteVisit(id);
  }
}
