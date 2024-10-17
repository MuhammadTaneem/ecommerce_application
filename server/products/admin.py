from django.contrib import admin
from products.models import Product, ProductImage, SKU, Category, VariantValue, VariantAttribute


class ProductAdmin(admin.ModelAdmin):
    pass


class ProductImageAdmin(admin.ModelAdmin):
    pass


class SKUAdmin(admin.ModelAdmin):
    pass


class CategoryAdmin(admin.ModelAdmin):
    pass


class VariantValueAdmin(admin.ModelAdmin):
    pass


class VariantAttributeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(VariantAttribute, VariantAttributeAdmin)
admin.site.register(VariantValue, VariantValueAdmin)
admin.site.register(SKU, SKUAdmin)
