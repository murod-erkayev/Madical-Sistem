import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
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
import { PatientsService } from "./patients.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { JwtAuthGuard } from "../common/guards/user.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorator/role.decorator";

@ApiTags("patients")
@Controller("patients")
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new patient" })
  @ApiResponse({ status: 201, description: "Patient created successfully" })
  create(@Body() createPatientDto: CreatePatientDto): Observable<any> {
    console.log("🔥 API POST:", createPatientDto);
    return this.patientsService.createPatient(createPatientDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all patients" })
  @ApiResponse({ status: 200, description: "List of all patients" })
  findAll() {
    return this.patientsService.GetAllPatients();
  }
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get patient by ID" })
  @ApiParam({ name: "id", description: "Patient ID" })
  @ApiResponse({ status: 200, description: "Patient details" })
  findOne(@Param("id") id: number): Observable<any> {
    return this.patientsService.getPatientById(id);
  }
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update patient" })
  @ApiParam({ name: "id", description: "Patient ID" })
  @ApiResponse({ status: 200, description: "Patient updated successfully" })
  update(
    @Param("id") id: number,
    @Body() updatePatientDto: UpdatePatientDto
  ): Observable<any> {
    // ✅ FIXED: CreatePatientDto → any
    console.log("🔥 API PUT:", id, updatePatientDto);
    return this.patientsService.updatePatient(id, updatePatientDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete patient" })
  @ApiParam({ name: "id", description: "Patient ID" })
  @ApiResponse({ status: 200, description: "Patient deleted successfully" })
  remove(@Param("id") id: number): Observable<any> {
    console.log("🔥 API DELETE:", id);
    return this.patientsService.deletePatient(id);
  }
}
