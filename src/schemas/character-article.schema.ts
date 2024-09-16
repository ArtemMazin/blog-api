import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseArticle } from './base-article.schema';
import { RaceArticle } from './race-article.schema';

@Schema({
  timestamps: true,
  toObject: {
    // Преобразование _id в строку, иначе при вызове plainToClass _id меняет значение
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
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

  @Prop({ type: Types.ObjectId, ref: 'RaceArticle', required: true })
  race: RaceArticle;

  @Prop({ required: true, enum: ['Мужской', 'Женский', 'Другое'] })
  gender: string;

  @Prop({ type: String })
  height: string;

  @Prop({ required: true })
  homeWorld: string;
}

export const CharacterArticleSchema =
  SchemaFactory.createForClass(CharacterArticle);
