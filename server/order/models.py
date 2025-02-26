import time
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from products.models import Product, SKU

User = get_user_model()


class Voucher(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('PERCENTAGE', 'Percentage'),
        ('FIXED', 'Fixed Amount'),
    )

    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    max_discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Maximum discount amount if using percentage-based discounts."
    )
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    usage_limit = models.PositiveIntegerField(null=True, blank=True,
                                              help_text="Maximum number of times the voucher can be used.")
    times_used = models.PositiveIntegerField(default=0)

    def is_valid(self):
        """
        Check if the voucher is valid based on date and usage limits.
        """
        now = timezone.now()
        if now < self.valid_from or now > self.valid_to:
            return False
        if self.usage_limit and self.times_used >= self.usage_limit:
            return False
        return True

    def calculate_discount(self, subtotal):
        """
        Calculate the discount amount based on the subtotal.
        """
        if self.discount_type == 'PERCENTAGE':
            discount = (subtotal * self.discount_value) / 100
            if self.max_discount_amount:
                discount = min(discount, self.max_discount_amount)
        else:  # Fixed amount
            discount = self.discount_value
        return discount

    def __str__(self):
        return f"{self.code} ({self.get_discount_type_display()})"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_amount(self):
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    def __str__(self):
        return f"Cart {self.id} - {'User: ' + str(self.user)}"


# class CartItem(models.Model):
#     cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     sku = models.ForeignKey(SKU, on_delete=models.CASCADE, null=True, blank=True)
#     quantity = models.PositiveIntegerField(default=1)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     class Meta:
#         unique_together = [['cart', 'product', 'sku']]
#
#     @property
#     def unit_price(self):
#         if self.sku:
#             return self.sku.discount_price or self.sku.price or self.product.base_price
#         return self.product.discount_price or self.product.base_price
#
#     @property
#     def subtotal(self):
#         return self.unit_price * self.quantity
#
#     def clean(self):
#         if self.product.has_variants and not self.sku:
#             raise ValidationError("Select a variant")
#         available_stock = self.sku.stock_quantity if self.sku else self.product.stock_quantity
#         if self.quantity > available_stock:
#             raise ValidationError(f"Not enough stock. Available: {available_stock}")
#
#     def save(self, *args, **kwargs):
#         self.clean()
#         super().save(*args, **kwargs)
#
#     def __str__(self):
#         if self.sku:
#             return f"{self.product.name} - {self.sku.sku_code} (x{self.quantity})"
#         return f"{self.product.name} (x{self.quantity})"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['cart', 'product', 'sku']]

    @property
    def unit_price(self):
        """
        Calculate the unit price based on SKU or product.
        """
        if self.sku:
            return self.sku.discount_price or self.sku.price or self.product.base_price
        return self.product.discount_price or self.product.base_price

    @property
    def subtotal(self):
        """
        Calculate the subtotal for the cart item.
        """
        return self.unit_price * self.quantity

    def clean(self):
        """
        Custom validation for the CartItem model.
        """
        # Ensure SKU is provided if the product has variants
        if self.product.has_variants and not self.sku:
            raise ValidationError("SKU is required for products with variants.")

        # Validate stock availability
        available_stock = self.sku.stock_quantity if self.sku else self.product.stock_quantity
        if self.quantity > available_stock:
            raise ValidationError(f"Not enough stock. Available: {available_stock}")


class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
        ('REFUNDED', 'Refunded'),
    )
    PAYMENT_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    )
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    order_number = models.CharField(max_length=50, unique=True, auto_created=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')

    # Shipping Information
    shipping_city = models.CharField(max_length=100)
    shipping_area = models.CharField(max_length=100)
    shipping_address = models.TextField()

    # Contact Information
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)

    # Amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        validators=[MinValueValidator(0)],
        help_text="Discount applied via voucher/coupon."
    )
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    # Voucher/Coupon
    voucher = models.ForeignKey(Voucher, on_delete=models.SET_NULL, null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Optional fields
    notes = models.TextField(blank=True, null=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number based on timestamp and user ID
            timestamp = int(time.time())
            self.order_number = f"ORD-{timestamp}-{self.user.id}"

        # Apply voucher discount if applicable
        if self.voucher and self.voucher.is_valid():
            self.discount_amount = self.voucher.calculate_discount(self.subtotal)
            self.voucher.times_used += 1
            self.voucher.save()
        else:
            self.discount_amount = 0

        # Calculate total
        self.total = self.subtotal + self.shipping_cost + self.tax - self.discount_amount

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.PROTECT)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    sku = models.ForeignKey(SKU, on_delete=models.PROTECT, null=True, blank=True)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    # Store variant information at the time of order
    variant_info = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = [['order', 'product', 'sku']]

    def save(self, *args, **kwargs):
        # Calculate subtotal
        self.subtotal = self.quantity * self.unit_price

        # Store variant information if SKU exists
        if self.sku:
            self.variant_info = self.sku.variants_dict

        super().save(*args, **kwargs)

    def __str__(self):
        if self.sku:
            return f"{self.order.order_number} - {self.product.name} - {self.sku.sku_code} (x{self.quantity})"
        return f"{self.order.order_number} - {self.product.name} (x{self.quantity})"
