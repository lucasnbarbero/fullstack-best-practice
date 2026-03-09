import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { RoleType } from '../entities/role.entity';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    enum: RoleType,
    example: RoleType.USER,
  })
  @IsEnum(RoleType, { message: 'El tipo de rol no es válido' })
  name: RoleType;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario estándar con permisos básicos',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  @MaxLength(255, { message: 'La descripción no puede exceder los 255 caracteres' })
  description?: string;
}
