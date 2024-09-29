import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { CharacterArticle } from './character-article.schema';

@Schema({
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      if (ret.characters) {
        ret.characters = ret.characters.map((char) => char.toString());
      }
      return ret;
    },
  },
})
export class UserCollection extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'CharacterArticle' }],
    default: [],
  })
  characters: CharacterArticle[];

  @Prop({ type: Date, default: Date.now })
  lastRollDate: Date;

  @Prop({ type: Number, default: 0 })
  rollsToday: number;
}

export const UserCollectionSchema =
  SchemaFactory.createForClass(UserCollection);
