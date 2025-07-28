import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsNotEmpty } from "class-validator";

export class CreateNoteDto {
  @ApiProperty({
    example: "Patient is recovering well. Prescribed medication X for 7 days.",
    description: "Note content",
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 1, description: "Visit ID" })
  @IsInt()
  @IsNotEmpty()
  visitId: number;

  @ApiProperty({ example: "2343-02-12", description: "Date" })
  createAt: string;
}
