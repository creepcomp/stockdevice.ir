import uuid, io
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Banner
from .serializers import BannerSerializer
from .permissions import IsAdminUserOrReadOnly

class BannerViewSet(ReadOnlyModelViewSet):
    queryset = Banner.objects
    serializer_class = BannerSerializer
    permission_classes = []
