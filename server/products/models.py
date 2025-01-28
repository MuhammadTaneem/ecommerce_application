import uuid

from django.core.validators import FileExtensionValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify
from rest_framework.exceptions import ValidationError


class VariantAttribute(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # if not self.slug:
        self.slug = slugify(self.name)
        super(VariantAttribute, self).save(*args, **kwargs)


class VariantValue(models.Model):
    attribute = models.ForeignKey(VariantAttribute, related_name="values", on_delete=models.CASCADE)
    value = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


class Category(models.Model):
    label = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255, null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='category_images/',
                              validators=[
                                  FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif']),
                              ], null=True, blank=True)

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        slug_prefix = ''
        if self.parent:
            slug_prefix = self.parent.slug + '_'
        # import pdb; pdb.set_trace()
        self.slug = slugify(slug_prefix + self.label)
        if Category.objects.filter(slug=self.slug).exists():
            raise ValidationError(f"A Category '{self.slug}' already exists.")

        super(Category, self).save(*args, **kwargs)


class Brand(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Tag, self).save(*args, **kwargs)


class Product(models.Model):
    name = models.CharField(max_length=255)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock_quantity = models.PositiveIntegerField(null=True, blank=True)
    has_variants = models.BooleanField(default=False)
    short_description = models.TextField(blank=True, null=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    key_features = models.JSONField(default=dict, blank=True)
    description = models.JSONField(default=dict, blank=True)
    additional_info = models.JSONField(default=dict, blank=True)
    brand = models.ForeignKey(Brand, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='products', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='product_thumbnail/',
                              validators=[
                                  FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif']),
                              ]
                              )
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def is_in_stock(self):
        if self.has_variants:
            return self.skus.filter(stock_quantity__gt=0).exists()
        return self.stock_quantity > 0

    def get_available_stock(self):
        if self.has_variants:
            return sum(sku.stock_quantity for sku in self.skus.all())
        return self.stock_quantity

    def low_stock_alert(self):
        if self.has_variants:
            for sku in self.skus.all():
                if sku.stock_quantity < 5:
                    print(f"Low stock alert for {sku.sku_code}")
        else:
            if self.stock_quantity < 5:
                print(f"Low stock alert for {self.name}")

    def __str__(self):
        return f"{self.name} - {self.category.slug}"


class ProductImage(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='images')

    image = models.ImageField(upload_to='product_images/',
                              validators=[
                                  FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif']),
                              ]
                              )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_main', 'created_at']

    def __str__(self):
        return f"{self.product.name} - {self.image.name}"

    # @property
    # def image_url(self):
    #     if self.image:
    #         return self.image.url
    #         # return 'self.image'
    #     return ''


class SKU(models.Model):
    product = models.ForeignKey('Product', related_name='skus', on_delete=models.CASCADE)
    sku_code = models.CharField(max_length=255, unique=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    variants = models.ManyToManyField(VariantValue)

    def __str__(self):
        return self.sku_code

    @property
    def variants_dict(self):
        variants_dict = {}
        for variant in self.variants.all():
            variants_dict[variant.attribute.name] = variant.value
        return variants_dict

    def save(self, *args, **kwargs):
        self.sku_code = str(uuid.uuid4())
        super().save(*args, **kwargs)
    #
    # def generate_sku_code(self):
    #     # Create SKU code based on the product name and variant values
    #     variant_values = [f"{variant.attribute.name}:{variant.value}" for variant in self.variants.all()]
    #     variant_string = "-".join(variant_values)
    #     return f"{self.product.name}-{variant_string}"  # You can customize this format as needed
