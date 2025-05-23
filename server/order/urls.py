from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet, VoucherViewSet
from django.urls import path, include

app_name = 'order'

router = DefaultRouter()
router.register(r'order', OrderViewSet, basename='order-view')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'voucher', VoucherViewSet, basename='voucher')

# urlpatterns = router.urls
urlpatterns = [
    # Include all routes from the router
    path('', include(router.urls)),
]