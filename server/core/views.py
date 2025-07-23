from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import check_password
from core.Utiilties.authentication import t_auth_active_token_verify, t_auth_reset_token_verify
from core.Utiilties.permission_chacker import has_permissions, HasPermissionMixin
from core.Utiilties.utilities_functions import token_generator, activation_email_sender, reset_password_email_sender
from core.serializers import *
from core.Utiilties.enum import TokenType

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
                return Response({'id':user.id,'type':user.role_name,'token': token_generator(user_id=user.id, token_type=TokenType.access)},
                                status=status.HTTP_200_OK)
            else:
                invalid_credentials_message = config_data['messages']['invalid_credentials_message']
                return Response({'message': invalid_credentials_message}, status=status.HTTP_400_BAD_REQUEST)
        else:
            account_disabled_message = config_data['messages']['account_disabled_message']
            return Response({'message': account_disabled_message}, status=status.HTTP_400_BAD_REQUEST)
    else:
        user_dos_not_exist_message = config_data['messages']['user_dos_not_exist_message']
        return Response({'message': user_dos_not_exist_message} ,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def sign_up(request):
    if request.method == 'POST':
        serializer = ReadWriteUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            activation_email_sender.delay(user.email, request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    if request.method == 'GET':
        serializer = ReadWriteUserSerializer(request.user)
        return Response(serializer.data)
    return None


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
    return None


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
    return None


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
    return None



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
    return None


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        address_book = Address.objects.filter(user_id=user.id)
        return address_book

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def default(self, request):
        default_address = Address.get_default_for_user(request.user)

        if default_address:
            serializer = self.get_serializer(default_address)
            return Response(serializer.data)

        return Response(
            {"detail": "No default address found."},
            status=status.HTTP_404_NOT_FOUND
        )


class RoleViewSet(HasPermissionMixin, viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    method_permissions = {
        'PUT': PermissionEnum.roles_update,
        'GET': PermissionEnum.roles_list,
        'DELETE': PermissionEnum.roles_delete,
        'POST': PermissionEnum.roles_create
    }

    def get_queryset(self):
        roles = Role.objects.all()
        return roles
    

@api_view(['PUT'])
@has_permissions(PermissionEnum.user_role_update)
def user_role_update(request):
    role_id = request.data.get('role_id')
    user_id = request.data.get('user_id')
    role = None

    if not role_id and not user_id:
        return Response({'message': 'Role ID and User ID are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    role = Role.objects.filter(id=role_id).first()
    if not role:
        return Response({'message': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)

    if user_id:
        try:
            user = User.objects.get(id=user_id)
            if not user:
                return Response({'message': 'User is not found'}, status=status.HTTP_400_BAD_REQUEST)
            user.role = role
            user.save()
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'message': 'User role updated successfully'}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@has_permissions(PermissionEnum.user_permissions_update)
def user_permissions_view(request):
    user_id = request.data.get('user_id')
    permission = request.data.get('permission')
    if not user_id and not permission:
        return Response({'message': 'User ID and Permission are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserPermissionSerializer(user, data=permission, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return None



@api_view(['GET'])
@has_permissions([PermissionEnum.view_user])
def list_users(request):
    queryset = User.objects.all()

    email = request.query_params.get('email')
    phone = request.query_params.get('phone')
    role_id = request.query_params.get('role_id')
    search = request.query_params.get('search')

    if email:
        queryset = queryset.filter(email__icontains=email)

    if phone:
        queryset = queryset.filter(phone__icontains=phone)

    if role_id:
        queryset = queryset.filter(role_id=role_id)

    if search:
        queryset = queryset.filter(first_name__icontains=search) | queryset.filter(last_name__icontains=search)

    # Use DRF's built-in LimitOffsetPagination
    paginator = LimitOffsetPagination()
    paginated_queryset = paginator.paginate_queryset(queryset, request)

    serializer = ReadWriteUserSerializer(paginated_queryset, many=True)
    return paginator.get_paginated_response(serializer.data)