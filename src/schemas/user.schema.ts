import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
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

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  @IsOptional()
  resetPasswordToken: string;

  @Prop()
  @IsOptional()
  resetPasswordExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
