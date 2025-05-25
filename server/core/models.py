import uuid

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, AbstractUser
from django.db import models
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.conf import settings

class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = models.JSONField(default=list)
    description = models.TextField(blank=True,default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    @property
    def permission_list(self):
        return self.permissions or []


class Usermanager(BaseUserManager):
    def create_user(self, email, phone, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, user_type, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, user_type, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=30, blank=True, default="")
    last_name = models.CharField(max_length=30, blank=True, default="")
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, default="")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField( blank=True, default=None, null=True)
    avatar = models.ImageField(upload_to='avatars/',  blank=True, default="")
    permissions = models.JSONField(default=list)
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        related_name='users'
    )
    username = None
    objects = Usermanager()

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['phone']

    def clean(self):
        if self.phone:
            
            if User.objects.filter(phone=self.phone).exclude(id=self.id).exists():
                raise ValidationError(f"The phone number {self.phone} is already in use.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    @property
    def get_default_address(self):
        return self.addresses.filter(is_default=True).first()

    def has_permission(self, permission):
        return permission in self.role.permissions

    def has_permissions(self, permissions):
        return all(permission in self.role.permissions for permission in permissions)

    def __str__(self):
        return self.email


class Address(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='addresses'
    )
    name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    area = models.CharField(max_length=100, blank=True, default="")
    phone_number = models.CharField(max_length=20)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_default', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_default']),
        ]

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if not self.name and is_new:
            count = Address.objects.filter(user=self.user).count() + 1
            self.name = f"Address {count}"

        if self.is_default:
            Address.objects.filter(
                user=self.user,
                is_default=True
            ).exclude(pk=self.pk or -1).update(is_default=False)

        super().save(*args, **kwargs)

        if is_new and not self.is_default:
            default_exists = Address.objects.filter(
                user=self.user,
                is_default=True
            ).exists()
            if not default_exists:
                self.is_default = True
                Address.objects.filter(pk=self.pk).update(is_default=True)

    @classmethod
    def get_default_for_user(cls, user):
        return cls.objects.filter(user=user, is_default=True).first()

    def __str__(self):
        return f"{self.name} - {self.address_line1}, {self.city}"
