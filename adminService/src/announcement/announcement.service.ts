import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Announcement } from "./entities/announcement.entity";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepo: Repository<Announcement>
  ) {}
  // ancn => announcements
  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const ancn = this.announcementRepo.create(createAnnouncementDto);
    const save = await this.announcementRepo.save(ancn);
    return this.toResponseDto(save);
  }
  async findAll() {
    const ancn = await this.announcementRepo.find();
    return ancn.map((an) => this.toResponseDto(an));
  }

  async findOne(id: number) {
    try {
      const ancn = await this.announcementRepo.findOne({ where: { id } });
      if (!ancn) {
        throw new RpcException({
          message: "Not Found Id  Announcement",
        });
      }
      return this.toResponseDto(ancn);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    try {
      const ancn = await this.announcementRepo.findOne({ where: { id } });
      if (!ancn) {
        throw new RpcException({ message: `Not Found Id => ${id}` });
      }
      await this.announcementRepo.update(id, updateAnnouncementDto);
      const ancnUpdate = await this.announcementRepo.findOne({ where: { id } });
      return this.toResponseDto(ancnUpdate!);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const ancn = await this.announcementRepo.findOne({ where: { id } });
      if (!ancn) {
        throw new RpcException({ message: `Not Found Id => ${id}` });
      }
      await this.announcementRepo.delete(id);
      return this.toResponseDto(ancn);
    } catch (error) {
      throw error;
    }
  }
  private toResponseDto(ancn: Announcement) {
    return {
      id: ancn.id,
      title: ancn.title,
      createAt: ancn.createdAt,
      content: ancn.content,
    };
  }
}
