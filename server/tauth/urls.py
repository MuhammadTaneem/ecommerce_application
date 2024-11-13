# auth_api/urls.py
from django.urls import path
from tauth.views import *

app_name = 'tauth'
urlpatterns = [
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('sign_up/', sign_up, name='sign_up'),
    path('profile/', get_profile, name='get_profile'),
    path('update_profile/', update_profile, name='update_profile'),
    path('update_email/', update_email, name='update_email'),
    path('re_send_activation_email/', re_send_activation_email, name='re_send_activation_email'),
    path('active_user/', active_user, name='active_user'),
    path('change-password/', change_password, name='change-password'),
    path('reset_password/', send_reset_password_email, name='send_reset_password_email'),
    path('reset_password_confirm/', reset_password_confirm, name='reset_password_confirm'),
]
