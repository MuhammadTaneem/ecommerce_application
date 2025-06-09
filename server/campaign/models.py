# models.py
from django.db import models

class Campaign(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image_1 = models.ImageField(upload_to='campaigns/', blank=True, null=True)
    image_2 = models.ImageField(upload_to='campaigns/', blank=True, null=True)
    image_3 = models.ImageField(upload_to='campaigns/', blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.name