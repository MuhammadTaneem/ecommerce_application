# from enum import Enum
from django.db.models import TextChoices


#
# class TokenType(Enum):
#     access = "Access"
#     reset = "Reset"
#     active = "Active"
#
#     def enum_dict(self):
#         return {e.value: e.name for e in TokenType}
#
#
# enum_dict = {e.value: e.name for e in TokenType}

class TokenType(TextChoices):
    ACCESS = "Access", "Access"
    RESET = "Reset", "Reset"
    ACTIVE = "Active", "Active"


def get_enum_dict(self):
    return {key: label for key, label in TokenType.choices}


class AppsList(TextChoices):
    # CustomUserModule = 'cum', 'Custom User Module'
    TAuthModule = 'tauth', 'Authentication Module'


class ModelsList(TextChoices):
    # CustomUserModel = 'cum', 'Custom User Model'
    TAuthModel = 'tauth', 'T Authentication Model'


class ActionsList(TextChoices):
    Create = 'post', 'Create'
    Update = 'put', 'Update'
    Delete = 'delete', 'Delete'
    View = 'get', 'View'


class AreaList(TextChoices):
    Self = 's', 'Self'
    HaveParent = 'hp', 'Have Parent'
    All = 'a', 'All'
