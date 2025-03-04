from rest_framework import serializers

from order.models import OrderItem
from products.review.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'rating', 'title', 'comment',
                  'created_at', 'is_verified_purchase']
        read_only_fields = ['user', 'created_at', 'is_verified_purchase']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def validate(self, data):
        # Additional validation logic here
        return data

    # def create(self, validated_data):
    #     validated_data['user'] = self.context['request'].user
    #
    #     product = validated_data['product']
    #     user = validated_data['user']
    #
    #     if OrderItem.objects.filter(order__user=user, product=product, order__status='completed').exists():
    #         validated_data['is_verified_purchase'] = True
    #
    #     return super().create(validated_data)

    def create(self, validated_data):

        user = self.context['request'].user
        product = validated_data['product']

        if OrderItem.objects.filter(order__user=user, product=product, order__status='completed').exists():
            validated_data['is_verified_purchase'] = True
        else:
            raise serializers.ValidationError("you are not permitted to review this product")


        # Check if a review already exists for this user and product
        review, created = Review.objects.update_or_create(
            user=user,
            product=product,
            defaults={
                'rating': validated_data['rating'],
                'comment': validated_data.get('comment', ''),
                'is_verified_purchase': OrderItem.objects.filter(
                    order__user=user,
                    product=product,
                    order__status='completed'
                ).exists()
            }
        )

        return review