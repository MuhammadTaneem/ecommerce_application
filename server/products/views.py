from django.db import connection
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from core.authentication import require_permissions
from core.enum import PermissionEnum
from .models import VariantAttribute, VariantValue, Category, Product, ProductImage, SKU
from .serializers import VariantAttributeSerializer, VariantValueSerializer, CategorySerializer, ProductSerializer, \
    ProductImageSerializer, SKUSerializer, ProductDetailsSerializer, ProductListSerializer


# class VariantAttributeListCreateView(generics.ListCreateAPIView):
#     queryset = VariantAttribute.objects.all()
#     serializer_class = VariantAttributeSerializer
#
#
# class VariantAttributeDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = VariantAttribute.objects.all()
#     serializer_class = VariantAttributeSerializer
#
#
# class VariantValueListCreateView(generics.ListCreateAPIView):
#     queryset = VariantValue.objects.all()
#     serializer_class = VariantValueSerializer
#
#
# class VariantValueDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = VariantValue.objects.all()
#     serializer_class = VariantValueSerializer


# class CategoryListView(generics.ListAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

@api_view(['GET'])
def category_lst_view(request):
    categories = Category.objects.filter(parent__isnull=True)
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# @api_view() c
# def category_product(request, slug=None):
#     if slug:
#         categories = Category.objects.filter(
#             Q(slug=slug) |
#             Q(slug__startswith=slug + '_')
#         ).prefetch_related('products')
#         products = [product for category in categories for product in category.products.all()]
#     serializer = ProductListSerializer(products, many=True, context={'request': request})
#     return Response(serializer.data)


@api_view(['GET'])
# @permission_classes([require_permissions(PermissionEnum.VIEW_USER)])
# @require_permissions([PermissionEnum.PRODUCT_LIST, PermissionEnum.CATEGORY_DELETE])
# @require_permissions(PermissionEnum.PRODUCT_LIST)
def products_list(request):
    products = product_filter(request)
    # categories = Category.objects.filter(parent__isnull=True)
    categories = Category.objects.all()
    product_serializer = ProductListSerializer(products, many=True, context={'request': request})
    category_serializer = CategorySerializer(categories, many=True)
    return Response({'product': product_serializer.data, 'categories': category_serializer.data})


def product_filter(request, show_deleted=False, show_active=None):
    category = request.data.get('category', None)
    min_price = request.data.get('min_price', None)
    max_price = request.data.get('max_price', None)
    search_query = request.query_params.get('s')
    variants_items = request.data.get('variants')
    products = Product.objects.filter(is_deleted=show_deleted)
    if show_active:
        products = products.filter(is_active=show_active)
    if category:
        categories_filter = Q(slug=category) | Q(slug__startswith=category + '_')
        products = Product.objects.filter(category__in=categories_filter)

    if min_price is not None:
        products = products.filter(base_price__gte=min_price)
    if max_price is not None:
        products = products.filter(base_price__lte=max_price)

    if search_query:
        search_filter = (
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(short_description__icontains=search_query)
        )
        products = products.filter(search_filter)

    variant_filters = []
    if variants_items:
        for key, value in variants_items.items():
            variant_value = VariantValue.objects.filter(attribute__name__iexact=key, value__iexact=value).first()
            print(variant_value)
            if variant_value:
                variant_filters.append(variant_value)
    if variant_filters is not None and len(variant_filters) > 0:
        products = products.filter(skus__variants__in=variant_filters)
    return products


@api_view(['GET', 'POST'])
def product_details_view(request, pk):
    if request.method == 'GET':
        try:
            product = Product.objects.get(pk=pk)
            product_serializer = ProductDetailsSerializer(product, context={'request': request})
            return Response(product_serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        serializer = SKUSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductImageListCreateView(generics.ListCreateAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer


class ProductImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer


# class SKUListCreateView(generics.ListCreateAPIView):
#     queryset = SKU.objects.all()
#     serializer_class = SKUSerializer


class SKUDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SKU.objects.all()
    serializer_class = SKUSerializer
