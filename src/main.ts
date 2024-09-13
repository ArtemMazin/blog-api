import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  // Загрузка переменных окружения
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  // Настройка безопасности
  app.use(helmet());

  // Настройка CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://viva-msk-test.online',
      'https://blog-psi-nine-19.vercel.app',
      'https://blog-git-main-artems-projects-3eddffb7.vercel.app',
      'https://blog-lnxb4p3d0-artems-projects-3eddffb7.vercel.app',
      'https://blog-artems-projects-3eddffb7.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Настройка парсера куки
  app.use(cookieParser());

  // Настройка глобальной валидации
  app.useGlobalPipes(new ValidationPipe());

  // Настройка Swagger
  const config = new DocumentBuilder().setTitle('Blog API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Запуск сервера
  await app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}

bootstrap();
