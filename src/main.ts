import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: true },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config: Omit<OpenAPIObject, any> = new DocumentBuilder()
    .setTitle('MindConnect API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory: () => OpenAPIObject = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory);
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
