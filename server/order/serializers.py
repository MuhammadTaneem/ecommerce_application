from django.db import transaction
from rest_framework import serializers

from products.models import Product
from .models import Cart, CartItem, Order, OrderItem


from rest_framework import serializers
from .models import Product, SKU, CartItem



class CartItemSerializer(serializers.ModelSerializer):
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'sku', 'quantity', 'unit_price', 'subtotal']


class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    sku_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, attrs):
        """
        Custom validation to ensure sku_id is provided if the product has variants.
        """
        product_id = attrs.get('product_id')
        sku_id = attrs.get('sku_id')

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({"product_id": "Product does not exist."})

        # Check if the product has variants and sku_id is required
        # import pdb;pdb.set_trace()
        if product.has_variants and not sku_id:
            raise serializers.ValidationError({"sku_id": "SKU ID is required for products with variants."})

        # Validate SKU exists if provided
        if sku_id:
            try:
                SKU.objects.get(id=sku_id, product=product)
            except SKU.DoesNotExist:
                raise serializers.ValidationError({"sku_id": "Invalid SKU for the selected product."})

        return attrs

    def create(self, validated_data):
        """
        Create a new CartItem instance.
        """
        product_id = validated_data['product']
        sku_id = validated_data.get('sku')
        quantity = validated_data['quantity']

        # Get or create the cart item
        cart_item, created = CartItem.objects.get_or_create(
            cart=self.context['cart'],
            product_id=product_id,
            sku_id=sku_id,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return cart_item


# class CartItemCreateSerializer(serializers.Serializer):
#     product_id = serializers.IntegerField()
#     sku_id = serializers.IntegerField(required=False)
#     quantity = serializers.IntegerField(min_value=1)

    # def validate(self, attrs):
    #     """
    #     Custom validation to ensure sku_id is provided if the product has variants.
    #     """
    #     product_id = attrs.get('product_id')
    #     sku_id = attrs.get('sku_id')
    #
    #     try:
    #         product = Product.objects.get(id=product_id)
    #     except Product.DoesNotExist:
    #         raise serializers.ValidationError({"product_id": "Product does not exist."})
    #
    #     # Check if the product has variants and sku_id is required
    #     if product.has_variants and not sku_id:
    #         raise serializers.ValidationError({"sku_id": "SKU ID is required for products with variants."})
    #
    #     return attrs

    # def update(self, instance, validated_data):
    #     return instance


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_amount', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['user']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'sku', 'quantity', 'unit_price', 'subtotal', 'variant_info']
        read_only_fields = ['unit_price', 'subtotal', 'variant_info']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'payment_status',
            'shipping_address', 'shipping_city', 'shipping_state',
            'shipping_country', 'shipping_postal_code', 'contact_email',
            'contact_phone', 'subtotal', 'shipping_cost', 'tax', 'total',
            'notes', 'tracking_number', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['order_number', 'user', 'subtotal', 'total']