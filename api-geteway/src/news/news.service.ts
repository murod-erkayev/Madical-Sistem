// src/news/news.service.ts
import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";

interface AdminServiceGrpc {
  CreateNews(data: any): Observable<any>;
  GetNewsById(data: { id: number }): Observable<any>;
  GetAllNews(data: {}): Observable<any>;
  UpdateNews(data: any): Observable<any>;
  DeleteNews(data: { id: number }): Observable<any>;
}

@Injectable()
export class NewsService implements OnModuleInit {
  private adminService: AdminServiceGrpc;

  constructor(@Inject("ADMIN_SERVICE") private client: ClientGrpc) {}

  onModuleInit() {
    this.adminService =
      this.client.getService<AdminServiceGrpc>("AdminService");
  }

  createNews(data: any) {
    return this.adminService.CreateNews(data);
  }

  getAllNews() {
    return this.adminService.GetAllNews({});
  }

  getNewsById(id: number) {
    return this.adminService.GetNewsById({ id });
  }

  updateNews(id: number, data: any) {
    return this.adminService.UpdateNews({ id, ...data });
  }

  deleteNews(id: number) {
    return this.adminService.DeleteNews({ id });
  }
}
