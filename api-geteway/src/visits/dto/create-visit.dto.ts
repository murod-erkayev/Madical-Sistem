import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsNotEmpty } from "class-validator";

export class CreateVisitDto {
  @ApiProperty({ example: 1, description: "Patient ID" })
  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({ example: "2025-07-24", description: "Visit date" })
  @IsString()
  @IsNotEmpty()
  visitDate: string;

  @ApiProperty({ example: "Regular checkup", description: "Reason for visit" })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: "Create Date", description: " Date" })
  create_at: string;
}
