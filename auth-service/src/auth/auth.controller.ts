import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthService } from "./auth.service";

@Controller()
export class AuthGrpcController {
  private readonly logger = new Logger(AuthGrpcController.name);

  constructor(private readonly authService: AuthService) {}

  @GrpcMethod("AuthService", "LoginDoctor")
  async loginDoctor(data: { email: string; password: string }) {
    this.logger.log(`Doctor login attempt: ${data.email}`);

    try {
      const result = await this.authService.loginDoctor(
        data.email,
        data.password
      );
      this.logger.log(` Doctor login successful: ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Doctor login failed: ${data.email} - ${error.message}`
      );
      return {
        success: false,
        message: error.message,
        accessToken: "",
        refreshToken: "",
        user: null,
      };
    }
  }

  @GrpcMethod("AuthService", "LoginAdmin")
  async loginAdmin(data: { email: string; password: string }) {
    this.logger.log(`Admin login attempt: ${data.email}`);

    try {
      const result = await this.authService.loginAdmin(
        data.email,
        data.password
      );
      this.logger.log(`Admin login successful: ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Admin login failed: ${data.email} - ${error.message}`
      );
      return {
        success: false,
        message: error.message,
        accessToken: "",
        refreshToken: "",
        user: null,
      };
    }
  }

  @GrpcMethod("AuthService", "RefreshToken")
  async refreshToken(data: { refreshToken: string }) {
    this.logger.log(`Token refresh attempt`);

    try {
      const result = await this.authService.refreshToken(data.refreshToken);
      this.logger.log(`Token refreshed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
        accessToken: "",
        refreshToken: "",
        user: null,
      };
    }
  }

  @GrpcMethod("AuthService", "ValidateToken")
  async validateToken(data: { token: string }) {
    this.logger.log(`🔍 Token validation attempt`);

    try {
      const result = await this.authService.validateToken(data.token);
      return result;
    } catch (error) {
      this.logger.error(`❌ Token validation failed: ${error.message}`);
      return {
        valid: false,
        message: error.message,
        user: null,
      };
    }
  }

  @GrpcMethod("AuthService", "LogoutDoctor")
  async logoutDoctor(data: { refreshToken: string }) {
    this.logger.log(`🚪 Doctor logout attempt`);

    try {
      const result = await this.authService.logoutDoctor(data.refreshToken);
      this.logger.log(`✅ Doctor logout successful`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Doctor logout failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @GrpcMethod("AuthService", "LogoutAdmin")
  async logoutAdmin(data: { refreshToken: string }) {
    this.logger.log(`🚪 Admin logout attempt`);

    try {
      const result = await this.authService.logoutAdmin(data.refreshToken);
      this.logger.log(`✅ Admin logout successful`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Admin logout failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
