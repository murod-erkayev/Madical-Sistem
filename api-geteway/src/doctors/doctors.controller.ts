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
import { DoctorsService } from "./doctors.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { JwtAuthGuard } from "../common/guards/user.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorator/role.decorator";
@ApiTags("doctors")
@Controller("doctors")
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new doctor" })
  @ApiResponse({ status: 201, description: "Doctor created successfully" })
  create(
    @Body() createDoctorDto: CreateDoctorDto
  ): Observable<CreateDoctorDto> {
    //full_name => qabul qilmask ekan faqat =>fullName
    //tekshruv otkazilgan
    const grpcData = {
      fullName: createDoctorDto.fullName,
      phoneNumber: createDoctorDto.phoneNumber,
      email: createDoctorDto.email,
      password: createDoctorDto.password,
      specialization: createDoctorDto.specialization,
      experience: createDoctorDto.experience,
    };
    console.log(grpcData.fullName, grpcData.phoneNumber);
    return this.doctorsService.createDoctor(grpcData);
  }
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all doctors" })
  @ApiResponse({ status: 200, description: "List of all doctors" })
  findAll(): Observable<any> {
    return this.doctorsService.getAllDoctors();
  }
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get doctor by ID" })
  @ApiParam({ name: "id", description: "Doctor ID" })
  @ApiResponse({ status: 200, description: "Doctor details" })
  findOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.doctorsService.getDoctorById(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update doctor" })
  @ApiParam({ name: "id", description: "Doctor ID" })
  @ApiResponse({ status: 200, description: "Doctor updated successfully" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto
  ): Observable<any> {
    return this.doctorsService.updateDoctor(id, updateDoctorDto);
  }
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete doctor" })
  @ApiParam({ name: "id", description: "Doctor ID" })
  @ApiResponse({ status: 200, description: "Doctor deleted successfully" })
  remove(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.doctorsService.deleteDoctor(id);
  }
}
