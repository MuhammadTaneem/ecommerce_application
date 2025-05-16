from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Product, ProductImage, SKU, Category, Brand, Tag, VariantAttribute
from .review.models import Review
from .review.serializers import ReviewSerializer
from .serializers import (
    ProductSerializer, ProductImageSerializer, SKUSerializer, CategorySerializer,
    BrandSerializer, TagSerializer, VariantSerializer, FlatCategorySerializer
)


# Product ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(detail=True, methods=['get', 'post'], url_name='images')
    def images(self, request, pk=None):
        product = self.get_object()

        if request.method == 'GET':
            images = ProductImage.objects.filter(product=product)
            serializer = ProductImageSerializer(images, many=True)
            return Response({
                'message': 'Product images retrieved successfully',
                'data': serializer.data
            })

        elif request.method == 'POST':
            images = request.FILES.getlist('images')
            if not images:
                return Response(
                    {
                        'status': 'error',
                        'message': 'No images provided'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            created_images = []
            for image_file in images:
                image = ProductImage.objects.create(
                    product=product,
                    image=image_file
                )
                created_images.append(image)

            serializer = ProductImageSerializer(created_images, many=True)
            return Response({
                'message': f'{len(created_images)} images uploaded successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get','delete'], url_path='images/(?P<image_id>[^/.]+)', url_name='image_detail')
    def image_detail(self, request, pk=None,image_id=None):
        product = self.get_object()
        try:
            image = ProductImage.objects.get(id=image_id, product=product)
        except ProductImage.DoesNotExist:
            return Response({'message': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = ProductImageSerializer(image)
            return Response({
                'message': 'Product image retrieved successfully',
                'data': serializer.data
            })

        elif request.method == 'DELETE':
            image.delete()
            return Response({'message': 'Product image deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get', 'post', 'put'])
    def skus(self, request, pk=None):
        product = self.get_object()

        if request.method == 'GET':
            skus = SKU.objects.filter(product=product)
            serializer = SKUSerializer(skus, many=True)
            return Response({
                'message': 'SKUs retrieved successfully',
                'data': serializer.data
            })

        elif request.method == 'POST':
            data = request.data.copy()
            data['product'] = pk
            serializer = SKUSerializer(
                data=data,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save(product=product)
                return Response({
                    'message': 'SKU created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'status': 'error',
                'message': 'Invalid SKU data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'PUT':
            sku_id = request.data.get('id')
            data = request.data.copy()
            try:
                # Get the existing SKU instance
                sku = SKU.objects.get(id=sku_id, product=product)
                data['product'] = pk
                serializer = SKUSerializer(
                    instance=sku,
                    data=data,
                    partial=True,
                    context={'request': request}
                )

                if serializer.is_valid():
                    serializer.save()
                    return Response({
                        'message': 'SKU updated successfully',
                        'data': serializer.data
                    }, status=status.HTTP_200_OK)
                return Response({
                    'status': 'error',
                    'message': 'Invalid SKU data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            except SKU.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': f'SKU with id {sku_id} not found'

                }, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get', 'put', 'delete'], url_path='skus/(?P<sku_id>[^/.]+)', url_name='sku_detail')
    def sku_detail(self, request, pk=None, sku_id=None):
        product = self.get_object()
        try:
            sku = SKU.objects.get(id=sku_id, product=product)
        except SKU.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'SKU with id {sku_id} not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = SKUSerializer(sku)
            return Response({
                'message': 'SKU retrieved successfully',
                'data': serializer.data
            })

        elif request.method == 'PUT':
            data = request.data.copy()
            data['product'] = pk
            serializer = SKUSerializer(
                instance=sku,
                data=data,
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'SKU updated successfully',
                    'data': serializer.data
                })
            return Response({
                'status': 'error',
                'message': 'Invalid SKU data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            sku.delete()
            return Response({
                'message': 'SKU deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get', 'post', 'delete'])
    def tags(self, request, pk=None):
        product = self.get_object()

        if request.method == 'GET':

            tags = product.tags.all()
            serializer = TagSerializer(tags, many=True)
            return Response({
                'message': 'Tags retrieved successfully',
                'data': serializer.data
            })


        elif request.method == 'POST':
            tag_ids = request.data.get('tag_ids', [])
            
            try:
                # Handle string input (comma-separated)
                if isinstance(tag_ids, str):
                    tag_ids = list(map(int, map(str.strip, tag_ids.split(','))))
                # Handle list input
                elif isinstance(tag_ids, list):
                    tag_ids = list(map(int, map(str, tag_ids)))
                    
                if not tag_ids:
                    return Response({
                        'status': 'error',
                        'message': 'No tags provided'
                    }, status=status.HTTP_400_BAD_REQUEST)

                tags = Tag.objects.filter(id__in=tag_ids)
                if not tags:
                    return Response({
                        'status': 'error',
                        'message': 'No valid tags found'
                    }, status=status.HTTP_404_NOT_FOUND)

                product.tags.add(*tags)
                serializer = TagSerializer(product.tags.all(), many=True)
                return Response({
                    'message': f'{len(tags)} tags added successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
                
            except (ValueError, TypeError):
                return Response({
                    'status': 'error',
                    'message': 'Invalid tag ID format. Please provide numbers separated by commas.'
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get', 'put', 'delete'], url_path='tags/(?P<tag_id>[^/.]+)', url_name='tag_detail')
    def tag_detail(self, request, pk=None, tag_id=None):
        product = self.get_object()
        try:
            tag = product.tags.get(id=tag_id)
        except Tag.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'Tag with id {tag_id} not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = TagSerializer(tag)
            return Response({
                'message': 'Tag retrieved successfully',
                'data': serializer.data
            })

        elif request.method == 'DELETE':
            product.tags.remove(tag)
            return Response({
                'message': 'Tag removed successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get', 'post'])
    def reviews(self, request, pk=None):
        product = self.get_object()

        if request.method == 'GET':
            # Retrieve all reviews for the product
            reviews = Review.objects.filter(product=product)
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            # Create a new review for the product
            serializer = ReviewSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user=request.user, product=product)  # Associate review with user and product
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get', 'put', 'delete'], url_path='reviews/(?P<review_id>[^/.]+)',
            url_name='review_detail')
    def review_detail(self, request, pk=None, review_id=None):
        product = self.get_object()
        try:
            review = Review.objects.get(id=review_id, product=product)
        except Review.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'Review with id {review_id} not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = ReviewSerializer(review)
            return Response({
                'message': 'Review retrieved successfully',
                'data': serializer.data
            })

        elif request.method == 'PUT':
            if review.user != request.user:
                return Response({
                    'status': 'error',
                    'message': 'You can only update your own reviews'
                }, status=status.HTTP_403_FORBIDDEN)

            serializer = ReviewSerializer(
                instance=review,
                data=request.data,
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Review updated successfully',
                    'data': serializer.data
                })
            return Response({
                'status': 'error',
                'message': 'Invalid review data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            if review.user != request.user:
                return Response({
                    'status': 'error',
                    'message': 'You can only delete your own reviews'
                }, status=status.HTTP_403_FORBIDDEN)

            review.delete()
            return Response({
                'message': 'Review deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)

        return Response({'message': 'Internal server error', }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Product Image ViewSet
class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer


# SKU ViewSet
class SKUViewSet(viewsets.ModelViewSet):
    queryset = SKU.objects.all()
    serializer_class = SKUSerializer


# Category ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent=None).all()
    serializer_class = CategorySerializer


# Brand ViewSet
class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


# Tag ViewSet
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


# Variant ViewSet
class VariantViewSet(viewsets.ModelViewSet):
    queryset = VariantAttribute.objects.all()
    serializer_class = VariantSerializer


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def product_context(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        category_serializer = FlatCategorySerializer(categories, many=True)
        variants = VariantAttribute.objects.all()
        variant_serializer = VariantSerializer(variants, many=True)

        brands = Brand.objects.all()
        brand_serializer = BrandSerializer(brands, many=True)
        tags = Tag.objects.all()
        tag_serializer = TagSerializer(tags, many=True)

        return Response(
            {'categories': category_serializer.data,
             'variants': variant_serializer.data,
             'brands': brand_serializer.data,
             'tags': tag_serializer.data,
             },
            status=status.HTTP_200_OK)
