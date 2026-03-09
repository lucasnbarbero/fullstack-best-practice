import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { Role } from '../../authorization/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verification_token', nullable: true, type: 'varchar' })
  @Exclude()
  emailVerificationToken: string | null;

  @Column({ name: 'password_reset_token', nullable: true, type: 'varchar' })
  @Exclude()
  passwordResetToken: string | null;

  @Column({ name: 'password_reset_expires', nullable: true, type: 'timestamp' })
  @Exclude()
  passwordResetExpires: Date | null;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  hasRole(roleName: string): boolean {
    return this.roles?.some((r) => r.name === roleName) ?? false;
  }

  hasPermission(permissionName: string): boolean {
    return this.roles?.some((r) => r.hasPermission(permissionName)) ?? false;
  }

  hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some((role) => this.hasRole(role));
  }

  hasAnyPermission(permissionNames: string[]): boolean {
    return permissionNames.some((permission) => this.hasPermission(permission));
  }
}
