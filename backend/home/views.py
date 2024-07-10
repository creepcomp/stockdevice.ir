import uuid, io
from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import Banner
from .serializers import BannerSerializer

class BannerViewSet(ReadOnlyModelViewSet):
    queryset = Banner.objects
    serializer_class = BannerSerializer
    permission_classes = []