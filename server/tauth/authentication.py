import django.db
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from tauth.enum import TokenType


def get_user_from_token(payload, request_method, app_name):
    have_permission = False
    user_id = payload.get('id')
    if user_id is None:
        raise AuthenticationFailed('User not found.')

    user_model = get_user_model()

    try:
        user = (user_model.objects.select_related('user_roll').
                prefetch_related('user_roll__role_permissions').get(id=user_id))
        # user_permission_list = user.get_user_roll_permissions()
        # for permission in user_permission_list:
        #     import pdb; pdb.set_trace()
        #     if permission.app_name == app_name and permission.action_name == request_method:
        #         return True

        have_permission = any(permission.app_name == app_name and permission.action_name == request_method.lower()
                              for permission in user.get_user_roll_permissions())

    except user_model.DoesNotExist:
        raise AuthenticationFailed('User not found.')

    if have_permission:
        return user
    else:
        raise PermissionError('You have no permission to perform this action.')


class TAuthJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        request_method = request.method
        app_name = request.resolver_match.app_name
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
        return get_user_from_token(payload, request_method, app_name), None


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
    return get_user_from_token(payload, request_method='POST', app_name='tauth')
