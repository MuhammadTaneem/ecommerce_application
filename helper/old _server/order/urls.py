from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet

app_name = 'order'
router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')
router.register(r'carts', CartViewSet, basename='cart')

urlpatterns = router.urls
