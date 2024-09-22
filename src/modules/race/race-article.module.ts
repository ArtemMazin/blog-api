import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RaceArticleController } from './race-article.controller';
import { UsersModule } from '../users/users.module';
import {
  RaceArticle,
  RaceArticleSchema,
} from 'src/schemas/race-article.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { articleImageOptions } from 'src/config/multer.config';
import { AuthorGuard } from 'src/guards/author.guard';
import { RaceArticleService } from './race-article.service';
import { CharacterArticleModule } from '../character-article/character-article.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RaceArticle.name, schema: RaceArticleSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({ storage: articleImageOptions.storage }),
    UsersModule,
    CharacterArticleModule,
  ],
  controllers: [RaceArticleController],
  providers: [
    RaceArticleService,
    {
      provide: 'IArticleService',
      useClass: RaceArticleService,
    },
    AuthorGuard,
  ],
  exports: [RaceArticleService],
})
export class RaceArticleModule {}
