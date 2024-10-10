from django.db.models import Q
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import VariantAttribute, VariantValue, Category, Product, ProductImage, SKU
from .serializers import VariantAttributeSerializer, VariantValueSerializer, CategorySerializer, ProductSerializer, \
    ProductImageSerializer, SKUSerializer, ProductDetailsSerializer, ProductListSerializer


class VariantAttributeListCreateView(generics.ListCreateAPIView):
    queryset = VariantAttribute.objects.all()
    serializer_class = VariantAttributeSerializer


class VariantAttributeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VariantAttribute.objects.all()
    serializer_class = VariantAttributeSerializer


class VariantValueListCreateView(generics.ListCreateAPIView):
    queryset = VariantValue.objects.all()
    serializer_class = VariantValueSerializer


class VariantValueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VariantValue.objects.all()
    serializer_class = VariantValueSerializer


# class CategoryListView(generics.ListAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

@api_view()
def category_lst_view(request):
    categories = Category.objects.filter(parent__isnull=True)
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# @api_view()
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
def products_list(request, slug=None):
    if slug:
        categories = Category.objects.filter(
            Q(slug=slug) |
            Q(slug__startswith=slug + '_')
        ).prefetch_related('products')
        products = Product.objects.filter(category__in=categories)
    else:
        products = Product.objects.all()

    # Dynamic filtering based on variant attributes (e.g., color, size)
    variant_filters = {}
    for key, value in request.query_params.items():
        try:
            # Get the VariantAttribute and its corresponding value
            attribute = VariantAttribute.objects.get(slug=key)
            variant_value = VariantValue.objects.get(attribute=attribute, value=value)

            # Add to filter criteria (filtering SKUs by selected variant value)
            variant_filters['skus__variants'] = variant_value
        except VariantAttribute.DoesNotExist:
            continue  # Ignore invalid attribute filters
        except VariantValue.DoesNotExist:
            continue  # Ignore invalid variant values

    if variant_filters:
        products = products.filter(skus__variants__in=variant_filters.values()).distinct()

    # Serialize the filtered products
    serializer = ProductListSerializer(products, many=True, context={'request': request})

    return Response(serializer.data)


# @api_view()
# def products_list(request):
#     products = Product.objects.all()
#     serializer = ProductListSerializer(products, many=True, context={'request': request})
#     return Response(serializer.data)


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@api_view(['GET'])
def product_details_view(request, pk):
    if request.method == 'GET':
        product = Product.objects.get(pk=pk)
        product_serializer = ProductDetailsSerializer(product)
        return Response(product_serializer.data, status=status.HTTP_200_OK)

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
