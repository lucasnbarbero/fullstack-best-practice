import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Lista de nombres de permisos a asignar',
    example: ['users:read', 'users:update'],
    type: [String],
  })
  @IsArray({ message: 'Los permisos deben ser un array' })
  @IsString({ each: true, message: 'Cada permiso debe ser un string' })
  permissions: string[];
}
