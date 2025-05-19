# core/permissions/constants.py
from enum import Enum


class TokenType(Enum):
    access = "Access"
    reset = "Reset"
    active = "Active"

    def enum_dict(self):
        return {e.value: e.name for e in TokenType}


enum_dict = {e.value: e.name for e in TokenType}


class PermissionEnum(str, Enum):
    # Products
    PRODUCT_LIST = 'product_list'
    PRODUCT_DETAILS = 'product_details'
    PRODUCT_CREATE = 'product_create'
    PRODUCT_UPDATE = 'product_update'
    PRODUCT_DELETE = 'product_delete'

    # also user can make unsafe request
    # product_reviews
    # product_reviews_details

    # Category
    CATEGORY_LIST_VIEW = 'category_list_view'
    CATEGORY_DETAILS = 'category_details'
    CATEGORY_CREATE = 'category_create'
    CATEGORY_UPDATE = 'category_update'
    CATEGORY_DELETE = 'category_delete'

    # variant
    VARIANT_ATTRIBUTES_LIST_VIEW = 'variant_attributes_list_view'
    VARIANT_ATTRIBUTES_CREATE = 'variant_attributes_create'
    VARIANT_ATTRIBUTES_UPDATE = 'variant_attributes_update'
    VARIANT_ATTRIBUTES_DELETE = 'variant_attributes_delete'
    VARIANT_ATTRIBUTES_DETAILS = 'variant_attributes_details'

    VARIANT_LIST_VIEW = 'variant_list_view'
    VARIANT_DETAILS = 'variant_details'
    VARIANT_CREATE = 'variant_create'
    VARIANT_UPDATE = 'variant_update'
    VARIANT_DELETE = 'variant_delete'

    # tags

    TAG_CREATE = 'tag_create'
    TAG_UPDATE = 'tag_update'
    TAG_DELETE = 'tag_delete'
    TAG_DETAILS = 'tag_details'
    TAG_LIST = 'tag_list'



    #Orders
    ORDER_LIST = 'order_list'
    ORDER_CREATE = 'order_create'
    ORDER_UPDATE = 'order_update'
    ORDER_DELETE = 'order_delete'
    ORDER_DETAILS= 'order_details'

    # cart
    CART_LIST = 'cart_list'
    CART_DETAILS = 'cart_details'
    CART_CREATE = 'cart_create'
    CART_UPDATE = 'cart_update'
    CART_DELETE = 'cart_delete'



    # User Management
    CREATE_USER = 'create_user'
    VIEW_USER = 'view_user'
    EDIT_USER = 'edit_user'
    DELETE_USER = 'delete_user'



    @classmethod
    def choices(cls):
        return [(item.value, item.name) for item in cls]

    @classmethod
    def values(cls):
        return [item.value for item in cls]
