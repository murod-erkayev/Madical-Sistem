import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports:[
    ClientsModule.register([
      {
        name:"AUTH_SERVICE",
        transport:Transport.GRPC,
        options:{
          package:"auth",
          protoPath:join(__dirname, "../../../proto/auth.proto"),
          url:"localhost:50054", // hard code test uchun yoib turman 
        }
      },
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}
