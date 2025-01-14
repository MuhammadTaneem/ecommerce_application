from django.urls import path
from . import views

urlpatterns = [
    path('variant/', views.VariantListCreateView.as_view(), name='variant-list-create'),
    path('variant/<int:pk>/', views.VariantDetailView.as_view(), name='variant-detail'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('products/', views.product_create_list_view, name='product-list-create'),
    path('products/<int:pk>/', views.product_detail_update_view, name='product_detail_update_view'),
    path('brands/', views.BrandViewSet.as_view({'get': 'list', 'post': 'create'}), name='brand-list'),
    # path('tags/', views.TagViewSet.as_view(), name='tag-list'),
    # path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    # path('product-images/', views.ProductImageListCreateView.as_view(), name='product-image-list-create'),
    # path('product-images/<int:pk>/', views.ProductImageDetailView.as_view(), name='product-image-detail'),
    # path('skus/', views.sku_list_create_view, name='sku-list-create'),
    # path('skus/<int:pk>/', views.SKUDetailView.as_view(), name='sku-detail'),
    # path('skus/<int:pk>/', views.SKUDetailView.as_view(), name='sku-detail'),
    path('products/context/', views.product_context, name='product-context'),
]
