from django.contrib import admin
from django.contrib.auth import get_user_model
User = get_user_model()

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
