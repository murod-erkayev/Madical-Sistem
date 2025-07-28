// src/admin/admin.controller.ts
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
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { JwtAuthGuard } from "../common/guards/user.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorator/role.decorator";

@ApiTags("admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new admin" })
  @ApiResponse({ status: 201, description: "Admin created successfully" })
  create(@Body() createAdminDto: CreateAdminDto): Observable<any> {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("superAdmin", "admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all admins" })
  @ApiResponse({ status: 200, description: "List of all admins" })
  findAll(): Observable<any> {
    return this.adminService.getAllAdmins();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("superAdmin", "admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get admin by ID" })
  @ApiParam({ name: "id", description: "Admin ID" })
  @ApiResponse({ status: 200, description: "Admin details" })
  findOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.adminService.getAdminById(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("superAdmin", "admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update admin" })
  @ApiParam({ name: "id", description: "Admin ID" })
  @ApiResponse({ status: 200, description: "Admin updated successfully" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto
  ): Observable<any> {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete admin" })
  @ApiParam({ name: "id", description: "Admin ID" })
  @ApiResponse({ status: 200, description: "Admin deleted successfully" })
  remove(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.adminService.deleteAdmin(id);
  }
}
