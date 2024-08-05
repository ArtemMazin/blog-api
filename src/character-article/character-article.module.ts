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
    UsersModule,
  ],
  controllers: [CharacterArticleController],
  providers: [CharacterArticleService],
  exports: [CharacterArticleService],
})
export class CharacterArticleModule {}
