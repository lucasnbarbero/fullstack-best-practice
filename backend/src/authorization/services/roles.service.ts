import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role, RoleType } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return role;
  }

  async findByName(name: RoleType): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  async findByNames(names: RoleType[]): Promise<Role[]> {
    return this.roleRepository.find({
      where: { name: In(names) },
      relations: ['permissions'],
    });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.findByName(createRoleDto.name);

    if (existingRole) {
      throw new ConflictException(`El rol ${createRoleDto.name} ya existe`);
    }

    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);

    this.logger.log(`Rol creado: ${role.name}`);
    return role;
  }

  async assignPermissions(roleId: string, permissionNames: string[]): Promise<Role> {
    const role = await this.findOne(roleId);

    const permissions = await this.permissionRepository.find({
      where: { name: In(permissionNames) },
    });

    if (permissions.length !== permissionNames.length) {
      const foundNames = permissions.map((p) => p.name);
      const notFound = permissionNames.filter((n) => !foundNames.includes(n));
      throw new NotFoundException(
        `Los siguientes permisos no existen: ${notFound.join(', ')}`,
      );
    }

    role.permissions = permissions;
    await this.roleRepository.save(role);

    this.logger.log(
      `Permisos asignados al rol ${role.name}: ${permissionNames.join(', ')}`,
    );
    return role;
  }

  async removePermission(roleId: string, permissionName: string): Promise<Role> {
    const role = await this.findOne(roleId);

    role.permissions = role.permissions.filter((p) => p.name !== permissionName);
    await this.roleRepository.save(role);

    this.logger.log(`Permiso ${permissionName} removido del rol ${role.name}`);
    return role;
  }

  async delete(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
    this.logger.log(`Rol eliminado: ${role.name}`);
  }

  async getDefaultRole(): Promise<Role> {
    let defaultRole = await this.findByName(RoleType.USER);

    if (!defaultRole) {
      defaultRole = await this.create({
        name: RoleType.USER,
        description: 'Usuario estándar con permisos básicos',
      });
    }

    return defaultRole;
  }

  async seedRoles(): Promise<void> {
    const roles = [
      {
        name: RoleType.ADMIN,
        description: 'Administrador con acceso total al sistema',
      },
      {
        name: RoleType.MODERATOR,
        description: 'Moderador con permisos de gestión limitados',
      },
      {
        name: RoleType.USER,
        description: 'Usuario estándar con permisos básicos',
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.findByName(roleData.name);
      if (!existingRole) {
        await this.create(roleData);
        this.logger.log(`Rol ${roleData.name} creado durante el seeding`);
      }
    }
  }
}
