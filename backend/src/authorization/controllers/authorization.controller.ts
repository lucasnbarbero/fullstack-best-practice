import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { PermissionsService } from '../services/permissions.service';
import { CreateRoleDto, CreatePermissionDto, AssignPermissionsDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { RoleType } from '../entities/role.entity';

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller('authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthorizationController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  // ==================== ROLES ====================

  @Get('roles')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({ status: 200, description: 'Lista de roles obtenida' })
  async findAllRoles() {
    return this.rolesService.findAll();
  }

  @Get('roles/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({ status: 200, description: 'Rol encontrado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async findOneRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post('roles')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El rol ya existe' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Post('roles/:id/permissions')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Asignar permisos a un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({ status: 200, description: 'Permisos asignados exitosamente' })
  @ApiResponse({ status: 404, description: 'Rol o permisos no encontrados' })
  async assignPermissionsToRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, assignPermissionsDto.permissions);
  }

  @Delete('roles/:roleId/permissions/:permissionName')
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover un permiso de un rol' })
  @ApiParam({ name: 'roleId', description: 'ID del rol' })
  @ApiParam({ name: 'permissionName', description: 'Nombre del permiso' })
  @ApiResponse({ status: 200, description: 'Permiso removido exitosamente' })
  async removePermissionFromRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionName') permissionName: string,
  ) {
    return this.rolesService.removePermission(roleId, permissionName);
  }

  @Delete('roles/:id')
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({ status: 204, description: 'Rol eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.delete(id);
  }

  // ==================== PERMISSIONS ====================

  @Get('permissions')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los permisos' })
  @ApiResponse({ status: 200, description: 'Lista de permisos obtenida' })
  async findAllPermissions() {
    return this.permissionsService.findAll();
  }

  @Get('permissions/module/:module')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener permisos por módulo' })
  @ApiParam({ name: 'module', description: 'Nombre del módulo' })
  @ApiResponse({ status: 200, description: 'Lista de permisos del módulo' })
  async findPermissionsByModule(@Param('module') module: string) {
    return this.permissionsService.findByModule(module);
  }

  @Get('permissions/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({ status: 200, description: 'Permiso encontrado' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  async findOnePermission(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.findOne(id);
  }

  @Post('permissions')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({ status: 201, description: 'Permiso creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El permiso ya existe' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Delete('permissions/:id')
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un permiso' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({ status: 204, description: 'Permiso eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  async deletePermission(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.delete(id);
  }
}
