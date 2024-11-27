import logging
from functools import wraps
from typing import Optional, Union, List

import django.db
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from core.enum import TokenType, PermissionEnum
from django.core.cache import cache

from core.models import Role

logger = logging.getLogger(__name__)


def get_user_role_permissions(role_id: int):
    permissions = cache.get(role_id)
    if not permissions:
        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            raise ValueError(f"No role found with ID {role_id}")

        permissions = role.permissions
        cache.set(role.id, permissions, timeout=settings.CACHE_TTL)
    return permissions or []


def get_user_from_token(payload):
    user_id = payload.get('id')
    if user_id is None:
        raise AuthenticationFailed('User not found.')

    user_model = get_user_model()

    try:
        user = user_model.objects.get(id=user_id)
        user_role_permissions = get_user_role_permissions(user.role.id)
        # import pdb;
        # pdb.set_trace()
        user.permissions.extend(user_role_permissions)

    except user_model.DoesNotExist:
        raise AuthenticationFailed('User not found.')
    return user


class TAuthJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        authorization_header = request.META.get('HTTP_AUTHORIZATION')
        if not authorization_header:
            return None

        # Check that the header starts with "Bearer"
        if not authorization_header.startswith('Bearer'):
            return None
        token = authorization_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            if payload.get('type') != TokenType.access.name:
                raise AuthenticationFailed('This token is not valid for Authentication.')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except jwt.DecodeError:
            raise AuthenticationFailed('Token is invalid.')
        return get_user_from_token(payload), None


def t_auth_active_token_verify(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        if payload.get('type') != TokenType.active.name:
            raise AuthenticationFailed('This token is not valid for Activation.')
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token has expired.')
    except jwt.DecodeError:
        raise AuthenticationFailed('Token is invalid.')
    return get_user_from_token(payload)


def t_auth_reset_token_verify(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        if payload.get('type') != TokenType.reset.name:
            raise AuthenticationFailed(f'This token is not valid for reset password.')
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token has expired.')
    except jwt.DecodeError:
        raise AuthenticationFailed('Token is invalid.')
    return get_user_from_token(payload)


def require_permissions(required_permissions: Union[PermissionEnum, List[PermissionEnum]]):
    if isinstance(required_permissions, PermissionEnum):
        required_permissions = [required_permissions]

    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionError("Authentication required")
            if not all(permission in request.user.permissions for permission in required_permissions):
                raise PermissionError("User lacks the  required permissions")
            return view_func(request, *args, **kwargs)

        return wrapper

    return decorator
