export function hasPermission(user = [], compare = []) {
    // no permission is passed
    if (compare.length === 0) return true;

    return user.some((userPermission) => compare.some((comparePermission) => userPermission === comparePermission));
}

export function buildPermissions(userData) {
    const { callings = [], organizations = [], roles = [] } = userData;
    const permissions = [];
    const construct = (title, group) => {
        group.forEach((item) => {
            if (item) permissions.push(`${title}:${item.replace(' ', '_')}`);
        });
    };

    construct('calling', callings);
    construct('org', organizations);
    construct('role', roles);

    return permissions;
}
