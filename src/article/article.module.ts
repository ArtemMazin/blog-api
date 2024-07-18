import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { ArticlesController } from './article.controller';
import { ArticleService } from './articles.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { articleImageOptions } from 'src/config/multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({ storage: articleImageOptions.storage }),
  ],
  controllers: [ArticlesController],
  providers: [ArticleService],
})
export class ArticleModule {}
