import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { News } from "./entities/news.entity";
import { RpcException } from "@nestjs/microservices";
import e from "express";

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepo: Repository<News>
  ) {}
  async create(createNewsDto: CreateNewsDto) {
    const news = this.newsRepo.create(createNewsDto);
    const saveNews = await this.newsRepo.save(news);
    return this.toResponseDto(saveNews);
  }

  async findAll() {
    const newsAll = await this.newsRepo.find();
    return newsAll.map((news) => this.toResponseDto(news));
  }

  async findOne(id: number) {
    try {
      const news = await this.newsRepo.findOne({ where: { id } });
      if (!news) {
        throw new RpcException({ message: "Not Found Id" });
      }
      return this.toResponseDto(news);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    try {
      const news = await this.newsRepo.findOne({ where: { id } });
      if (!news) {
        throw new RpcException({ message: "Not Found Id" });
      }
      await this.newsRepo.update(id, updateNewsDto);
      const newsUpdate = await this.newsRepo.findOne({ where: { id } });
      return this.toResponseDto(newsUpdate!);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const news = await this.newsRepo.findOne({ where: { id } });
      if (!news) {
        throw new RpcException({ message: "Not Found Id " });
      }
      await this.newsRepo.delete(id);
      return this.toResponseDto(news);
    } catch (error) {
      throw error;
    }
  }
  private toResponseDto(news: News) {
    return {
      id: news.id,
      title: news.title,
      content: news.content,
      createAt: news.createdAt,
    };
  }
}
