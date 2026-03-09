import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Nombre único del permiso',
    example: 'users:read',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción del permiso',
    example: 'Permite leer información de usuarios',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @MaxLength(255, { message: 'La descripción no puede exceder los 255 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Módulo al que pertenece el permiso',
    example: 'users',
  })
  @IsString({ message: 'El módulo debe ser un string' })
  @MinLength(2, { message: 'El módulo debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El módulo no puede exceder los 50 caracteres' })
  module: string;
}
