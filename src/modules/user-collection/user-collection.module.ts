import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCollectionService } from './user-collection.service';
import { UserCollectionController } from './user-collection.controller';
import {
  UserCollection,
  UserCollectionSchema,
} from 'src/schemas/user-collection';
import {
  CharacterArticle,
  CharacterArticleSchema,
} from 'src/schemas/character-article.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCollection.name, schema: UserCollectionSchema },
      { name: CharacterArticle.name, schema: CharacterArticleSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UserCollectionController],
  providers: [UserCollectionService],
  exports: [UserCollectionService],
})
export class UserCollectionModule {}
