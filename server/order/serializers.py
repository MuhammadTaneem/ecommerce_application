from django.db import transaction
from rest_framework import serializers

from core.models import AddressBook
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
        """
        Custom validation to ensure sku is provided if the product has variants.
        """
        product = attrs.get('product')
        sku = attrs.get('sku')

        if product.has_variants and not sku:
            raise serializers.ValidationError({"sku": "SKU ID is required for products with variants."})

        # import pdb;
        # pdb.set_trace()
        # Validate SKU exists if provided
        if sku and sku.product != product:
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
#     sku = serializers.IntegerField(required=False, allow_null=True)
#     quantity = serializers.IntegerField(min_value=1)
#
#     def validate(self, attrs):
#         """
#         Custom validation to ensure sku is provided if the product has variants.
#         """
#         product = attrs.get('product')
#         sku = attrs.get('sku')
#
#         try:
#             product = Product.objects.get(id=product)
#             attrs['product'] = product
#         except Product.DoesNotExist:
#             raise serializers.ValidationError({"product": "Product does not exist."})
#
#         # Check if the product has variants and sku is required
#         # import pdb;pdb.set_trace()
#         if product.has_variants and not sku:
#             raise serializers.ValidationError({"sku": "SKU ID is required for products with variants."})
#
#         # Validate SKU exists if provided
#         if sku:
#             try:
#                 sku = SKU.objects.get(id=sku, product=product)
#                 attrs['sku'] = sku
#             except SKU.DoesNotExist:
#                 raise serializers.ValidationError({"sku": "Invalid SKU for the selected product."})
#
#         return attrs
#
#     def create(self, validated_data):
#         """
#         Create a new CartItem instance.
#         """
#         product = validated_data['product']
#         sku = validated_data.get('sku')
#         quantity = validated_data['quantity']
#
#         # Get or create the cart item
#
#         # import pdb;
#         # pdb.set_trace()
#         cart_item, created = CartItem.objects.get_or_create(
#             cart=self.context['cart'],
#             product=product,
#             sku=sku,
#             defaults={'quantity': quantity}
#         )
#
#         if not created:
#             cart_item.quantity = quantity
#             cart_item.save()
#
#         return cart_item


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
    voucher_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'payment_status', 'shipping_city', 'shipping_area',
            'shipping_address', 'contact_email', 'contact_phone', 'subtotal', 'shipping_cost',
            'tax', 'discount_amount', 'total', 'voucher', 'voucher_code', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'discount_amount', 'total', 'created_at', 'updated_at']
        extra_kwargs = {
            'shipping_city': {'required': False},  # Make shipping_city optional
            'shipping_area': {'required': False},  # Make shipping_area optional
            'shipping_address': {'required': False},  # Make shipping_address optional
            'contact_email': {'required': False},  # Make contact_email optional
            'contact_phone': {'required': False},  # Make contact_phone optional
            'subtotal': {'required': False},  # Make subtotal optional
        }

    def validate(self, attrs):
        # import pdb;pdb.set_trace()
        address_id = attrs.get('address_id', None)
        user = self.context['user']
        if address_id:
            try:
                address = AddressBook.objects.get(id=address_id, user=user)
            except AddressBook.DoesNotExist:
                raise serializers.ValidationError("Address does not exist.")
        else:
            address = AddressBook.objects.filter(user=user, is_default=True).first()
            if not address:
                raise serializers.ValidationError("No default address found for the user.")

        attrs['shipping_city'] = address.shipping_city
        attrs['shipping_area'] = address.shipping_area
        attrs['shipping_address'] = address.shipping_address
        if user.phone:
            attrs['contact_phone'] = user.phone_number
        if user.email:
            attrs['contact_email'] = user.email

        voucher_code = attrs.pop('voucher_code', None)
        if voucher_code:
            attrs['voucher'] = self.voucher_code_to_id(voucher_code)
        return attrs

    def voucher_code_to_id(self, value):
        try:
            voucher = Voucher.objects.only('id').get(code=value)
        except Voucher.DoesNotExist:
            raise serializers.ValidationError({"voucher_code": "Invalid voucher code."})
        return voucher



    def create(self, validated_data):
        order = Order.objects.create(**validated_data)
        return order


class VoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voucher
        fields = ['id', 'code', 'discount_type', 'discount_value', 'valid_from', 'valid_to', 'usage_limit',
                  'times_used']
