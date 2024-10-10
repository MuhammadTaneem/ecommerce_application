from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from tauth.enum import AppsList, ModelsList, ActionsList, AreaList


class Permission(models.Model):
    app_name = models.CharField(max_length=127, choices=AppsList.choices)
    model_name = models.CharField(max_length=127, choices=ModelsList.choices)
    action_name = models.CharField(max_length=127, choices=ActionsList.choices)
    area = models.CharField(max_length=127, choices=AreaList.choices)
    description = models.CharField(max_length=511, blank=True)

    def __str__(self):
        return f"{self.app_name}.{self.model_name}.{self.action_name} - {self.area}"


class Role(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=511, blank=True)
    role_permissions = models.ManyToManyField(Permission)

    def __str__(self):
        return self.name


class TauthUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)


class TauthUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(null=True, blank=True)
    last_name = models.CharField(null=True, blank=True)
    email = models.EmailField(unique=True)
    user_roll = models.ForeignKey(Role, on_delete=models.DO_NOTHING, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    objects = TauthUserManager()

    USERNAME_FIELD = 'email'

    # REQUIRED_FIELDS = ['user_type', 'phone_number']

    def __str__(self):
        return self.email

    def get_user_roll_permissions(self):
        if self.user_roll:
            return list(self.user_roll.role_permissions.all())
        return []
