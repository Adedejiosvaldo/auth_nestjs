import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  //   @Prop()
  _id: string;
  //
  @Prop({ enum: Role, default: Role.User })
  role: Role;
}

export const userSchema = SchemaFactory.createForClass(User);
