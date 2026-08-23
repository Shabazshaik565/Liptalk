export enum Permission {
  ORG_VIEW = 'org.view',
  ORG_SETTINGS_MANAGE = 'org.settings.manage',
  ORG_MEMBERS_VIEW = 'org.members.view',
  ORG_MEMBERS_MANAGE = 'org.members.manage',
  ORG_TEAMS_MANAGE = 'org.teams.manage',
  ORG_ANALYTICS_VIEW = 'org.analytics.view',
  ORG_OPPORTUNITIES_MANAGE = 'org.opportunities.manage',
  ORG_BILLING_MANAGE = 'org.billing.manage',
  MODERATION_REVIEW = 'moderation.review',
  ADMIN_SYSTEM_MANAGE = 'admin.system.manage',
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  OWNER: [
    Permission.ORG_VIEW,
    Permission.ORG_SETTINGS_MANAGE,
    Permission.ORG_MEMBERS_VIEW,
    Permission.ORG_MEMBERS_MANAGE,
    Permission.ORG_TEAMS_MANAGE,
    Permission.ORG_ANALYTICS_VIEW,
    Permission.ORG_OPPORTUNITIES_MANAGE,
    Permission.ORG_BILLING_MANAGE,
  ],
  ADMIN: [
    Permission.ORG_VIEW,
    Permission.ORG_SETTINGS_MANAGE,
    Permission.ORG_MEMBERS_VIEW,
    Permission.ORG_MEMBERS_MANAGE,
    Permission.ORG_TEAMS_MANAGE,
    Permission.ORG_ANALYTICS_VIEW,
    Permission.ORG_OPPORTUNITIES_MANAGE,
  ],
  MANAGER: [
    Permission.ORG_VIEW,
    Permission.ORG_MEMBERS_VIEW,
    Permission.ORG_TEAMS_MANAGE,
    Permission.ORG_OPPORTUNITIES_MANAGE,
  ],
  MEMBER: [
    Permission.ORG_VIEW,
    Permission.ORG_MEMBERS_VIEW,
  ],
  ANALYST: [
    Permission.ORG_VIEW,
    Permission.ORG_ANALYTICS_VIEW,
  ],
};
