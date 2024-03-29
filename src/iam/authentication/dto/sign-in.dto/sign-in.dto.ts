import {
  IsEmail,
  IsNumberString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  //   @IsString()
  @MinLength(10)
  password: string;

  @IsOptional()
  @IsNumberString()
  TfaCode?: string;
}
