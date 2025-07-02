# models.py
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'description', 'image',
            'start_date', 'end_date', 'is_published'
        ]

    def get_image(self, obj):
        request = self.context.get('request')
        if not request:
            return None
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None