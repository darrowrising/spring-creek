export function groupClassName(group) {
    if (group) {
        return group.split(' ').join('-').toLowerCase();
    }
    return '';
}
