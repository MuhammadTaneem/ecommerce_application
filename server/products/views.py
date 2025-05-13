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

    @action(detail=True, methods=['get', 'post'])
    def reviews(self, request, pk=None):
        """
        Handles GET and POST requests for reviews related to a specific product.
        - GET: Retrieve all reviews for the product.
        - POST: Create a new review for the product.
        """
        product = self.get_object()  # Get the product instance based on `pk`

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