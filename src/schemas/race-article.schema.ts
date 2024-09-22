import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseArticle } from './base-article.schema';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      if (ret.knownRepresentatives) {
        ret.knownRepresentatives = ret.knownRepresentatives.map((rep) => ({
          _id: rep._id.toString(),
          name: rep.name,
        }));
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
    type: [
      {
        _id: { type: Types.ObjectId, ref: 'CharacterArticle' },
        name: String,
      },
    ],
    default: [],
  })
  knownRepresentatives: { _id: Types.ObjectId; name: string }[];
}

export const RaceArticleSchema = SchemaFactory.createForClass(RaceArticle);
