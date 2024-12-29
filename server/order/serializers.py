from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'sku', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['unit_price', 'subtotal']


class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    sku_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(min_value=1)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'session_id', 'items', 'total_amount', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['user', 'session_id']


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