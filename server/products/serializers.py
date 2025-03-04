import uuid

from django.db import transaction
from rest_framework import serializers
from rest_framework.utils import json

from .models import Product, ProductImage, SKU, VariantValue, VariantAttribute, Category, Brand, Tag


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'label', 'slug', 'parent', 'description', 'image', 'subcategories']

    def get_subcategories(self, obj):
        subcategories = Category.objects.filter(parent=obj)
        if subcategories.exists():
            return CategorySerializer(subcategories, many=True).data
        return []


class FlatCategorySerializer(CategorySerializer):
    label = serializers.SerializerMethodField()

    class Meta(CategorySerializer.Meta):
        fields = [field for field in CategorySerializer.Meta.fields if field != 'subcategories']

    def get_label(self, obj):
        return obj.slug.replace('_', ' > ')


class VariantValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariantValue
        fields = ['id', 'attribute', 'value']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'created_at', 'updated_at']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'created_at', 'updated_at']


class SKUSerializer(serializers.ModelSerializer):
    class Meta:
        model = SKU
        fields = ['id', 'product', 'sku_code', 'price', 'discount_price', 'stock_quantity', 'variants_dict', 'variants']

    def run_validation(self, data):
        variants_data = data.get('variants')
        if isinstance(variants_data, list):
            data['variants'] = [list(variant.values())[0] for variant in variants_data]

        price = data.get('price')
        if type(price) is not int or price <= 0:
            data['price'] = 0

        return super().run_validation(data)

    def validate(self, data):

        variants_list = []
        variants_data = data.get('variants')
        for variant in variants_data:
            if variant.attribute.name in variants_list:
                raise serializers.ValidationError({
                    'variants': f"{variant.attribute.name} is added multiple times."
                })
            variants_list.append(variant.attribute.name)
        data['sku_code'] = str(uuid.uuid4())
        price = data.get('price')
        product = data.get('product')
        if not price:
            data['price'] = product.base_price
        return data


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    skus = SKUSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'base_price', 'stock_quantity', 'has_variants', 'short_description',
            'discount_price', 'category', 'key_features', 'description', 'additional_info', 'thumbnail',
            'brand', 'tags', 'created_at', 'updated_at', 'is_active', 'is_deleted', 'images', 'skus', 'average_rating',
            'rating_count'
        ]

    def validate(self, data):
        errors = {}
        if data.get('stock_quantity') is None or data['stock_quantity'] < 0:
            errors["stock_quantity"] = "This field is required, please enter the available stock."
        if not data.get('category'):
            errors["category"] = "This field is required, please enter the available category."

        if errors:
            raise serializers.ValidationError(errors)
        return data

    def create(self, validated_data):
        try:
            with transaction.atomic():
                skus_data = self.initial_data.get('skus', [])
                tags_data = validated_data.pop('tags', [])  # Extract tags from validated data
                product = Product.objects.create(**validated_data)

                if skus_data and type(skus_data) is str:
                    skus_data = json.loads(skus_data)
                if tags_data:
                    product.tags.set(tags_data)

                # Step 2: Handle images
                images_data = self.context.get('request').FILES.getlist('images')
                for image_data in images_data:
                    ProductImage.objects.create(product=product, image=image_data)

                # Step 3: Validate and create SKUs separately
                # import pdb;pdb.set_trace()

                if product.has_variants and skus_data:
                    for sku_data in skus_data:
                        sku_data['product'] = product.id
                        sku_serializer = SKUSerializer(data=sku_data)

                        if sku_serializer.is_valid():
                            sku_serializer.save()
                        else:
                            transaction.rollback()
                else:
                    product.has_variants = False
                    # transaction.rollback()
                product.save()

                return product
        except Exception as e:
            raise serializers.ValidationError({
                "error": f"An error occurred while creating the product: {str(e)}"
            })


class VariantSerializer(serializers.ModelSerializer):
    values = VariantValueSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = VariantAttribute
        fields = ['id', 'name', 'slug', 'values']
        read_only_fields = ['slug']

    def get_values(self, obj):
        related_values = obj.values.all()
        return VariantValueSerializer(related_values, many=True).data

    def create(self, validated_data):
        values_data = self.initial_data.get('values', None)
        attribute = VariantAttribute.objects.create(**validated_data)
        for value_data in values_data:
            VariantValue.objects.create(attribute=attribute, **value_data)
        return attribute

    def update(self, instance, validated_data):
        values_data = self.initial_data.get('values', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        existing_values = instance.values.all()
        processed_value_ids = []
        for value_data in values_data:
            value_id = value_data.get('id')

            if value_id:
                try:
                    value_instance = existing_values.get(id=value_id)
                    value_instance.value = value_data.get('value', value_instance.value)
                    value_instance.attribute = instance
                    value_instance.save()
                    processed_value_ids.append(value_instance.id)
                except VariantValue.DoesNotExist:
                    print("doesn't exits")
                    new_value = VariantValue.objects.create(
                        attribute=instance,
                        **value_data
                    )
                    processed_value_ids.append(new_value.id)
            else:
                print("created")
                new_value = VariantValue.objects.create(
                    attribute=instance,
                    value=value_data.get('value', None)
                )
                processed_value_ids.append(new_value.id)

        existing_values.exclude(id__in=processed_value_ids).delete()
        return instance

    def destroy(self, instance):
        instance.values.all().delete()
        instance.delete()
        return instance
