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
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CharacterArticleModule } from './modules/article/character-article/character-article.module';
import { EmailModule } from './modules/email/email.module';
import { UsersModule } from './modules/users/users.module';
import { RaceArticleModule } from './modules/article/race-article/race-article.module';
import { UserCollectionModule } from './modules/user-collection/user-collection.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Подключение планировщика задач
    ScheduleModule.forRoot(),
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
    RaceArticleModule,
    UserCollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
