let userPermissions = [];

export const hasPermission = (compare = []) => {
  if (userPermissions.includes('role:ultron')) return true;
  if (compare.length === 0) return false;

  return userPermissions.some((userPermission) =>
    compare.some((comparePermission) => userPermission === comparePermission)
  );
};

export const buildPermissions = (userData = {}) => {
  const { callings = [], organizations = [], roles = [] } = userData;
  const permissions = [];

  const construct = (title, group) => {
    group.forEach((item) => {
      if (item) permissions.push(`${title}:${item.replace(' ', '_')}`.toLowerCase());
    });
  };

  construct('calling', callings);
  construct('org', organizations);
  construct('role', roles);

  userPermissions = permissions;
  return permissions;
};
