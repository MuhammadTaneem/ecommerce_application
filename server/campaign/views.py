# views.py
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Campaign
from .serializers import CampaignSerializer

class CampaignViewSet(ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Handle multipart data for image uploads
        data = request.data.copy()

        # Process image fields to handle mixed file/URL data
        for field in ['image_1', 'image_2', 'image_3']:
            if field in data:
                value = data[field]
                # If value is a string and looks like existing URL, keep it
                if isinstance(value, str) and (
                        value.startswith('/media/') or
                        value.startswith('http') or
                        value == ''
                ):
                    data.pop(field)
                # If it's a file upload, keep as is
                elif hasattr(value, 'read'):
                    pass
                # If it's None or empty, allow clearing
                elif value is None:
                    pass

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)