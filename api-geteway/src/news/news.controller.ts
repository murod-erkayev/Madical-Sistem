// src/news/news.controller.ts
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
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { Roles } from "../common/decorator/role.decorator";
import { JwtAuthGuard } from "../common/guards/user.guard";
import { RolesGuard } from "../common/guards/role.guard";

@ApiTags("news")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create news" })
  @ApiResponse({ status: 201, description: "News created successfully" })
  create(@Body() createNewsDto: CreateNewsDto): Observable<any> {
    return this.newsService.createNews(createNewsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all news" })
  @ApiResponse({ status: 200, description: "List of all news" })
  findAll(): Observable<any> {
    return this.newsService.getAllNews();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get news by ID" })
  @ApiParam({ name: "id", description: "News ID" })
  @ApiResponse({ status: 200, description: "News details" })
  findOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.newsService.getNewsById(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update news" })
  @ApiParam({ name: "id", description: "News ID" })
  @ApiResponse({ status: 200, description: "News updated successfully" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto
  ): Observable<any> {
    return this.newsService.updateNews(id, updateNewsDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superAdmin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete news" })
  @ApiParam({ name: "id", description: "News ID" })
  @ApiResponse({ status: 200, description: "News deleted successfully" })
  remove(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.newsService.deleteNews(id);
  }
}
