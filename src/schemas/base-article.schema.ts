import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

//Это говорит Mongoose использовать поле kind для различения типов документов
@Schema({ timestamps: true, discriminatorKey: 'kind' })
export class BaseArticle extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ default: 0 })
  readingTime: number;
}

export const BaseArticleSchema = SchemaFactory.createForClass(BaseArticle);
