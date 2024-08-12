import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterArticleService } from './character-article.service';
import { CharacterArticleController } from './character-article.controller';
import { UsersModule } from '../users/users.module';
import {
  CharacterArticle,
  CharacterArticleSchema,
} from 'src/schemas/character.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { articleImageOptions } from 'src/config/multer.config';
import { AuthorGuard } from 'src/guards/author.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CharacterArticle.name, schema: CharacterArticleSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({ storage: articleImageOptions.storage }),
    UsersModule,
  ],
  controllers: [CharacterArticleController],
  providers: [CharacterArticleService, AuthorGuard],
  exports: [CharacterArticleService],
})
export class CharacterArticleModule {}
