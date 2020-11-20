import { IsNumber, IsString } from 'class-validator';

export class DialCodeDto {
  @IsString()
  readonly label!: string;

  @IsString()
  readonly value!: string;
}

export class NuxtError {
  @IsString()
  readonly message?: string;

  @IsString()
  readonly path?: string;

  @IsNumber()
  readonly statusCode?: number;
}
