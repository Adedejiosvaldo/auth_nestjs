import { IsNotEmpty } from 'class-validator';

export class GoogleDTO {
  @IsNotEmpty()
  token: string;
}
