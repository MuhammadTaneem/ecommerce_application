from django.db import models


class AppsList(models.TextChoices):
    CustomUserModule = 'cum', 'Custom User Module'
    TAuthModule = 'tauth', 'Authentication Module'


class ModelsList(models.TextChoices):
    CustomUserModel = 'cum', 'Custom User Model'
    TAuthModel = 'tauth', 'T Authentication Model'


class ActionsList(models.TextChoices):
    Create = 'post', 'Create'
    Update = 'put', 'Update'
    Delete = 'delete', 'Delete'
    View = 'get', 'View'


class AreaList(models.TextChoices):
    Self = 's', 'Self'
    HaveParent = 'hp', 'Have Parent'
    All = 'a', 'All'
