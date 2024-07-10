from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone = models.CharField(max_length=11, null=True)
    postalCode = models.CharField(max_length=10, null=True)
    address = models.TextField(null=True)