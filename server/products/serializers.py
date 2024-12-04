from rest_framework import serializers
# from social_core.utils import slugify

from .models import VariantAttribute, VariantValue, Category, Product, ProductImage, SKU
from django.conf import settings


class VariantAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariantAttribute
        fields = ['id', 'name', 'slug']


class VariantDetailAttributeSerializer(VariantAttributeSerializer):
    values = serializers.SerializerMethodField()

    class Meta(VariantAttributeSerializer.Meta):
        fields = VariantAttributeSerializer.Meta.fields + ['values']

    def get_values(self, obj):
        if obj.values.exists():
            return VariantValueSerializer(obj.values, many=True).data
        return []


class VariantValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariantValue
        fields = ['id', 'attribute', 'value']


class VariantSerializer(serializers.ModelSerializer):
    values = VariantValueSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = VariantAttribute
        fields = ['id', 'name', 'slug', 'values']
        read_only_fields = ['slug']

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
                    print("dosent exits")
                    new_value = VariantValue.objects.create(
                        attribute=instance,
                        **value_data
                    )
                    processed_value_ids.append(new_value.id)
            else:
                print("created")
                new_value = VariantValue.objects.create(
                    attribute=instance,
                    value=value_data.get('value',None)
                )
                processed_value_ids.append(new_value.id)

        existing_values.exclude(id__in=processed_value_ids).delete()

        return instance


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


class ProductImageSerializer(serializers.ModelSerializer):
    # image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'is_main', 'created_at', 'updated_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


class SKUSerializer(serializers.ModelSerializer):
    class Meta:
        model = SKU
        fields = ['id', 'product', 'sku_code', 'price', 'stock_quantity', 'variants_dict', 'variants']

    def validate(self, data):
        variants_list = []
        # import pdb;pdb.set_trace()
        for variant in data.get('variants'):
            if variant.attribute.name in variants_list:
                raise serializers.ValidationError({
                    'variants': f"{variant.attribute.name} is added multiple times."
                })
            variants_list.append(variant.attribute.name)
        return data

    def create(self, validated_data):
        # Pop variants from validated_data
        variants_data = validated_data.pop('variants', [])

    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', [])


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'base_price', 'stock_quantity', 'has_variants',
                  'images', 'category', 'key_features']

    def validate_category(self, value):
        if not value or value == '':
            raise serializers.ValidationError("Category is required.")
        return value


class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'base_price', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        image = obj.images.filter(is_main=True).first() or obj.images.first()

        if image and request:
            return request.build_absolute_uri(image.image.url)
        elif image and not request:
            return image.image.url
        return None


class ProductDetailsSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    skus = SKUSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'base_price', 'stock_quantity', 'has_variants', 'additional_info', 'short_description',
                  'discount_price',
                  'category', 'key_features', 'description', 'images', 'skus']

    def validate_category(self, value):
        if not value or value == '':
            raise serializers.ValidationError("Category is required.")
        return value
