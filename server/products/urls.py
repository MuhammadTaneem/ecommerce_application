# from django.urls import path
# from . import views
#
# urlpatterns = [
#     # path('variant-attributes/', views.VariantAttributeListCreateView.as_view(), name='variant-attribute-list-create'),
#     # path('variant-attributes/<int:pk>/', views.VariantAttributeDetailView.as_view(), name='variant-attribute-detail'),
#     # path('variant-values/', views.VariantValueListCreateView.as_view(), name='variant-value-list-create'),
#     # path('variant-values/<int:pk>/', views.VariantValueDetailView.as_view(), name='variant-value-detail'),
#     path('categories/', views.category_lst_view, name='category-list'),
#     path('products/', views.products_list, name='product-list'),
#     # path('products/<slug:slug>/', views.products_list, name='products_list'),
#     # path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
#     # path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
#     path('product/<int:pk>/', views.product_details_view, name='product-detail'),
#     path('product-images/', views.ProductImageListCreateView.as_view(), name='product-image-list-create'),
#     path('product-images/<int:pk>/', views.ProductImageDetailView.as_view(), name='product-image-detail'),
#     # path('skus/', views.SKUListCreateView.as_view(), name='sku-list-create'),
#     # path('skus/<int:pk>/', views.SKUDetailView.as_view(), name='sku-detail'),
# ]



from django.urls import path
from .views import (
    ProductListCreateView, ProductDetailView,
    ProductImageListCreateView, ProductImageDetailView,
    SKUListCreateView, SKUDetailView,
    # VariantAttributeListCreateView, VariantAttributeDetailView,
    # VariantValueListCreateView, VariantValueDetailView,
    CategoryListCreateView, CategoryDetailView,
    BrandListCreateView, BrandDetailView,
    TagListCreateView, TagDetailView
)

urlpatterns = [
    # Product URLs
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Product Image URLs
    path('product-images/', ProductImageListCreateView.as_view(), name='product-image-list-create'),
    path('product-images/<int:pk>/', ProductImageDetailView.as_view(), name='product-image-detail'),

    # SKU URLs
    path('skus/', SKUListCreateView.as_view(), name='sku-list-create'),
    path('skus/<int:pk>/', SKUDetailView.as_view(), name='sku-detail'),

    # Variant Attribute URLs
    # path('variant-attributes/', VariantAttributeListCreateView.as_view(), name='variant-attribute-list-create'),
    # path('variant-attributes/<int:pk>/', VariantAttributeDetailView.as_view(), name='variant-attribute-detail'),
    #
    # # Variant Value URLs
    # path('variant-values/', VariantValueListCreateView.as_view(), name='variant-value-list-create'),
    # path('variant-values/<int:pk>/', VariantValueDetailView.as_view(), name='variant-value-detail'),

    # Category URLs
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # Brand URLs
    path('brands/', BrandListCreateView.as_view(), name='brand-list-create'),
    path('brands/<int:pk>/', BrandDetailView.as_view(), name='brand-detail'),

    # Tag URLs
    path('tags/', TagListCreateView.as_view(), name='tag-list-create'),
    path('tags/<int:pk>/', TagDetailView.as_view(), name='tag-detail'),
]
