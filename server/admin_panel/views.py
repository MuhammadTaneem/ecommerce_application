import json

from django.utils.decorators import method_decorator
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from rest_framework.views import APIView

from core.enum import PermissionEnum
from core.authentication import require_permissions, TauthPermissionClass
from products.models import VariantAttribute, VariantValue, Category, Product, ProductImage, SKU
from products.serializers import VariantAttributeSerializer, VariantValueSerializer, CategorySerializer, \
    ProductSerializer, ProductImageSerializer, SKUSerializer, ProductDetailsSerializer, VariantSerializer


class VariantListCreateView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.VARIANT_LIST_VIEW)
            ]
        elif self.request.method == 'POST':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.VARIANT_CREATE)
            ]
        return [permissions.IsAuthenticated()]

    def get(self, request, format=None):
        variants = VariantAttribute.objects.all()
        serializer = VariantSerializer(variants, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        # import pdb;pdb.set_trace()
        serializer = VariantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VariantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VariantAttribute.objects.all()
    serializer_class = VariantSerializer

    def get_permissions(self):
        if self.request.method == 'PUT':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.VARIANT_UPDATE)
            ]
        elif self.request.method == 'GET':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.VARIANT_DETAILS)
            ]
        elif self.request.method == 'DELETE':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.VARIANT_DELETE)
            ]
        return [permissions.IsAuthenticated()]


# @method_decorator(require_permissions(PermissionEnum.CATEGORY_LIST_VIEW), name='get')
# @method_decorator(require_permissions(PermissionEnum.CATEGORY_CREATE), name='post')
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.CATEGORY_CREATE)
            ]
        elif self.request.method == 'GET':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.CATEGORY_LIST_VIEW)
            ]
        return [permissions.IsAuthenticated()]

    # @require_permissions(PermissionEnum.CATEGORY_CREATE)
    # def post(self, request, *args, **kwargs):
    #     return super().post(request, *args, **kwargs)
    #
    # @require_permissions(PermissionEnum.CATEGORY_LIST_VIEW)
    # def get(self, request, *args, **kwargs):
    #     return super().get(request, *args, **kwargs)


# @method_decorator(require_permissions(PermissionEnum.CATEGORY_DETAILS), name='get')
# @method_decorator(require_permissions(PermissionEnum.CATEGORY_UPDATE), name='post')
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'PUT':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.CATEGORY_UPDATE)
            ]
        elif self.request.method == 'GET':
            return [
                permissions.IsAuthenticated(),
                TauthPermissionClass(PermissionEnum.CATEGORY_DETAILS)
            ]
        return [permissions.IsAuthenticated()]


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # create product
    # create sku if have variant


@api_view(['POST', 'GET'])
def product_create_list_view(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():

                product_data = request.data.get('product')
                if product_data and type(product_data) is str:
                    product_data = json.loads(product_data)

                product_images = request.data.get('images', [])
                # import pdb; pdb.set_trace()
                product_serializer = ProductSerializer(data=product_data)
                if product_serializer.is_valid():
                    product = product_serializer.save()
                    if product_data.get('has_variants', False):
                        skus_data = request.data.get('skus', [])
                        if skus_data and type(skus_data) is str:
                            skus_data = json.loads(skus_data)
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
                    # images_data = request.data.get('images', [])
                    if product_images:
                        for image_data in product_images:
                            image_data['product'] = product.id
                            image_serializer = ProductImageSerializer(data=image_data)
                            if image_serializer.is_valid():
                                image_serializer.save()
                            else:
                                transaction.set_rollback(True)
                                return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    return Response(product_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'GET':
        products = Product.objects.all()
        product_serializer = ProductSerializer(products, many=True)
        return Response(product_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
def product_detail_update_view(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        product_serializer = ProductDetailsSerializer(product)
        return Response(product_serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        try:
            with transaction.atomic():
                product_data = request.data.get('product')
                product_images = request.data.get('images', [])
                errors_dict = {}

                if product_data:
                    product_serializer = ProductDetailsSerializer(product, data=product_data, partial=True)
                    if product_serializer.is_valid():
                        product = product_serializer.save()

                        if product_data.get('has_variants', False):
                            skus_data = request.data.get('skus', [])
                            for sku_data in skus_data:
                                sku_id = sku_data.get('id')
                                if sku_id:
                                    try:
                                        sku = SKU.objects.get(id=sku_id, product=product)
                                        sku_serializer = SKUSerializer(sku, data=sku_data, partial=True)
                                    except SKU.DoesNotExist:
                                        return Response({'error': f'SKU with id {sku_id} not found'},
                                                        status=status.HTTP_404_NOT_FOUND)
                                else:
                                    sku_data['product'] = product.id
                                    sku_serializer = SKUSerializer(data=sku_data)

                                if sku_serializer.is_valid():
                                    sku_serializer.save()
                                else:
                                    transaction.set_rollback(True)
                                    return Response(sku_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    else:
                        errors_dict = product_serializer.errors


                    # image update
                    image_data = request.data.get('images', [])
                    if product_images:
                        for image_data in image_data:
                            image_id = image_data.get('id')
                            if image_id:
                                pass

                    return Response(product_serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(errors_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    elif request.method == 'DELETE':
        try:
            product.is_deleted = True
            product.save(update_fields=['is_deleted'])
            return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductDetailsSerializer


# class ProductImageListCreateView(generics.ListCreateAPIView):
#     queryset = ProductImage.objects.all()
#     serializer_class = ProductImageSerializer

#
# class ProductImageDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = ProductImage.objects.all()
#     serializer_class = ProductImageSerializer


# @api_view(['GET', 'POST'])
# def sku_list_create_view(request):
#     if request.method == 'GET':
#         skus = SKU.objects.all()
#         serializer = SKUSerializer(skus, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
#     elif request.method == 'POST':
#         serializer = SKUSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class SKUDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = SKU.objects.all()
#     serializer_class = SKUSerializer
