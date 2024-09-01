import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      return ret;
    },
  },
  discriminatorKey: 'kind',
})
export class User extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  favorite_articles: string[];

  @Prop({ default: '', trim: true })
  avatar: string;

  @Prop({ default: '', trim: true })
  about: string;

  @Prop({ default: '', trim: true })
  resetPasswordToken: string;

  @Prop({ type: Date })
  resetPasswordExpires: Date;

  @Prop({ default: false })
  isPremium: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
