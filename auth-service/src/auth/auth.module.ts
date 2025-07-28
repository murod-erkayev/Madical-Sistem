import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JwtModule } from "@nestjs/jwt";
import { join } from "path";
import { AuthService } from "./auth.service";
import { AuthGrpcController } from "./auth.controller";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY || "AccessSecretKey",
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME || "15h" },
    }),
    ClientsModule.register([
      {
        name: "DOCTOR_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "doctor",
          protoPath: join(__dirname, "../../../proto/doctor.proto"),
          url: `localhost:50051`, //test uchun yozb turamiz
        },
      },
      {
        name: "ADMIN_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "admin",
          protoPath: join(__dirname, "../../../proto/admin.proto"),
          url: `localhost:50053`,
        },
      },
    ]),
  ],
  controllers: [AuthGrpcController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
