import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({ example: "Admin User", description: "Full name of the admin" })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: "admin@hospital.com", description: "Email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "Password" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: true, description: "Active status" })
  @IsBoolean()
  isActive: boolean;
  
  role:string
}
