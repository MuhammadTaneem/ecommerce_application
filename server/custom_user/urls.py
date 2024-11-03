# urls.py (app level)
from django.urls import path
from .views import GoogleLogin, FacebookLogin

urlpatterns = [
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
]