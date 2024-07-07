import uuid, io
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from PIL import Image, ImageDraw, ImageFont
from .models import Banner
from .serializers import BannerSerializer
from .permissions import IsAdminUserOrReadOnly

class BannerViewSet(ModelViewSet):
    queryset = Banner.objects
    serializer_class = BannerSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    @action(["POST"], False)
    def upload(self, request):
        filename = f"{uuid.uuid4()}.jpg"
        image = Image.open(io.BytesIO(request.FILES["image"].read())).convert("RGB")
        draw = ImageDraw.Draw(image)
        draw.text((25, image.height - 50), "stockdevice.ir", (0, 0, 0), ImageFont.load_default(size=32))
        image.save(f"media/{filename}", "jpeg")
        return Response({"image": filename})
