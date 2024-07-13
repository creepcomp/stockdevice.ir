import uuid, io
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from .models import Banner
from .serializers import BannerSerializer, BannerAdminSerializer

class BannerViewSet(ReadOnlyModelViewSet):
    queryset = Banner.objects
    serializer_class = BannerSerializer
    permission_classes = []

class BannerAdminViewSet(ModelViewSet):
    queryset = Banner.objects
    serializer_class = BannerAdminSerializer
    permission_classes = [IsAdminUser]

    @action(["POST"], False)
    def upload(self, request):
        filename = f"{uuid.uuid4()}.jpg"
        image = Image.open(io.BytesIO(request.FILES["image"].read())).convert("RGB")
        draw = ImageDraw.Draw(image)
        draw.text((25, image.height - 50), "stockdevice.ir", (0, 0, 0), ImageFont.load_default(size=32))
        image.save(f"media/{filename}", "jpeg")
        return Response({"image": filename})