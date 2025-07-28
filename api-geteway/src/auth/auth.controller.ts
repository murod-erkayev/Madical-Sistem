import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto, LogoutDto } from "./dto/create-auth.dto";

@ApiTags("Authentication")
@Controller("auth")
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login/doctor")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Doctor Login" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Doctor login successful",
    schema: {
      example: {
        success: true,
        message: "Doctor login successful",
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          email: "doctor@hospital.com",
          fullName: "Dr. John Smith",
          role: "doctor",
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials or account not active",
    schema: {
      example: {
        success: false,
        message: "Invalid doctor credentials",
      },
    },
  })
  loginDoctor(@Body() loginDto: LoginDto): Observable<any> {
    return this.authService.loginDoctor(loginDto);
  }

  @Post("login/admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: " Admin Login" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Admin login successful",
    schema: {
      example: {
        success: true,
        message: "Admin login successful",
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          email: "admin@hospital.com",
          fullName: "Admin User",
          role: "admin",
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials or account not active",
  })
  loginAdmin(@Body() loginDto: LoginDto): Observable<any> {
    return this.authService.loginAdmin(loginDto);
  }
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh Token" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    schema: {
      example: {
        success: true,
        message: "Tokens refreshed successfully",
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          email: "user@hospital.com",
          role: "doctor",
          fullName: "Dr. John Smith",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid refresh token",
  })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Observable<any> {
    return this.authService.refreshToken(refreshTokenDto);
  }
  @Post("logout/doctor")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Doctor Logout" })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: 200,
    description: "Doctor logout successful",
    schema: {
      example: {
        success: true,
        message: "Doctor muvaffaqiyatli logout qilindi",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid refresh token",
  })
  logoutDoctor(@Body() logoutDto: LogoutDto): Observable<any> {
    return this.authService.logoutDoctor(logoutDto);
  }
  @Post("logout/admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Admin Logout" })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: 200,
    description: "Admin logout successful",
    schema: {
      example: {
        success: true,
        message: "Admin muvaffaqiyatli logout qilindi",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid refresh token",
  })
  logoutAdmin(@Body() logoutDto: LogoutDto): Observable<any> {
    return this.authService.logoutAdmin(logoutDto);
  }
}
