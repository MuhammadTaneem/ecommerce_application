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
        'permissions': [],
        'description': 'Administrative access with user and role management',
        'is_active': True
    },
    {
        'name': 'Manager',
        'permissions':
            [
                # Product
                PermissionEnum.PRODUCT_LIST, PermissionEnum.PRODUCT_DETAILS, PermissionEnum.PRODUCT_CREATE,
                PermissionEnum.PRODUCT_DETAILS,
                # category
                PermissionEnum.CATEGORY_LIST_VIEW, PermissionEnum.CATEGORY_CREATE, PermissionEnum.CATEGORY_UPDATE

            ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Employee',
        'permissions':
            [
                # Product
                PermissionEnum.PRODUCT_LIST, PermissionEnum.PRODUCT_DETAILS, PermissionEnum.PRODUCT_CREATE,
                PermissionEnum.PRODUCT_DETAILS,
                # category
                PermissionEnum.CATEGORY_LIST_VIEW
            ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Customer',
        'permissions':
            [
                # Product
                PermissionEnum.PRODUCT_LIST, PermissionEnum.PRODUCT_DETAILS,
                # category
                PermissionEnum.CATEGORY_LIST_VIEW,

            ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Visitor',
        'permissions': [],
        'description': 'customer who are not logged in yet. ',
        'is_active': True
    }
]
