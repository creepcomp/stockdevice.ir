import uuid, io
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from PIL import Image, ImageDraw, ImageFont
from .models import Blog
from .serializers import BlogSerializer, BlogListSerializer
from .permissions import IsAdminUserOrReadOnly

class BlogViewSet(ModelViewSet):
    queryset = Blog.objects
    serializer_class = BlogSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_class(self):
        if self.action == "list":
            return BlogListSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(show=True)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(["GET"], False)
    def get_blog(self, request):
        slug = self.request.query_params.get("slug")
        blog = Blog.objects.get(slug=slug)
        serializer = self.get_serializer(blog)
        return Response(serializer.data)
    
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
