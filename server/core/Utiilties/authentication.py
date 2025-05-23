import logging
import jwt
from functools import wraps
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import get_user_model
from typing import Dict, List, Union, Optional

from django.http import JsonResponse
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied, NotAuthenticated, AuthenticationFailed
from core.Utiilties.enum import TokenType, PermissionEnum
from core.models import Role
from django.core.exceptions import PermissionDenied

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
        except jwt.DecodeError as e:
            raise AuthenticationFailed(f'Token is invalid.{e}')
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

