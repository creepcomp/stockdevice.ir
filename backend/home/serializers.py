from rest_framework.serializers import ModelSerializer
from .models import Banner

class BannerSerializer(ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"

class BannerAdminSerializer(ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"