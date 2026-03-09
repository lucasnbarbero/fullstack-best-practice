import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, Permission } from './entities';
import { RolesService, PermissionsService } from './services';
import { AuthorizationController } from './controllers';
import { RolesGuard, PermissionsGuard } from './guards';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [AuthorizationController],
  providers: [RolesService, PermissionsService, RolesGuard, PermissionsGuard],
  exports: [RolesService, PermissionsService, RolesGuard, PermissionsGuard],
})
export class AuthorizationModule implements OnModuleInit {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async onModuleInit() {
    // Seed de permisos y roles al iniciar
    await this.permissionsService.seedPermissions();
    await this.rolesService.seedRoles();
    await this.assignDefaultPermissions();
  }

  private async assignDefaultPermissions() {
    const roles = await this.rolesService.findAll();
    const allPermissions = await this.permissionsService.findAll();

    for (const role of roles) {
      let permissionsToAssign: string[] = [];

      switch (role.name) {
        case 'ADMIN':
          // Admin tiene todos los permisos
          permissionsToAssign = allPermissions.map((p) => p.name);
          break;
        case 'MODERATOR':
          // Moderador tiene permisos de lectura y actualización
          permissionsToAssign = allPermissions
            .filter((p) => p.name.includes(':read') || p.name.includes(':update'))
            .map((p) => p.name);
          break;
        case 'USER':
          // Usuario solo tiene permisos de lectura básicos
          permissionsToAssign = ['users:read'];
          break;
      }

      if (permissionsToAssign.length > 0 && role.permissions.length === 0) {
        await this.rolesService.assignPermissions(role.id, permissionsToAssign);
      }
    }
  }
}
