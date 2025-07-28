import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateNewsDto {
  @ApiProperty({
    example: "Hospital Wins Excellence Award 2025",
    description: "News title",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      "Our hospital has been recognized with the Healthcare Excellence Award 2025 for outstanding patient care and medical innovation.",
    description: "News content",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
