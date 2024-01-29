import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  //   @Prop()
  _id: string;
  //
  @Prop({ enum: Role, default: Role.User })
  role: Role;

  @Prop({ required: false })
  googleID: string;

  @Prop({ default: false })
  isTfaEnable: boolean;

  @Prop({ required: false })
  tfaSecret: string;
}

export const userSchema = SchemaFactory.createForClass(User);
