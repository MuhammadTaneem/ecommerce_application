import uuid

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, AbstractUser
from django.db import models
from django.utils import timezone
from rest_framework.exceptions import ValidationError


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = models.JSONField(default=list)
    description = models.TextField(null=True, blank=True)
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
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
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


class AddressBook(models.Model):
    ADDRESS_TYPE_CHOICES = (
        ('Billing Address', 'billing_address'),
        ('Shipping Address', 'shipping_address'),
    )

    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='addresses')
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPE_CHOICES, default='PENDING')
    shipping_city = models.CharField(max_length=100)
    shipping_area = models.CharField(max_length=100)
    shipping_address = models.TextField()
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.is_default:
            AddressBook.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super(AddressBook, self).save(*args, **kwargs)

    @property
    def get_default_address(self):
        return AddressBook.objects.filter(user=self.user, is_default=True).first()

    def __str__(self):
        return self.name
