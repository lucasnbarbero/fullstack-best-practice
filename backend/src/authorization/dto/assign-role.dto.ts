import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleType } from '../entities/role.entity';

export class AssignRoleDto {
  @ApiProperty({
    description: 'Rol a asignar al usuario',
    enum: RoleType,
    example: RoleType.MODERATOR,
  })
  @IsEnum(RoleType, { message: 'El tipo de rol no es válido' })
  role: RoleType;
}
