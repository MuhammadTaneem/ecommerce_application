from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction

from products.models import VariantAttribute, VariantValue, Category, Product, ProductImage, SKU
from products.serializers import VariantAttributeSerializer, VariantValueSerializer, CategorySerializer, \
    ProductSerializer, ProductImageSerializer, SKUSerializer, ProductDetailsSerializer


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


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # create product
    # create sku if have variant




@api_view(['POST','GET'])
def product_create_list_view(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                product_data = request.data.get('product')
                product_images = request.data.get('images')
                product_serializer = ProductSerializer(data=product_data)
                if product_serializer.is_valid():
                    product = product_serializer.save()
                    if product_data.get('has_variants', False):
                        skus_data = request.data.get('skus', [])
                        for sku_data in skus_data:
                            sku_data['product'] = product.id
                            sku_serializer = SKUSerializer(data=sku_data)
                            if sku_serializer.is_valid():
                                try:
                                    sku_serializer.save()
                                except ValueError as e:
                                    transaction.set_rollback(True)
                                    raise e
                            else:
                                transaction.set_rollback(True)
                                return Response(sku_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    return Response(product_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'GET':
        products = Product.objects.all()
        product_serializer = ProductSerializer(products, many=True)
        return Response(product_serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailsSerializer



class ProductImageListCreateView(generics.ListCreateAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer


class ProductImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer


@api_view(['GET', 'POST'])
def sku_list_create_view(request):
    if request.method == 'GET':
        skus = SKU.objects.all()
        serializer = SKUSerializer(skus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = SKUSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SKUDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SKU.objects.all()
    serializer_class = SKUSerializer
