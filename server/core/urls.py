# auth_api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import *

app_name = 'core'


router = DefaultRouter()
# router.register(r'', AddressBookViewSet, basename='address')


urlpatterns = [
    path('login/', user_login, name='login'),  # checked
    path('logout/', user_logout, name='logout'),  # can improve
    path('sign_up/', sign_up, name='sign_up'),  # checked
    path('profile/', get_profile, name='get_profile'),  # checked
    path('update_profile/', update_profile, name='update_profile'),  # checked
    path('update_email/', update_email, name='update_email'),  # checked
    path('re_send_activation_email/', re_send_activation_email, name='re_send_activation_email'),  # checked
    path('active_user/', active_user, name='active_user'),  # checked
    path('change_password/', change_password, name='change-password'),
    path('reset_password/', send_reset_password_email, name='send_reset_password_email'),  # checked
    path('reset_password_confirm/', reset_password_confirm, name='reset_password_confirm'),  # checked
    path('address/', include(router.urls)),
]
