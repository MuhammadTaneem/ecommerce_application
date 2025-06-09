# models.py
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'
        # fields = [
        #     'id', 'name', 'description', 'image_1', 'image_2', 'image_3',
        #     'start_date', 'end_date', 'is_published'
        # ]
