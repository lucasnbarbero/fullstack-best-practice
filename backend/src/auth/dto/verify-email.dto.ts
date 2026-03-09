import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'token-de-verificacion' })
  @IsString({ message: 'El token debe ser un texto' })
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;
}
