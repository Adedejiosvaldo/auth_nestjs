import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  //   @Prop()
  _id: string;
}

export const userSchema = SchemaFactory.createForClass(User);
