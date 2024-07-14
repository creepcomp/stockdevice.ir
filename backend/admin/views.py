import io, uuid
from django.utils import timezone
from django.db.models import Count
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import timedelta
from PIL import Image, ImageDraw, ImageFont
from .models import Note, Request
from .serializers import NoteSerializer, RequestSerializer

class NoteViewSet(ModelViewSet):
    queryset = Note.objects
    serializer_class = NoteSerializer
    permission_classes = [IsAdminUser]

class RequestViewSet(ModelViewSet):
    queryset = Request.objects
    serializer_class = RequestSerializer
    permission_classes = [IsAdminUser]

class ReportViewSet(ViewSet):
    permission_classes = [IsAdminUser]

    @action(methods=["GET"], detail=False)
    def daily(self, request):
        now = timezone.now()
        report = (
            Request.objects
            .filter(at__gte=now - timedelta(days=30))
            .values("at__date", "http_x_forwarded_for")
            .distinct()
            .annotate(count=Count("http_x_forwarded_for"))
        )
        report = {x["at__date"].isoformat(): x["count"] for x in report}
        return Response(report)