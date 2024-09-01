import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

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
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  favorite_articles: string[];

  @Prop()
  @IsOptional()
  avatar: string;

  @Prop()
  @IsOptional()
  about: string;

  @Prop()
  @IsOptional()
  resetPasswordToken: string;

  @Prop()
  @IsOptional()
  resetPasswordExpires: Date;

  @Prop({ default: false })
  isPremium: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
