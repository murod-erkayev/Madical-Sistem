import { Injectable, Inject, OnModuleInit, Logger } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { LoginDto, LogoutDto, RefreshTokenDto } from "./dto/create-auth.dto";
interface AuthServiceGrpc {
  LoginDoctor(data: LoginDto): Observable<any>;
  LoginAdmin(data: LoginDto): Observable<any>;
  RefreshToken(data: RefreshTokenDto): Observable<any>;
  LogoutDoctor(data: LogoutDto): Observable<any>;
  LogoutAdmin(data: LogoutDto): Observable<any>;
}
@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private authService: AuthServiceGrpc;
  constructor(@Inject("AUTH_SERVICE") private client: ClientGrpc) {}
  onModuleInit() {
    this.authService = this.client.getService<AuthServiceGrpc>("AuthService");
  }
  loginDoctor(loginDto: LoginDto): Observable<any> {
    return this.authService.LoginDoctor(loginDto);
  }
  loginAdmin(loginDto: LoginDto): Observable<any> {
    return this.authService.LoginAdmin(loginDto);
  }
  refreshToken(refreshTokenDto: RefreshTokenDto): Observable<any> {
    return this.authService.RefreshToken(refreshTokenDto);
  }
  logoutDoctor(logoutDto: LogoutDto): Observable<any> {
    return this.authService.LogoutDoctor(logoutDto);
  }
  logoutAdmin(logoutDto: LogoutDto): Observable<any> {
    return this.authService.LogoutAdmin(logoutDto);
  }
}
