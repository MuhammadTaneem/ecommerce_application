from django.contrib import admin
from rest_framework.authtoken.admin import User

from core.models import Role


# from .models import User, Role


class AuthorAdmin(admin.ModelAdmin):
    pass


class RoleAdmin(admin.ModelAdmin):
    pass


class PermissionAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, AuthorAdmin)
admin.site.register(Role, RoleAdmin)
