import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class ApiKey extends Document {
  @IsString()
  @Prop({ type: String })
  uuid: string;

  @IsString()
  @Prop({ type: String })
  key: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);

ApiKeySchema.index({ user: 1 }, { unique: true });

ApiKeySchema.pre('save', (next) => {
  console.log('saved from pre');
  next();
});

// export default ApiKeySchema;
