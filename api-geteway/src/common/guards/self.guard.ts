import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class JwtSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new ForbiddenException("Foydalanuvchi aniqlanmadi");
    }

    // String comparison uchun:
    if (req.user.id != req.params.id) {
      throw new ForbiddenException(
        "Faqat o'z ma'lumotlaringizni ko'rishingiz mumkin"
      );
    }

    return true;
  }
}
