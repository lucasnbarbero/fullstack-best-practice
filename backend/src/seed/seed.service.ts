import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role, RoleType } from '../authorization/entities/role.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedAdminUser();
  }

  private async seedRoles() {
    const roles = [
      { name: RoleType.ADMIN, description: 'Administrador del sistema', isDefault: false },
      { name: RoleType.MODERATOR, description: 'Moderador', isDefault: false },
      { name: RoleType.USER, description: 'Usuario estándar', isDefault: true },
    ];

    for (const roleData of roles) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.rolesRepository.create(roleData);
        await this.rolesRepository.save(role);
        this.logger.log(`Rol '${roleData.name}' creado`);
      }
    }
  }

  private async seedAdminUser() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'Variables ADMIN_EMAIL y ADMIN_PASSWORD no configuradas. Seed de admin omitido.',
      );
      return;
    }

    // Verificar si ya existe el usuario admin
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      this.logger.log(`Usuario admin '${adminEmail}' ya existe`);
      return;
    }

    // Obtener rol admin
    const adminRole = await this.rolesRepository.findOne({
      where: { name: RoleType.ADMIN },
    });

    if (!adminRole) {
      this.logger.error('No se encontró el rol ADMIN');
      return;
    }

    // Crear usuario admin
    const saltRounds = parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS') || '10', 10);
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const adminUser = this.usersRepository.create({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      isActive: true,
      isEmailVerified: true,
      roles: [adminRole],
    });

    await this.usersRepository.save(adminUser);
    this.logger.log(`Usuario admin '${adminEmail}' creado exitosamente`);
  }
}
