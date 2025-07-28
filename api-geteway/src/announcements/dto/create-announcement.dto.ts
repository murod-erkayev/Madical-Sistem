import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateAnnouncementDto {
  @ApiProperty({
    example: "New COVID-19 Vaccination Available",
    description: "Announcement title",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      "We are pleased to announce that COVID-19 vaccinations are now available at our hospital. Please contact reception to schedule your appointment.",
    description: "Announcement content",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
