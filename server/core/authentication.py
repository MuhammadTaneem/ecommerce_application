import logging
from functools import wraps
from typing import Optional, Union, List

import django.db
from rest_framework import permissions
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from core.enum import TokenType, PermissionEnum
from django.core.cache import cache

from core.models import Role

logger = logging.getLogger(__name__)

user_model = get_user_model()
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

def get_user_permissions(user: user_model):
    role_permissions = get_user_role_permissions(user.role.id)
    user.permissions.extend(role_permissions)
    decline_permission = []
    return user
def get_user_from_token(payload):
    user_id = payload.get('id')
    if user_id is None:
        raise AuthenticationFailed('User not found.')



    try:
        user = user_model.objects.get(id=user_id)
        user = get_user_permissions(user)

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


def has_permissions(required_permissions: Union[PermissionEnum, List[PermissionEnum]]):
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


class TauthPermissionClass(permissions.BasePermission):
    def __init__(self, required_permissions=None):
        self.required_permissions = required_permissions or []

    def has_permission(self, request, view):
        # Check authentication
        if not request.user.is_authenticated:
            return False

        # Normalize to list if needed
        permissions_list = (
            [self.required_permissions]
            if isinstance(self.required_permissions, PermissionEnum)
            else self.required_permissions
        )

        # Check if user has all required permissions
        return all(
            permission in request.user.permissions
            for permission in permissions_list
        )



# def permission_required_c(perm, raise_exception=False):
#     """
#     Decorator for views that checks whether a user has a particular permission
#     enabled, redirecting to the log-in page if necessary.
#     If the raise_exception parameter is given the PermissionDenied exception
#     is raised.
#     """
#     if isinstance(perm, str):
#         perms = (perm,)
#     else:
#         perms = perm
#
#     def decorator(view_func):
#         if asyncio.iscoroutinefunction(view_func):
#
#             async def check_perms(user):
#                 # First check if the user has the permission (even anon users).
#                 if await sync_to_async(user.has_perms)(perms):
#                     return True
#                 # In case the 403 handler should be called raise the exception.
#                 if raise_exception:
#                     raise PermissionDenied
#                 # As the last resort, show the login form.
#                 return False
#
#         else:
#
#             def check_perms(user):
#                 # First check if the user has the permission (even anon users).
#                 if user.has_perms(perms):
#                     return True
#                 # In case the 403 handler should be called raise the exception.
#                 if raise_exception:
#                     raise PermissionDenied
#                 # As the last resort, show the login form.
#                 return False
#
#         return user_passes_test(check_perms, login_url=login_url)(view_func)
#
#     return decorator