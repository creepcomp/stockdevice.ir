from django.db import models

class Banner(models.Model):
    image = models.CharField(max_length=64)
    link = models.CharField(max_length=128, null=True)
    location = models.PositiveSmallIntegerField()