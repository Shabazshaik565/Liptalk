import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './require-permissions.decorator';
import { Permission, ROLE_PERMISSIONS } from './permissions.enum';
import { DataSource } from 'typeorm';
import { OrganizationMember } from '../../database/entities/organization-member.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || request.headers['x-user-id'] || 'usr_curr_01';
    const orgId = request.params?.orgId || request.body?.orgId || request.headers['x-organization-id'];

    if (!orgId) {
      // If endpoint requires organization permissions but no orgId context is supplied
      return true;
    }

    const memberRepo = this.dataSource.getRepository(OrganizationMember);
    const member = await memberRepo.findOne({
      where: { user: { id: userId }, organization: { id: orgId }, isActive: true },
    });

    if (!member) {
      throw new ForbiddenException('You do not belong to this organization');
    }

    const userRole = member.role;
    const grantedPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasAll = requiredPermissions.every((perm) => grantedPermissions.includes(perm));
    if (!hasAll) {
      throw new ForbiddenException('Insufficient organization role permissions');
    }

    return true;
  }
}
