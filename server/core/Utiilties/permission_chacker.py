import logging
import jwt
from functools import wraps
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import get_user_model
from typing import Dict, List, Union, Optional

from django.http import JsonResponse
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied, NotAuthenticated, AuthenticationFailed
from core.Utiilties.enum import TokenType, PermissionEnum
from core.models import Role
from django.core.exceptions import PermissionDenied

logger = logging.getLogger(__name__)
user_model = get_user_model()


def check_permissions(
        request,
        required_permissions: Optional[Union[PermissionEnum, List[PermissionEnum]]],
        method_permissions: Optional[Dict[str, Union[PermissionEnum, List[PermissionEnum]]]],
        method: str,
        is_drf_view: bool = False
):
    """
    Check permissions with proper error handling for both DRF and regular Django views
    """
    needs_authentication = False
    user_permissions = []

    if not request.user.is_anonymous:
        user_permissions = request.user.permissions

    # Check if global permissions are defined
    req_perms = []
    if required_permissions:
        needs_authentication = True
        req_perms = [required_permissions] if isinstance(required_permissions, PermissionEnum) else required_permissions
        if not all(p in user_permissions for p in req_perms):
            if is_drf_view:
                raise DRFPermissionDenied("User lacks the required permissions")
            else:
                raise PermissionDenied("User lacks the required permissions")

    # Check if method-specific permissions are defined
    meth_perms = []
    if method_permissions and method in method_permissions:
        needs_authentication = True
        meth_perms = [method_permissions[method]] if isinstance(method_permissions[method], PermissionEnum) else \
        method_permissions[method]
        if not all(p in user_permissions for p in meth_perms):
            error_msg = f"User lacks the required permissions for {method} requests"
            if is_drf_view:
                raise DRFPermissionDenied(detail=error_msg)
            else:
                raise PermissionDenied(error_msg)

    # Only authenticate if any permission was defined
    if needs_authentication and not request.user.is_authenticated:
        if is_drf_view:
            raise NotAuthenticated("Authentication required")
        else:
            raise PermissionDenied("Authentication required")


def has_permissions(
        required_permissions: Optional[Union[PermissionEnum, List[PermissionEnum]]] = None,
        method_permissions: Optional[Dict[str, Union[PermissionEnum, List[PermissionEnum]]]] = None
):
    """
    Decorator for function-based views and ViewSet actions
    """

    def decorator(view_func):
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            # Determine request object and view type
            request = None
            is_drf_view = False

            # Check if this is a ViewSet method (self, request, ...)
            if len(args) >= 2 and hasattr(args[1], 'method'):
                request = args[1]
                # Check if it's a DRF view by looking at the first argument (self)
                if hasattr(args[0], 'action') or hasattr(args[0], 'get_serializer'):
                    is_drf_view = True
            # Check if this is a function-based view (request, ...)
            elif args and hasattr(args[0], 'user'):
                request = args[0]
                is_drf_view = False
            else:
                raise ValueError("Could not determine request object")

            method = request.method.upper()

            try:
                check_permissions(request, required_permissions, method_permissions, method, is_drf_view)
            except (PermissionDenied, DRFPermissionDenied, NotAuthenticated) as e:
                # Handle permission errors with appropriate response format
                if is_drf_view:
                    # For DRF views, let the exception propagate (DRF will handle it)
                    raise
                else:
                    # For function-based views, return JSON response
                    error_msg = str(e) if str(e) else "Permission denied"
                    status_code = 401 if "Authentication required" in error_msg else 403
                    return JsonResponse({'error': error_msg}, status=status_code)

            return view_func(*args, **kwargs)

        return wrapper

    return decorator


class HasPermissionMixin:
    """
    Mixin for class-based views with proper error handling
    """
    required_permissions = None  # Global permissions
    method_permissions = None  # Dict mapping HTTP methods to permissions

    def check_permissions(self, request):
        """
        Override DRF's check_permissions method for ViewSets
        """
        # Call parent's check_permissions first if it exists (for DRF views)
        if hasattr(super(), 'check_permissions'):
            super().check_permissions(request)

        method = request.method.upper()
        is_drf_view = hasattr(self, 'action') or hasattr(self, 'get_serializer') or hasattr(self, 'get_queryset')

        # Get permissions from class attributes
        req_perms = self.required_permissions
        meth_perms = self.method_permissions

        try:
            check_permissions(request, req_perms, meth_perms, method, is_drf_view)
        except (PermissionDenied, DRFPermissionDenied, NotAuthenticated):
            # For DRF views, let the exception propagate (DRF will handle it)
            # For regular views, this will be caught in dispatch method
            raise

    def dispatch(self, request, *args, **kwargs):
        """
        For regular Django views, handle permission checking in dispatch
        """
        # Only use dispatch for non-DRF views
        is_drf_view = hasattr(self, 'action') or hasattr(self, 'get_serializer') or hasattr(self, 'get_queryset')

        if not is_drf_view:
            method = request.method.upper()

            try:
                # Get permissions from class attributes
                req_perms = self.required_permissions
                meth_perms = self.method_permissions
                check_permissions(request, req_perms, meth_perms, method, is_drf_view)
            except (PermissionDenied, DRFPermissionDenied, NotAuthenticated) as e:
                # For regular Django views, return JSON response instead of HTML
                error_msg = str(e) if str(e) else "Permission denied"
                status_code = 401 if "Authentication required" in error_msg else 403
                return JsonResponse({'error': error_msg}, status=status_code)

        return super().dispatch(request, *args, **kwargs)
