import pdb

from django.db import transaction
from rest_framework import serializers

from core.models import Address
from products.models import Product
from .models import Cart, CartItem, Order, OrderItem, Voucher

from rest_framework import serializers
from .models import Product, SKU, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'sku', 'quantity', 'unit_price', 'subtotal']

    def validate(self, attrs):
        # Get the instance if this is an update operation
        instance = getattr(self, 'instance', None)
        
        # For update operations, use existing values if not provided
        product = attrs.get('product', getattr(instance, 'product', None))
        sku = attrs.get('sku', getattr(instance, 'sku', None))

        # Skip validation if only quantity is being updated
        if instance and not (attrs.get('product') or attrs.get('sku')):
            return attrs

        if not product:
            raise serializers.ValidationError({"product": "Product is required."})

        if not product.has_variants:
            return attrs

        if product.has_variants and not sku:
            raise serializers.ValidationError({"sku": "SKU ID is required for products with variants."})

        if sku and sku.product != product:
            raise serializers.ValidationError({"sku": "Invalid SKU for the selected product."})

        return attrs

    def create(self, validated_data):
        product = validated_data['product']
        sku = validated_data.get('sku')
        quantity = validated_data['quantity']


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

    def update(self, instance, validated_data):
        # Only update quantity if that's all that was provided
        quantity = validated_data.get('quantity', instance.quantity)
        instance.quantity = quantity
        instance.save()
        return instance



class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_amount', 'total_items', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'sku', 'quantity', 'unit_price', 'subtotal', 'variant_info']
        read_only_fields = ['unit_price', 'subtotal', 'variant_info']


class OrderSerializer(serializers.ModelSerializer):
    voucher_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'payment_status', 'city','area','address_line1','address_line2',
            'subtotal', 'shipping_cost','phone_number',
            'tax', 'discount_amount', 'total', 'voucher', 'voucher_code', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'discount_amount', 'total', 'created_at', 'updated_at']
        extra_kwargs = {
            'city': {'required': False},  # Make shipping_city optional
            'area': {'required': False},  # Make shipping_area optional
            'address_line1': {'required': False},  # Make shipping_address optional
            'address_line2': {'required': False},  # Make shipping_address optional
            'phone_number': {'required': False},  # Make contact_phone optional
            'subtotal': {'required': False},  # Make subtotal optional
        }

    def validate(self, attrs):
        # import pdb;pdb.set_trace()
        address_id = attrs.get('address_id', None)
        user = self.context['user']
        if address_id:
            try:
                address = Address.objects.get(id=address_id, user=user)
            except Address.DoesNotExist:
                raise serializers.ValidationError("Address does not exist.")
        else:
            address = Address.get_default_for_user(user)
            if not address:
                raise serializers.ValidationError("No default address found for the user.")

        attrs['city'] = address.city
        attrs['area'] = address.area
        attrs['address_line1'] = address.address_line1
        attrs['address_line2'] = address.address_line2
        attrs['phone_number'] = address.phone_number
        voucher_code = attrs.pop('voucher_code', None)
        if voucher_code:
            voucher = self.voucher_code_to_id(voucher_code)
            if not voucher.is_valid():
                raise serializers.ValidationError({"voucher_code": "Invalid or expired voucher code."})
            attrs['voucher'] = voucher
        return attrs

    def voucher_code_to_id(self, value):
        try:
            voucher = Voucher.objects.get(code=value)
        except Voucher.DoesNotExist:
            raise serializers.ValidationError({"voucher_code": "Invalid voucher code."})
        return voucher



    def create(self, validated_data):
        order = Order.objects.create(**validated_data)
        return order


class OrderDetailSerializer(OrderSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ['items']

class VoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voucher
        fields = ['id', 'code', 'discount_type', 'discount_value', 'valid_from', 'valid_to', 'usage_limit','max_discount_amount',
                  'times_used']
