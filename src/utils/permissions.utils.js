export const hasPermission = (compare = []) => {
  if (hasPermission?.userPermissions?.includes('role:ultron')) return true;
  if (compare.length === 0) return false;

  return hasPermission?.userPermissions?.some((userPermission) =>
    compare.some((comparePermission) => userPermission === comparePermission)
  );
};

export const buildPermissions = (userData = {}) => {
  const { callings = [], organizations = [], roles = [], permissions: userPermissions = [] } = userData;
  const permissions = [];

  const construct = (title, group) => {
    group.forEach((item) => {
      const prefix = title ? `${title}:` : '';
      if (item) permissions.push(`${prefix}${item.replace(' ', '_')}`.toLowerCase());
    });
  };

  construct('calling', callings);
  construct('org', organizations);
  construct('role', roles);
  construct('', userPermissions);

  hasPermission.userPermissions = permissions;
  return permissions;
};
