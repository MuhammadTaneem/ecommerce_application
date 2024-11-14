# in serializers.py
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from .models import CustomUser

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = CustomUser
        fields = ('id', 'full_name', 'password')
