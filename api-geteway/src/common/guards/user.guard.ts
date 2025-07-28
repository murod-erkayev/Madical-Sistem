import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    // console.log("Req", req);
    const authHeader =
      req.headers.authorization ||
      req.headers.Authorization ||
      req.get("authorization") ||
      req.get("Authorization");
    console.log("Auth Header:", authHeader);
    console.log("Request URL:", req.url);
    if (!authHeader) {
      throw new UnauthorizedException("Unauthorized");
    }
    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException("Unauthorized");
    }

    async function verify(token: string, jwtService: JwtService) {
      let payload: any;

      try {
        payload = await jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY,
        });
      } catch (error) {
        throw new BadRequestException(error);
      }
      if (!payload) {
        throw new UnauthorizedException("Unauthorized");
      }
      if (!payload.isActive) {
        console.log(payload);
        throw new ForbiddenException("Ruxsat etilmagan");
      }
      req.user = payload;
      return true;
    }
    return verify(token, this.jwtService);
  }
}
