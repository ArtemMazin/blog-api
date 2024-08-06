import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterArticleService } from './character-article.service';
import { CharacterArticleController } from './character-article.controller';
import { UsersModule } from '../users/users.module';
import {
  CharacterArticle,
  CharacterArticleSchema,
} from 'src/schemas/character.schema';

import {
  BaseArticle,
  BaseArticleSchema,
} from 'src/schemas/base-article.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { articleImageOptions } from 'src/config/multer.config';
import { AuthorGuard } from 'src/guards/author.guard';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: BaseArticle.name,
        useFactory: () => {
          const schema = BaseArticleSchema;
          schema.discriminator(CharacterArticle.name, CharacterArticleSchema);
          return schema;
        },
      },
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
