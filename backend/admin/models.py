from django.db import models

class Request(models.Model):
    http_x_forwarded_for = models.CharField(max_length=64)
    http_user_agent = models.CharField(max_length=256)
    method = models.CharField(max_length=16)
    path = models.CharField(max_length=256)
    status_code = models.PositiveSmallIntegerField()
    at = models.DateTimeField(auto_now=True)