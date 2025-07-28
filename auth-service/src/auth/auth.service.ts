import {
  Injectable,
  Inject,
  OnModuleInit,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { firstValueFrom } from "rxjs";

interface DoctorServiceGrpc {
  GetDoctorByEmail(data: { email: string }): any;
  UpdateRefreshToken(data: { id: number; refreshToken: string }): any;
  ClearRefreshToken(data: { id: number }): any;
}

interface AdminServiceGrpc {
  GetAdminByEmail(data: { email: string }): any;
  UpdateRefreshToken(data: { id: number; refreshToken: string }): any;
  ClearRefreshToken(data: { id: number }): any;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private doctorService: DoctorServiceGrpc;
  private adminService: AdminServiceGrpc;

  constructor(
    @Inject("DOCTOR_SERVICE") private doctorClient: ClientGrpc,
    @Inject("ADMIN_SERVICE") private adminClient: ClientGrpc,
    private readonly jwtService: JwtService
  ) {}

  onModuleInit() {
    this.doctorService =
      this.doctorClient.getService<DoctorServiceGrpc>("DoctorService");
    this.adminService =
      this.adminClient.getService<AdminServiceGrpc>("AdminService");
  }

  async loginDoctor(email: string, password: string) {
    try {
      const doctorResponse = (await firstValueFrom(
        this.doctorService.GetDoctorByEmail({ email })
      )) as any;

      if (!doctorResponse || !doctorResponse.id) {
        throw new UnauthorizedException("Doctor not found");
      }

      const doctor = doctorResponse;
      console.log(doctor);

      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid password");
      }

      if (!doctor.isActive) {
        throw new UnauthorizedException("Invalid password");
      }

      const { accessToken, refreshToken } = await this.generateTokens({
        id: doctor.id,
        email: doctor.email,
        role: doctor.role,
        fullName: doctor.fullName,
        isActive: doctor.isActive,
      });

      // Database ga refresh token saqlash
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
      await firstValueFrom(
        this.doctorService.UpdateRefreshToken({
          id: doctor.id,
          refreshToken: hashedRefreshToken,
        })
      );

      return {
        success: true,
        message: "Doctor login successful",
        accessToken,
        refreshToken,
        user: {
          id: doctor.id,
          email: doctor.email,
          fullName: doctor.fullName,
          isActive: doctor.isActive,
          role: doctor.role,
        },
      };
    } catch (error) {
      console.error(" Doctor login error:", error.message);
      throw new UnauthorizedException("Invalid doctor credentials");
    }
  }

  async loginAdmin(email: string, password: string) {
    try {
      console.log("Searching admin with email:", email);
      const adminResponse = (await firstValueFrom(
        this.adminService.GetAdminByEmail({ email })
      )) as any;
      console.log("Admin response:", adminResponse);
      if (!adminResponse || !adminResponse.id) {
        throw new UnauthorizedException("Admin not found");
      }
      const admin = adminResponse;
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid password");
      }
      if (!admin.isActive) {
        throw new UnauthorizedException("Invalid password");
      }
      const { accessToken, refreshToken } = await this.generateTokens({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName,
        isActive: admin.isActive,
      });
      // Database ga refresh token saqlash
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
      await firstValueFrom(
        this.adminService.UpdateRefreshToken({
          id: admin.id,
          refreshToken: hashedRefreshToken,
        })
      );
      return {
        success: true,
        message: "Admin login successful",
        accessToken,
        refreshToken,
        user: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          isActive: admin.isActive,
          role: admin.role,
        },
      };
    } catch (error) {
      console.error("Admin login error:", error.message);
      throw new UnauthorizedException("Invalid admin credentials");
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      isActive: user.isActive,
    };
    console.log("Generating tokens for:", payload);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      // Generate new tokens
      const tokens = await this.generateTokens(payload);

      return {
        success: true,
        message: "Tokens refreshed successfully",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          fullName: payload.fullName,
          isActive: payload.isActive,
        },
      };
    } catch (error) {
      console.error("Refresh token error:", error.message);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      return {
        valid: true,
        message: "Token is valid",
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          fullName: payload.fullName,
          isActive: payload.isActive,
        },
      };
    } catch (error) {
      console.error("Token validation error:", error.message);
      return {
        valid: false,
        message: "Invalid token",
        user: null,
      };
    }
  }

  // Logout methodlari
  async logoutDoctor(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException("Refresh token topilmadi");
      }

      // Token ni verify qilamiz
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      // Database dan refresh token ni o'chiramiz
      await firstValueFrom(
        this.doctorService.ClearRefreshToken({
          id: payload.id,
        })
      );

      return {
        success: true,
        message: "Doctor muvaffaqiyatli logout qilindi",
      };
    } catch (error) {
      console.error("Doctor logout error:", error.message);
      throw new BadRequestException("Logout jarayonida xatolik yuz berdi");
    }
  }

  async logoutAdmin(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException("Refresh token topilmadi");
      }

      // Token ni verify qilamiz
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      // Database dan refresh token ni o'chiramiz
      await firstValueFrom(
        this.adminService.ClearRefreshToken({
          id: payload.id,
        })
      );

      return {
        success: true,
        message: "Admin muvaffaqiyatli logout qilindi",
      };
    } catch (error) {
      console.error("Admin logout error:", error.message);
      throw new BadRequestException("Logout jarayonida xatolik yuz berdi");
    }
  }
}
