import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

//Это говорит Mongoose использовать поле kind для различения типов документов
@Schema({
  timestamps: true,
  toObject: {
    // Преобразование _id в строку, иначе при вызове plainToClass _id меняет значение
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      return ret;
    },
  },
  discriminatorKey: 'kind',
})
export class BaseArticle extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ default: 0 })
  readingTime: number;

  @Prop({ default: 0 })
  likesCount: number;
}

export const BaseArticleSchema = SchemaFactory.createForClass(BaseArticle);
