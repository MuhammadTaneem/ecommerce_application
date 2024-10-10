from django.contrib import admin
from tauth.models import TauthUser, Role, Permission


class AuthorAdmin(admin.ModelAdmin):
    pass


class RoleAdmin(admin.ModelAdmin):
    pass


class PermissionAdmin(admin.ModelAdmin):
    pass


admin.site.register(TauthUser, AuthorAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(Permission, PermissionAdmin)
