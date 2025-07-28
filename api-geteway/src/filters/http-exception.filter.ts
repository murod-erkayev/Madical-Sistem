import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 📋 Error logging
    this.logger.error(`❌ Status: ${this.getStatus(exception)}`);
    this.logger.error(
      `🧨 Error: ${JSON.stringify({
        message: exception.message,
        details: exception.details,
        code: exception.code,
      })}`
    );
    this.logger.error(`🛣️ Path: ${request.url}`);

    // 🔐 JWT/Auth Errors (Guard errors)
    if (exception instanceof UnauthorizedException) {
      return response.status(401).json({
        statusCode: 401,
        message: exception.message || "Unauthorized",
        error: "Unauthorized",
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (exception instanceof ForbiddenException) {
      return response.status(403).json({
        statusCode: 403,
        message: exception.message || "Forbidden",
        error: "Forbidden",
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // 🚀 gRPC Errors (Microservice errors)
    if (exception.code !== undefined) {
      const errorMessage = exception.details || exception.message || "";

      // Phone number conflict
      if (
        errorMessage.includes("Phone number already exists") ||
        errorMessage.includes("phoneNumber")
      ) {
        return response.status(409).json({
          statusCode: 409,
          message: "Phone number already exists",
          error: "Conflict",
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }

      // Email conflict
      if (
        errorMessage.includes("Email already exists") ||
        errorMessage.includes("email")
      ) {
        return response.status(409).json({
          statusCode: 409,
          message: "Email already exists",
          error: "Conflict",
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }

      // Not found errors
      if (
        errorMessage.includes("Doctor not found") ||
        errorMessage.includes("not found")
      ) {
        return response.status(404).json({
          statusCode: 404,
          message: "Resource not found",
          error: "Not Found",
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }

      // Other gRPC errors
      return response.status(400).json({
        statusCode: 400,
        message: errorMessage || "Microservice error",
        error: "Bad Request",
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // 🌐 HTTP Exceptions (NestJS built-in)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        message:
          typeof exceptionResponse === "object" ?
            (exceptionResponse as any).message || exception.message
          : exception.message,
        error: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // 💥 Unknown/Internal errors
    this.logger.error(`🔥 Unhandled exception:`, exception);

    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: "Internal Server Error",
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getStatus(exception: any): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    if (exception.code !== undefined) {
      return 400; // gRPC errors
    }
    return 500; // Unknown errors
  }
}
