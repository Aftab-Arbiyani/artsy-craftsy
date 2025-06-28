import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: false,
  });

  const port = process.env.PORT || 4008;
  app.setGlobalPrefix('api');
  app.enableCors();
  app.enable('trust proxy', true);
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(compression({ threshold: 512 }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(+port);
}
bootstrap();
