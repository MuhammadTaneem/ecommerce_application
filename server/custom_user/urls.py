# urls.py
from django.urls import path, include
from .views import (
    GoogleLoginView,
    FacebookLoginView,
    EmailRegisterView,
    EmailLoginView
)

urlpatterns = [
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('auth/facebook/', FacebookLoginView.as_view(), name='facebook_login'),
    path('auth/email/register/', EmailRegisterView.as_view(), name='email_register'),
    path('auth/email/login/', EmailLoginView.as_view(), name='email_login'),
]
