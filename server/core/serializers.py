from rest_framework import serializers
from core.enum import PermissionEnum
from core.models import Role
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer
User = get_user_model()


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'permissions', 'description', 'is_active']

    def validate_permissions(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Permissions must be a list")

        valid_permissions = set(PermissionEnum.values())
        invalid_permissions = [permission for permission in value if permission not in valid_permissions]

        if invalid_permissions:
            raise serializers.ValidationError(
                f"Invalid permissions: {', '.join(invalid_permissions)}"
            )

        return value


class UserSerializer(UserSerializer):
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone', 'created',
            'is_active', 'is_staff', 'is_superuser', 'is_verified', 'last_login',
            'avatar', 'role'
        ]
        read_only_fields = ['created', 'last_login']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.role:
            representation['role'] = instance.role.name
        return representation
