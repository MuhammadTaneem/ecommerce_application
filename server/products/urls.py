from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CategoryViewSet,
    BrandViewSet, TagViewSet, VariantViewSet,product_context
)

# Create a router and register the viewsets
router = DefaultRouter()
# router.register('', ProductViewSet, basename='product')
router.register('products', ProductViewSet, basename='product')
router.register('categories', CategoryViewSet, basename='category')
router.register('brands', BrandViewSet, basename='brand')
router.register('tags', TagViewSet, basename='tag')
router.register('variants', VariantViewSet, basename='variant')

# Include the router's URLs in your urlpatterns
urlpatterns = [
    path('', include(router.urls)),
    path('context/',product_context)
]