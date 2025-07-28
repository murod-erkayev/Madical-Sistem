import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting Auth Service...');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "auth",
        protoPath: join(__dirname, "../../proto/auth.proto"),
        url: `0.0.0.0:${process.env.PORT}`,
      },
    }
  );
  await app.listen();
  console.log('Auth Service is listening on port 50054');
}
bootstrap().catch((error) => {
  console.error('Failed to start Auth Service:', error);
});