from django.urls import path
from . import views

urlpatterns = [
    path('variant-attributes/', views.VariantAttributeListCreateView.as_view(), name='variant-attribute-list-create'),
    path('variant-attributes/<int:pk>/', views.VariantAttributeDetailView.as_view(), name='variant-attribute-detail'),
    path('variant-values/', views.VariantValueListCreateView.as_view(), name='variant-value-list-create'),
    path('variant-values/<int:pk>/', views.VariantValueDetailView.as_view(), name='variant-value-detail'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('products/', views.product_create_list_view, name='product-list-create'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('product-images/', views.ProductImageListCreateView.as_view(), name='product-image-list-create'),
    path('product-images/<int:pk>/', views.ProductImageDetailView.as_view(), name='product-image-detail'),
    path('skus/', views.sku_list_create_view, name='sku-list-create'),
    path('skus/<int:pk>/', views.SKUDetailView.as_view(), name='sku-detail'),
]
