from functools import lru_cache

import jwt
import datetime

from django.conf import settings
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import check_password
from core.authentication import t_auth_active_token_verify, t_auth_reset_token_verify
from core.utilities import token_generator, activation_email_sender, reset_password_email_sender
from core.serializers import *
from core.enum import TokenType

config_data = ConfData.get_data()


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    user_model = get_user_model()
    username_field = user_model.USERNAME_FIELD
    username = request.data.get(username_field)
    password = request.data.get('password')
    is_active_required = config_data['is_active_required']
    user = user_model.objects.filter(**{username_field: username}).first()
    if user is not None:
        if (user.is_active and is_active_required) or is_active_required is False:
            if check_password(password, user.password):
                # this  check password is get algorithm from hasher. is not tauth algorithm
                return Response({'token': token_generator(user_id=user.id, token_type=TokenType.access)},
                                status=status.HTTP_200_OK)
            else:
                invalid_credentials_message = config_data['messages']['invalid_credentials_message']
                return Response(message = invalid_credentials_message,errors= {'message':invalid_credentials_message}, status=status.HTTP_400_BAD_REQUEST)
        else:
            account_disabled_message = config_data['messages']['account_disabled_message']
            return Response({'message': account_disabled_message}, status=status.HTTP_400_BAD_REQUEST)
    else:
        user_dos_not_exist_message = config_data['messages']['user_dos_not_exist_message']
        return Response(message = user_dos_not_exist_message,errors = {'message': user_dos_not_exist_message} ,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(self):
    return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def sign_up(request):
    if request.method == 'POST':
        serializer = ReadWriteUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # start_time = datetime.datetime.now()
            activation_email_sender.delay(user.email, request.user.id)
            # activation_email_sender(user.email, request.user.id)
            # end_time = datetime.datetime.now()
            # print(f"execution time: {end_time - start_time}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    if request.method == 'GET':
        serializer = ReadWriteUserSerializer(request.user)
        return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'PUT':
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data, context={'user': user})
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = User.objects.get(id=request.user.id)
    if request.method == 'PUT':
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_email(request):
    user = User.objects.get(id=request.user.id)
    if request.method == 'PUT':
        serializer = UserEmailUpdate(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response = activation_email_sender.delay(user.email, user.id)
            if response:
                return Response({'message': 'Your email is updated. Please check your email'},
                                status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Send Activation email field.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# def token_generator(user_id, token_type):
#     try:
#         # token_life_time = get_token_life_time(token_type)
#         token_life_time = datetime.timedelta(minutes=2)
#         algorithm = config_data['algorithm']
#         if token_type.access:
#             token_life_time = config_data['access_token_life_time']
#         elif token_type.active:
#             token_life_time = config_data['active_token_life_time']
#         elif token_type.reset:
#             token_life_time = config_data['reset_token_life_time']
#         payload = {
#             'id': user_id,
#             'exp': datetime.datetime.now(datetime.UTC) + token_life_time,
#             "type": token_type.name,
#             'iat': datetime.datetime.now(datetime.UTC)
#         }
#         # return jwt.encode(payload, settings.SECRET_KEY, algorithm=algorithm).decode('utf-8')
#         return jwt.encode(payload, settings.SECRET_KEY, algorithm=algorithm)
#     except:
#         return Response(data="Internal Server Error", status=status.HTTP_400_BAD_REQUEST)


# def send_activation_email(email, user_id):
#     try:
#         token = token_generator(user_id=user_id, token_type=TokenType.active)
#         active_user_url = config_data['urls']['active_user_url']
#         context = {'activation_url': active_user_url + token, 'logo_url': config_data['logo_url']}
#         template_path = 'emails/active_user.html'
#         html_content = render_to_string(template_path, context)
#         return email_sender(email=email, body=html_content, subject='User Activation Email')
#     except:
#         return False


@api_view(['POST'])
@permission_classes([AllowAny])
def re_send_activation_email(request):
    email = request.data.get('email', None)
    if email is None:
        return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
        activation_email_sender.delay(email, user.id)
        return Response({'message': 'Activation email send. Please check your email'},
                        status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({f"message : {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def active_user(request):
    token = request.data.get('token')

    if token is None:
        return Response({'message': 'Token is required for user activation'}, status=status.HTTP_400_BAD_REQUEST)
    user = t_auth_active_token_verify(token)
    if user is not None:

        serializer = ActiveUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            login_url = config_data['urls']['login_url']
            return Response({'message': 'Your account is activated. Please login', 'login_url': login_url},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(data="Internal Server Error", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def send_reset_password_email(request):

    try:
        email = request.data.get('email', None)
        if email is None:
            return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(email=email)
        reset_password_email_sender.delay(email=email, user_id=user.id)
        return Response({'message': 'Reset Password email send. Please check your email'},
                        status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({f"message : {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def reset_password_confirm(request):
    token = request.data.get('token')
    user = t_auth_reset_token_verify(token)
    if request.method == 'PUT':
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
