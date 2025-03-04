from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, ProductImageViewSet, SKUViewSet, CategoryViewSet,
    BrandViewSet, TagViewSet
)

# Create a router and register the viewsets
router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('product-images', ProductImageViewSet, basename='product-image')
router.register('skus', SKUViewSet, basename='sku')
router.register('categories', CategoryViewSet, basename='category')
router.register('brands', BrandViewSet, basename='brand')
router.register('tags', TagViewSet, basename='tag')

# Include the router's URLs in your urlpatterns
urlpatterns = [
    path('', include(router.urls)),
]