# core/permissions/constants.py
from enum import Enum


class PermissionEnum(str, Enum):

    #Products
    PRODUCT_LIST = 'product_list'
    PRODUCT_DETAILS = 'product_details'
    PRODUCT_CREATE = 'product_create'
    PRODUCT_UPDATE = 'product_update'
    PRODUCT_DELETE = 'product_delete'
    PRODUCT_VIEW = 'product_view'


    #Orders
    ORDER_LIST = 'order_list'
    ORDER_CREATE = 'order_create'
    ORDER_UPDATE = 'order_update'
    ORDER_DELETE = 'order_delete'
    ORDER_DETAILS_VIEW = 'order_details_view'
    SELF_ORDER_LIST = 'self_order_list'
    SELF_ORDER_CREATE = 'self_order_create'
    SELF_ORDER_UPDATE = 'self_order_update'
    SELF_ORDER_DETAILS_VIEW = 'self_order_details_view'


    # User Management
    CREATE_USER = 'create_user'
    VIEW_USER = 'view_user'
    EDIT_USER = 'edit_user'
    DELETE_USER = 'delete_user'

    # Role Management
    MANAGE_ROLES = 'manage_roles'

    # Content Management
    CREATE_CONTENT = 'create_content'
    EDIT_CONTENT = 'edit_content'
    DELETE_CONTENT = 'delete_content'
    VIEW_CONTENT = 'view_content'

    # Report Management
    VIEW_REPORTS = 'view_reports'
    GENERATE_REPORTS = 'generate_reports'

    @classmethod
    def choices(cls):
        return [(item.value, item.name) for item in cls]

    @classmethod
    def values(cls):
        return [item.value for item in cls]
