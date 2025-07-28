// src/announcements/announcements.service.ts
import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";

interface AdminServiceGrpc {
  CreateAnnouncement(data: any): Observable<any>;
  GetAnnouncementById(data: { id: number }): Observable<any>;
  GetAllAnnouncements(data: {}): Observable<any>;
  UpdateAnnouncement(data: any): Observable<any>;
  DeleteAnnouncement(data: { id: number }): Observable<any>;
}

@Injectable()
export class AnnouncementsService implements OnModuleInit {
  private adminService: AdminServiceGrpc;

  constructor(@Inject("ADMIN_SERVICE") private client: ClientGrpc) {}

  onModuleInit() {
    this.adminService =
      this.client.getService<AdminServiceGrpc>("AdminService");
  }

  createAnnouncement(data: any) {
    return this.adminService.CreateAnnouncement(data);
  }

  getAllAnnouncements() {
    return this.adminService.GetAllAnnouncements({});
  }

  getAnnouncementById(id: number) {
    return this.adminService.GetAnnouncementById({ id });
  }

  updateAnnouncement(id: number, data: any) {
    return this.adminService.UpdateAnnouncement({
      id,
      title: data.title,
      content: data.content,
    });
  }

  deleteAnnouncement(id: number) {
    return this.adminService.DeleteAnnouncement({ id });
  }
}
