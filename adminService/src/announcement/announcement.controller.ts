import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AnnouncementService } from "./announcement.service";

@Controller()
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @GrpcMethod("AdminService", "CreateAnnouncement")
  async createAnnouncement(data: any) {
    console.log("Create Announcement", data);
    return await this.announcementService.create(data);
  }

  @GrpcMethod("AdminService", "GetAllAnnouncements")
  async getAllAnnouncements() {
    const announcements = await this.announcementService.findAll();
    return { announcements };
  }

  @GrpcMethod("AdminService", "GetAnnouncementById")
  async getAnnouncementById(data: { id: number }) {
    return await this.announcementService.findOne(data.id);
  }

  @GrpcMethod("AdminService", "UpdateAnnouncement")
  async updateAnnouncement(data: any) {
    const { id, ...updateData } = data;
    return await this.announcementService.update(id, updateData);
  }

  @GrpcMethod("AdminService", "DeleteAnnouncement")
  async deleteAnnouncement(data: { id: number }) {
    await this.announcementService.remove(data.id);
    return { message: `Announcement with id ${data.id} deleted successfully` };
  }
}
