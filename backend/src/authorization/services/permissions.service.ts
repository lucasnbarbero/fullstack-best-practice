import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({ relations: ['roles'] });
  }

  async findByModule(module: string): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { module },
      relations: ['roles'],
    });
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    return permission;
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { name },
      relations: ['roles'],
    });
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission = await this.findByName(createPermissionDto.name);

    if (existingPermission) {
      throw new ConflictException(
        `El permiso ${createPermissionDto.name} ya existe`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    await this.permissionRepository.save(permission);

    this.logger.log(`Permiso creado: ${permission.name}`);
    return permission;
  }

  async delete(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
    this.logger.log(`Permiso eliminado: ${permission.name}`);
  }

  async seedPermissions(): Promise<void> {
    const permissions = [
      // Permisos de usuarios
      { name: 'users:read', description: 'Ver usuarios', module: 'users' },
      { name: 'users:create', description: 'Crear usuarios', module: 'users' },
      { name: 'users:update', description: 'Actualizar usuarios', module: 'users' },
      { name: 'users:delete', description: 'Eliminar usuarios', module: 'users' },
      
      // Permisos de roles
      { name: 'roles:read', description: 'Ver roles', module: 'roles' },
      { name: 'roles:create', description: 'Crear roles', module: 'roles' },
      { name: 'roles:update', description: 'Actualizar roles', module: 'roles' },
      { name: 'roles:delete', description: 'Eliminar roles', module: 'roles' },
      { name: 'roles:assign', description: 'Asignar roles a usuarios', module: 'roles' },
      
      // Permisos de permisos
      { name: 'permissions:read', description: 'Ver permisos', module: 'permissions' },
      { name: 'permissions:create', description: 'Crear permisos', module: 'permissions' },
      { name: 'permissions:delete', description: 'Eliminar permisos', module: 'permissions' },
    ];

    for (const permissionData of permissions) {
      const existingPermission = await this.findByName(permissionData.name);
      if (!existingPermission) {
        await this.create(permissionData);
        this.logger.log(`Permiso ${permissionData.name} creado durante el seeding`);
      }
    }
  }
}
