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
    product = serializers.IntegerField()
    sku = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, attrs):
        """
        Custom validation to ensure sku is provided if the product has variants.
        """
        product = attrs.get('product')
        sku = attrs.get('sku')

        try:
            product = Product.objects.get(id=product)
            attrs['product'] = product
        except Product.DoesNotExist:
            raise serializers.ValidationError({"product": "Product does not exist."})

        # Check if the product has variants and sku is required
        # import pdb;pdb.set_trace()
        if product.has_variants and not sku:
            raise serializers.ValidationError({"sku": "SKU ID is required for products with variants."})

        # Validate SKU exists if provided
        if sku:
            try:
                sku = SKU.objects.get(id=sku, product=product)
                attrs['sku'] = sku
            except SKU.DoesNotExist:
                raise serializers.ValidationError({"sku": "Invalid SKU for the selected product."})

        return attrs

    def create(self, validated_data):
        """
        Create a new CartItem instance.
        """
        product = validated_data['product']
        sku = validated_data.get('sku')
        quantity = validated_data['quantity']

        # Get or create the cart item

        # import pdb;
        # pdb.set_trace()
        cart_item, created = CartItem.objects.get_or_create(
            cart=self.context['cart'],
            product=product,
            sku=sku,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity = quantity
            cart_item.save()

        return cart_item


# class CartItemCreateSerializer(serializers.Serializer):
#     product = serializers.IntegerField()
#     sku = serializers.IntegerField(required=False)
#     quantity = serializers.IntegerField(min_value=1)

# def validate(self, attrs):
#     """
#     Custom validation to ensure sku is provided if the product has variants.
#     """
#     product = attrs.get('product')
#     sku = attrs.get('sku')
#
#     try:
#         product = Product.objects.get(id=product)
#     except Product.DoesNotExist:
#         raise serializers.ValidationError({"product": "Product does not exist."})
#
#     # Check if the product has variants and sku is required
#     if product.has_variants and not sku:
#         raise serializers.ValidationError({"sku": "SKU ID is required for products with variants."})
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
        # read_only_fields = ['user']


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
