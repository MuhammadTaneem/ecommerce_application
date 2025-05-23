from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
                  # path("admin/", admin.site.urls),
                  path('api/', include('order.urls')),
                  path('api/', include('products.urls')),
                  # path('api/admin/', include('admin_panel.urls')),
                  path('api/auth/', include('core.urls')),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
