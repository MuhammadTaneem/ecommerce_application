from datetime import timedelta
from functools import lru_cache
import logging

from django.conf import settings

logger = logging.getLogger(__name__)
default_settings = {
    'login_field': 'email',
    'is_active_required': False,
    'algorithm': 'HS256',
    'logo_url': 'https://1000logos.net/wp-content/uploads/2016/11/google-logo.jpg',
    'access_token_life_time': timedelta(minutes=10),
    'active_token_life_time': timedelta(minutes=60),
    'reset_token_life_time': timedelta(minutes=60),
    'messages': {
        'account_disabled_message': 'User account is disabled',
        'invalid_credentials_message': 'Invalid credentials',
        'user_dos_not_exist_message': 'User does not exist',
    },
    'urls': {
        'login_url': 'http://localhost:4200/login/',
        'active_user_url': 'http://localhost:4200/active/?token=',
        'reset_password_url': 'http://localhost:4200/reset/?token=',
    },
    'password': {
        'min_length': 6,
        'is_capital': True,
        'is_special': True,
        'is_digit': True,
    },
}


def merge_settings(default, custom):
    merged = default.copy()
    for key, value in custom.items():
        if isinstance(value, dict):
            merged[key] = merge_settings(default[key], value)
        else:
            merged[key] = value
    return merged


class ConfData:
    _config = None

    @staticmethod
    @lru_cache(maxsize=128)
    def get_data():
        if ConfData._config is None:
            try:
                custom_settings = getattr(settings, 'TAUTH', {})
                ConfData._config = merge_settings(default_settings, custom_settings)
            except Exception as e:
                logger.error(f"Failed to load configuration: {str(e)}")
                raise
        return ConfData._config
