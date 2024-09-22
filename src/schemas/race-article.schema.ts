import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseArticle } from './base-article.schema';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  toObject: {
    // Преобразование _id в строку, иначе при вызове plainToClass _id меняет значение
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      if (ret.knownRepresentatives) {
        ret.knownRepresentatives = ret.knownRepresentatives.map((_id) =>
          _id.toString(),
        );
      }
      return ret;
    },
  },
})
export class RaceArticle extends BaseArticle {
  @Prop({ required: true })
  raceName: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  skinColor: string;

  @Prop({ type: [String], required: true })
  distinctiveFeatures: string[];

  @Prop({ required: true })
  homeWorld: string;

  @Prop({ required: true })
  language: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'CharacterArticle' }],
    default: [],
  })
  knownRepresentatives: Types.ObjectId[];
}

export const RaceArticleSchema = SchemaFactory.createForClass(RaceArticle);
