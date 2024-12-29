from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet

app_name = 'order'
router = DefaultRouter()
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = router.urls
