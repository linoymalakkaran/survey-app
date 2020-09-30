export enum RoleName {
  User = 'USER',
  Admin = 'ADMIN',
  Owner = 'OWNER'
}

export class Role {
  constructor(
    public roleName: RoleName,
    public roleTypes: string[],
  ) { }
}

const TokenExpirationTime = (): Number => 3600;

const GetUserRole = (roleName: RoleName) => {
  switch (roleName) {
    case RoleName.Owner:
      return new Role(RoleName.Owner, [RoleName.Owner, RoleName.Admin, RoleName.User]);
    case RoleName.Admin:
      return new Role(RoleName.Owner, [RoleName.Owner, RoleName.Admin, RoleName.User]);
    case RoleName.User:
      return new Role(RoleName.Owner, [ RoleName.User]);
    default:
      return null;
  }
};
export default {
  GetUserRole,
  TokenExpirationTime
};
