import io, uuid
from django.utils import timezone
from django.db.models import Count
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import timedelta
from PIL import Image, ImageDraw, ImageFont
from .models import Request
from .serializers import RequestSerializer

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

from account.models import User
from .serializers import UserSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        user = serializer.save()
        if "password" in self.request.data:
            user.set_password(self.request.data.get("password"))
            user.save()
    
    def perform_update(self, serializer):
        user = serializer.save()
        if "password" in self.request.data:
            user.set_password(self.request.data.get("password"))
            user.save()

from store.models import Product, Category, Comment, Order
from .serializers import ProductSerializer, CategorySerializer, CommentSerializer, OrderSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    @action(["POST"], False)
    def upload(self, request):
        images = []
        for filename, file in request.FILES.items():
            filename = f"{uuid.uuid4()}.jpg"
            image = Image.open(io.BytesIO(file.read())).convert("RGB")
            width, height = image.size
            offset  = int(abs(height-width)/2)
            if width>height:
                image = image.crop([offset, 0, width - offset, height])
            else:
                image = image.crop([0, offset, width, height - offset])
            image.resize([1000, 1000])
            draw = ImageDraw.Draw(image)
            draw.text((25, image.height - 50), "stockdevice.ir", (0, 0, 0), ImageFont.load_default(size=32))
            image.save(f"media/{filename}", "jpeg")
            images.append(filename)
        return Response({"status": "success", "images": images})

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects
    serializer_class = CommentSerializer
    permission_classes = [IsAdminUser]

class OrderViewSet(ModelViewSet):
    queryset = Order.objects
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

from blog.models import Blog
from .serializers import BlogSerializer

class BlogViewSet(ModelViewSet):
    queryset = Blog.objects
    serializer_class = BlogSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(["POST"], False)
    def upload(self, request):
        filename = f"{uuid.uuid4()}.jpg"
        image = Image.open(io.BytesIO(request.FILES["image"].read())).convert("RGB")
        target_size = (1600, 900)
        original_aspect_ratio = image.width / image.height
        target_aspect_ratio = target_size[0] / target_size[1]
        if original_aspect_ratio > target_aspect_ratio:
            new_width = int(target_size[1] * original_aspect_ratio)
            image = image.resize((new_width, target_size[1]))
            crop_left = (new_width - target_size[0]) // 2
            crop_box = (crop_left, 0, crop_left + target_size[0], image.height)
        else:
            new_height = int(target_size[0] / original_aspect_ratio)
            image = image.resize((target_size[0], new_height))
            crop_top = (new_height - target_size[1]) // 2
            crop_box = (0, crop_top, image.width, crop_top + target_size[1])
        image = image.crop(crop_box)
        draw = ImageDraw.Draw(image)
        draw.text((25, image.height - 50), "stockdevice.ir", (0, 0, 0), ImageFont.load_default(size=32))
        image.save(f"media/{filename}", "jpeg")
        return Response({"image": filename})

from home.models import Banner
from .serializers import BannerSerializer

class BannerViewSet(ModelViewSet):
    queryset = Banner.objects
    serializer_class = BannerSerializer
    permission_classes = [IsAdminUser]

    @action(["POST"], False)
    def upload(self, request):
        filename = f"{uuid.uuid4()}.jpg"
        image = Image.open(io.BytesIO(request.FILES["image"].read())).convert("RGB")
        draw = ImageDraw.Draw(image)
        draw.text((25, image.height - 50), "stockdevice.ir", (0, 0, 0), ImageFont.load_default(size=32))
        image.save(f"media/{filename}", "jpeg")
        return Response({"image": filename})
