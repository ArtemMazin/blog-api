import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseArticle } from './base-article.schema';

@Schema({
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      if (ret.race && ret.race._id) {
        ret.race._id = ret.race._id.toString();
      }
      return ret;
    },
  },
})
export class CharacterArticle extends BaseArticle {
  @Prop({ required: true })
  characterName: string;

  @Prop({ type: String })
  birthDate: string;

  @Prop({ type: String })
  deathDate: string;

  @Prop({
    type:
      {
        _id: { type: Types.ObjectId, ref: 'RaceArticle', required: true },
        raceName: { type: String, required: true },
      } || null,
    default: null,
  })
  race: {
    _id: string;
    raceName: string;
  } | null;

  @Prop({ required: true, enum: ['Мужской', 'Женский', 'Другое'] })
  gender: 'Мужской' | 'Женский' | 'Другое';

  @Prop({ type: String })
  height: string;

  @Prop({ required: true })
  homeWorld: string;
}

export const CharacterArticleSchema =
  SchemaFactory.createForClass(CharacterArticle);
