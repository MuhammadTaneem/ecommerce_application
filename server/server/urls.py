from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

import campaign

urlpatterns = [
                  # path("admin/", admin.site.urls),
                  path('api/', include('order.urls')),
                  path('api/', include('products.urls')),
                  # path('api/admin/', include('admin_panel.urls')),
                  path('api/auth/', include('core.urls')),
                  path('api/campaign/',include('campaign.urls')),

                  path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
                  # Optional UI:
                  path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
                  path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
