from core.enum import PermissionEnum
from functools import wraps
from typing import Union, List


def require_permissions(permissions: Union[PermissionEnum, List[PermissionEnum]]):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionError("Authentication required")
            if type(permissions) is PermissionEnum:
                if not request.user.has_permission(permissions):
                    raise PermissionError("Insufficient permissions")
            elif type(permissions) is list:
                if not request.user.has_permissions(permissions):
                    raise PermissionError("Insufficient permissions")
            else:
                raise Exception("Permission is not PermissionEnum")

            return view_func(request, *args, **kwargs)

        return wrapper

    return decorator
