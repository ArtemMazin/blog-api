import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseArticle } from './base-article.schema';

@Schema()
export class CharacterArticle extends BaseArticle {
  @Prop({ required: true })
  characterName: string;

  @Prop({ type: String })
  birthDate: string;

  @Prop({ type: String })
  deathDate: string;

  @Prop({ required: true })
  race: string;

  @Prop({ required: true, enum: ['Мужской', 'Женский', 'Другое'] })
  gender: string;

  @Prop({ type: Number })
  height: number;

  @Prop({ required: true })
  homeWorld: string;
}

export const CharacterArticleSchema =
  SchemaFactory.createForClass(CharacterArticle);
