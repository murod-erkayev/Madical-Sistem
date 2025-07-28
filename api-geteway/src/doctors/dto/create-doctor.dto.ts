import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional, IsNotEmpty } from "class-validator";

export class CreateDoctorDto {
  @ApiProperty({
    example: "Dr. John Smith",
    description: "Full name of the doctor",
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: "+998901234567", description: "Phone number" })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: "john.smith@hospital.com",
    description: "Email address",
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: "strongPassword123",
    description: "Password",
    required: false,
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    example: "Cardiology",
    description: "Medical specialization",
    required: false,
  })
  @IsString()
  specialization: string;

  @ApiProperty({ example: "5 years", description: "Years of experience" })
  @IsString()
  experience: string;
}
