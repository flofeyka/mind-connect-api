import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  app.useGlobalPipes(new ValidationPipe({whitelist: true, skipUndefinedProperties: true, forbidNonWhitelisted: true}));

  const config: Omit<OpenAPIObject, any> = new DocumentBuilder()
  .setTitle("MindConnect API Documentation")
  .setVersion("1.0")
  .build();

  const documentFactory: () => OpenAPIObject = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, documentFactory);
  await app.listen(3000);
}
bootstrap();
