from core.enum import PermissionEnum

default_roles = [
    {
        'name': 'Super Admin',
        'permissions': list(PermissionEnum),
        'description': 'Full system access with all permissions',
        'is_active': True
    },
    {
        'name': 'Admin',
        'permissions':
            [PermissionEnum.CREATE_USER,
             PermissionEnum.VIEW_USER,
             PermissionEnum.EDIT_USER,
             PermissionEnum.DELETE_USER,
             PermissionEnum.MANAGE_ROLES,
             PermissionEnum.VIEW_REPORTS,
             PermissionEnum.GENERATE_REPORTS, ],
        'description': 'Administrative access with user and role management',
        'is_active': True
    },
    {
        'name': 'Manager',
        'permissions':
            [PermissionEnum.VIEW_USER, PermissionEnum.CREATE_CONTENT, PermissionEnum.EDIT_CONTENT,
             PermissionEnum.DELETE_CONTENT, PermissionEnum.VIEW_REPORTS, ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Employee',
        'permissions':
            [PermissionEnum.VIEW_USER, PermissionEnum.CREATE_CONTENT, PermissionEnum.EDIT_CONTENT,
             PermissionEnum.DELETE_CONTENT, PermissionEnum.VIEW_REPORTS, ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Customer',
        'permissions':
            [PermissionEnum.PRODUCT_LIST, PermissionEnum.PRODUCT_DETAILS,PermissionEnum.PRODUCT_VIEW ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Visitor',
        'permissions':
            [PermissionEnum.VIEW_USER, PermissionEnum.CREATE_CONTENT, PermissionEnum.EDIT_CONTENT,
             PermissionEnum.DELETE_CONTENT, PermissionEnum.VIEW_REPORTS, ],
        'description': 'customer who are not logged in yet. ',
        'is_active': True
    }
]
