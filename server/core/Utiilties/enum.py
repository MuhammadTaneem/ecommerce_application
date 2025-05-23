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
    product_list = 'product_list'
    product_details = 'product_details'
    product_create = 'product_create'
    product_update = 'product_update'
    product_delete = 'product_delete'

    # also user can make unsafe request
    # product_reviews
    # product_reviews_details

    # Category
    category_list_view = 'category_list_view'
    category_details = 'category_details'
    category_create = 'category_create'
    category_update = 'category_update'
    category_delete = 'category_delete'

    # variant
    variant_list_view = 'variant_list_view'
    variant_details = 'variant_details'
    variant_create = 'variant_create'
    variant_update = 'variant_update'
    variant_delete = 'variant_delete'

    # tags

    tag_create = 'tag_create'
    tag_update = 'tag_update'
    tag_delete = 'tag_delete'
    tag_details = 'tag_details'
    tag_list = 'tag_list'



    #Orders
    order_list = 'order_list'
    order_create = 'order_create'
    order_update = 'order_update'
    order_delete = 'order_delete'
    order_details = 'order_details'

    # cart
    cart_list = 'cart_list'
    cart_details = 'cart_details'
    cart_create = 'cart_create'
    cart_update = 'cart_update'
    cart_delete = 'cart_delete'

    # Brand
    brand_list = 'brand_list'
    brand_details = 'brand_details'
    brand_create = 'brand_create'
    brand_update = 'brand_update'
    brand_delete = 'brand_delete'


    # User Management
    create_user = 'create_user'
    view_user = 'view_user'
    edit_user = 'edit_user'
    delete_user = 'delete_user'


    #voucher
    voucher_create = 'voucher_create'
    voucher_update = 'voucher_update'
    voucher_delete = 'voucher_delete'
    voucher_details = 'voucher_details'


    @classmethod
    def choices(cls):
        return [(item.value, item.name) for item in cls]

    @classmethod
    def values(cls):
        return [item.value for item in cls]
