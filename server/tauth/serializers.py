import re
from rest_framework import serializers
from django.contrib.auth import get_user_model
from tauth.config import ConfData

User = get_user_model()


class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user


class ReadWriteUserSerializer(BaseUserSerializer):
    pass


class UserUpdateSerializer(BaseUserSerializer):
    class Meta:
        model = User
        exclude = ['password', User.USERNAME_FIELD]


class UserEmailUpdate(BaseUserSerializer):
    class Meta:
        model = User
        fields = ['email', 'is_active']

    def validate_email(self, value):
        user = self.instance
        if user and user.email == value:
            raise serializers.ValidationError("New Email must be different from the old Email.")
        return value

    def update(self, instance, validated_data):
        if 'email' in validated_data:
            # If the email is being updated, set is_active to False
            validated_data['is_active'] = False
        return super().update(instance, validated_data)


def new_password_validator(password):
    conf_class = ConfData()
    config_data = conf_class.get_data()

    password_min_length = config_data['password']['min_length']
    # isCapital = True
    # isSpecial = True
    # isDigit = True
    error_messages = []

    if len(password) < config_data['password']['min_length']:
        error_messages.append(f'password should be at least {password_min_length} Characters.')
    if not any(char.isdigit() for char in password) and config_data['password']['is_digit']:
        error_messages.append(f'password should be at least one Digit.')

        # Check if the password contains an uppercase letter
    if not any(char.isupper() for char in password) and config_data['password']['is_capital']:
        error_messages.append(f'password should be at least one capital letter.')

        # Check if the password contains a special character
    special_characters = re.compile(r'[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]')
    if not special_characters.search(password) and config_data['password']['is_special']:
        error_messages.append(f'password should be at least one special character.')
    return error_messages


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['user']

        # Check if the old password matches the user's current password.
        if not user.check_password(data['password']):
            raise serializers.ValidationError({'password': "Old password is incorrect."})

        # Check if the new password and confirm_new_password fields match.
        if data['password'] == data['new_password']:
            raise serializers.ValidationError({"new_password": "New password must be different from the old password."})

        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "New passwords do not match."})

        error_messages = new_password_validator(data['new_password'])

        if error_messages:
            raise serializers.ValidationError({"new_password": ' '.join(error_messages)})

        return data


class ResetPasswordSerializer(serializers.Serializer):
    model = User
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):

        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "New passwords do not match."})

        error_messages = new_password_validator(data['new_password'])

        if error_messages:
            raise serializers.ValidationError({"new_password": ' '.join(error_messages)})

        return data


class ActiveUserSerializer(BaseUserSerializer):
    class Meta:
        model = User
        fields = ['email', 'is_active']

    def update(self, instance, validated_data):
        validated_data['is_active'] = True
        return super().update(instance, validated_data)
