import jwt
import datetime

from django.conf import settings
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import check_password
from tauth.authentication import t_auth_active_token_verify, t_auth_reset_token_verify
from tauth.dependencis import email_sender
from tauth.serializers import *
from tauth.enum import TokenType

conf_class = ConfData()
config_data = conf_class.get_data()


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    user_model = get_user_model()
    username_field = user_model.USERNAME_FIELD
    username = request.data.get(username_field)
    password = request.data.get('password')
    is_active_required = config_data['is_active_required']
    account_disabled_message = config_data['messages']['account_disabled_message']
    invalid_credentials_message = config_data['messages']['invalid_credentials_message']
    user_dos_not_exist_message = config_data['messages']['user_dos_not_exist_message']

    user = user_model.objects.filter(**{username_field: username}).first()
    if user is not None:
        if (user.is_active and is_active_required) or is_active_required is False:
            if check_password(password, user.password):
                return Response({'token': token_generator(user_id=user.id, token_type=TokenType.access)},
                                status=status.HTTP_200_OK)
            else:
                return Response({'detail': invalid_credentials_message}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': account_disabled_message}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': user_dos_not_exist_message}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(self):
    return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def sign_up(request):
    if request.method == 'POST':
        serializer = ReadWriteUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            response = send_activation_email(request.user.email, request.user.id)
            if response:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Send Activation email field.'}, status=status.HTTP_200_OK)

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
    user = request.user

    if request.method == 'PUT':
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_email(request):
    user = request.user
    user_permissions_list = user.get_user_roll_permissions()
    import pdb;pdb.set_trace()


    if request.method == 'PUT':
        serializer = UserEmailUpdate(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response = send_activation_email(user.email, user.id)
            if response:
                return Response({'message': 'Your email is updated. Please check your email'},
                                status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Send Activation email field.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def token_generator(user_id, token_type):
    try:
        token_life_time = datetime.timedelta(minutes=1)
        print(token_type)
        algorithm = config_data['algorithm']
        if token_type.access:
            token_life_time = config_data['access_token_life_time']
        elif token_type.active:
            token_life_time = config_data['active_token_life_time']
        elif token_type.reset:
            token_life_time = config_data['reset_token_life_time']
        payload = {
            'id': user_id,
            'exp': datetime.datetime.now(datetime.UTC) + token_life_time,
            "type": token_type.name,
            'iat': datetime.datetime.now(datetime.UTC)
        }
        # return jwt.encode(payload, settings.SECRET_KEY, algorithm=algorithm).decode('utf-8')
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=algorithm)
    except:
        return Response(data="Internal Server Error", status=status.HTTP_400_BAD_REQUEST)


def send_activation_email(email, user_id):
    try:
        token = token_generator(user_id=user_id, token_type=TokenType.active)
        active_user_url = config_data['urls']['active_user_url']
        context = {'activation_url': active_user_url + token, 'logo_url': config_data['logo_url']}
        template_path = 'emails/active_user.html'
        html_content = render_to_string(template_path, context)
        # import pdb;pdb.set_trace()
        return email_sender(email=email, body=html_content, subject='User Activation Email')
    except:
        return False


@api_view(['POST'])
@permission_classes([AllowAny])
def re_send_activation_email(request):
    email = request.data.get('email', None)
    if email is None:
        return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

    response = send_activation_email(email, user.id)
    if response:
        return Response({'message': 'Activation email send. Please check your email'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Send Activation email field.'}, status=status.HTTP_400_BAD_REQUEST)


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
    email = request.data.get('email', None)
    if email is None:
        return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
    try:

        token = token_generator(user_id=user.id, token_type=TokenType.reset)
        reset_password_url = config_data['urls']['reset_password_url']
        logo_url = config_data['logo_url']
        context = {'reset_password_url': reset_password_url + token, 'logo_url': logo_url}
        template_path = 'emails/reset_password.html'
        html_content = render_to_string(template_path, context)
        response = email_sender(email=email, body=html_content, subject='Reset Password')
        if response:
            return Response({'message': 'Reset Password email send. Please check your email'},
                            status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Reset Password email field.'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'message': 'Internal Server Error'}, status=status.HTTP_400_BAD_REQUEST)


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
