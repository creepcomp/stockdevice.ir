from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField
from .models import Request

class RequestSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"