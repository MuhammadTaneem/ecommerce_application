from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import (
    user_login,
    sign_up,
    get_profile,
    update_profile,
    update_email,
    re_send_activation_email,
    active_user,
    change_password,
    send_reset_password_email,
    reset_password_confirm,
    AddressViewSet,
    RoleViewSet,
    user_role_update,
    user_permissions_view

)

app_name = 'core'

# Routers
router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'roles', RoleViewSet, basename='role')

# URL Patterns
urlpatterns = [
    # Auth
    path('login/', user_login, name='login'),
    path('sign_up/', sign_up, name='sign_up'),
    path('active_user/', active_user, name='active_user'),

    # Profile
    path('profile/', get_profile, name='get_profile'),
    path('update_profile/', update_profile, name='update_profile'),
    path('update_email/', update_email, name='update_email'),

    # Password & Email
    path('change_password/', change_password, name='change_password'),
    path('reset_password/', send_reset_password_email, name='reset_password'),
    path('reset_password_confirm/', reset_password_confirm, name='reset_password_confirm'),
    path('re_send_activation_email/', re_send_activation_email, name='re_send_activation_email'),

    # user management

    path('user_role', user_role_update, name='user_role'),
    path('user_permissions', user_permissions_view, name='user_permissions'),

    # Include DRF ViewSets
    path('', include(router.urls)),
]
