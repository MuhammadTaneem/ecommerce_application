from core.Utiilties.enum import PermissionEnum

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
                PermissionEnum.product_list, PermissionEnum.product_details, PermissionEnum.product_create,
                PermissionEnum.product_details,
                # category
                PermissionEnum.category_list_view, PermissionEnum.category_create, PermissionEnum.category_update

            ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Employee',
        'permissions':
            [
                # Product
                PermissionEnum.product_list, PermissionEnum.product_details, PermissionEnum.product_create,
                PermissionEnum.product_details,
                # category
                PermissionEnum.category_list_view
            ],
        'description': 'Man ',
        'is_active': True
    },
    {
        'name': 'Customer',
        'permissions':
            [
                # Product
                PermissionEnum.product_list, PermissionEnum.product_details,
                # category
                PermissionEnum.category_list_view,

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
