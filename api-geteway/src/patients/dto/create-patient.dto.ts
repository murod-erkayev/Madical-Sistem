import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsInt,
  IsNotEmpty,
} from "class-validator";

export class CreatePatientDto {
  @ApiProperty({
    example: "john.doe@example.com",
    description: "Email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe", description: "Full name of the patient" })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: "+998901234567", description: "Phone number" })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: "123 Main Street, Tashkent",
    description: "Home address",
  })
  @IsString()
  address: string;

  @ApiProperty({ example: "A+", description: "Blood group" })
  @IsString()
  bloodGroup: string;

  @ApiProperty({
    example: "Patient history and notes",
    description: "Bio information",
  })
  @IsString()
  bio: string;

  @ApiProperty({ example: true, description: "Active status" })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 1, description: "Doctor ID" })
  @IsInt()
  doctorId: number;
}
