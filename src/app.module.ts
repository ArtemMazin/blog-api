import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payment/payment.module';
import { CharacterArticleModule } from './character-article/character-article.module';
import { EmailModule } from './email/email.module';
import { BaseArticle, BaseArticleSchema } from './schemas/base-article.schema';

@Module({
  imports: [
    // Настройка статических файлов
    ServeStaticModule.forRoot({
      rootPath:
        process.env.NODE_ENV === 'production'
          ? process.env.UPLOAD_ROOT_PATH
          : join(__dirname, '..', '..', process.env.UPLOAD_ROOT_PATH),
      serveRoot: process.env.SERVE_ROOT,
    }),
    // Загрузка конфигурации
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    // Подключение к MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      {
        name: BaseArticle.name,
        schema: BaseArticleSchema,
      },
    ]),
    // Настройка ограничения запросов
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    // Настройка почтового модуля
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // изменить в продакшене
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        }, // удалить в продакшене
      },
      template: {
        dir: join(__dirname, '..', '..', 'templates'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    // Подключение модулей
    UsersModule,
    AuthModule,
    PaymentModule,
    CharacterArticleModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
