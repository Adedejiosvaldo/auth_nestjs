import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Coffee extends Document {
  // Declaring types
  @Prop({ type: mongoose.SchemaTypes.String, index: true })
  name: string;

  @Prop()
  brand: string;

  @Prop([String])
  flavors: string[];

  //   Events
  @Prop({ default: 0 })
  recommendations: number;
}
export const coffeeSchema = SchemaFactory.createForClass(Coffee);
