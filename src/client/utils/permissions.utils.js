export function hasPermission(user = [], compare = []) {
    // no permission is passed
    if (compare.length === 0) return true;

    return user.some(userPermission => (
        compare.some(comparePermission => userPermission === comparePermission)
    ));
}
