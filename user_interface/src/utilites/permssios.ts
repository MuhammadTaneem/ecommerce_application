export const hasPermission = (userPermissions, requiredPermission) => {
    return userPermissions.includes(requiredPermission);
};
