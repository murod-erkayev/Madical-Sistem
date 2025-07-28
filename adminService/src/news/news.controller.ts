import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { NewsService } from "./news.service";

@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @GrpcMethod("AdminService", "CreateNews")
  async createNews(data: any) {
    console.log("Create News", data);
    return await this.newsService.create(data);
  }

  @GrpcMethod("AdminService", "GetAllNews")
  async getAllNews() {
    const news = await this.newsService.findAll();
    return { news };
  }

  @GrpcMethod("AdminService", "GetNewsById")
  async getNewsById(data: { id: number }) {
    return await this.newsService.findOne(data.id);
  }

  @GrpcMethod("AdminService", "UpdateNews")
  async updateNews(data: any) {
    const { id, ...updateData } = data;
    return await this.newsService.update(id, updateData);
  }

  @GrpcMethod("AdminService", "DeleteNews")
  async deleteNews(data: { id: number }) {
    await this.newsService.remove(data.id);
    return { message: `News with id ${data.id} deleted successfully` };
  }
}
