from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static
from dj_rest_auth.views import PasswordResetConfirmView

urlpatterns = [
                  path("admin/", admin.site.urls),
                  path('api/products/', include('products.urls')),
                  path('api/admin/', include('admin_panel.urls')),
                  path('auth/', include('djoser.urls')),
                  path('auth/', include('djoser.urls.jwt')),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
