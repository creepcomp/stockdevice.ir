import uuid, io
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Blog, Comment
from .serializers import BlogSerializer, BlogListSerializer, CommentSerializer
from .serializers import BlogAdminSerializer, CommentAdminSerializer

class BlogViewSet(ReadOnlyModelViewSet):
    queryset = Blog.objects.filter(show=True)
    serializer_class = BlogSerializer
    permission_classes = []

    def get_serializer_class(self):
        if self.action == "list":
            return BlogListSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()
        kwargs = self.request.query_params.dict()
        return queryset.filter(**kwargs)

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.filter(show=True)
    serializer_class = CommentSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = super().get_queryset()
        blog = self.request.query_params.get("blog")
        return queryset.filter(blog=blog)
    
    def perform_create(self, serializer):
        blog = Blog.objects.get(id=self.request.query_params.get("blog"))
        serializer.save(user=self.request.user, blog=blog)
    
    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return super().create(request, args, kwargs)
        else:
            return Response({"detail": "برای ثبت دیدگاه ابتدا وارد شوید."}, status.HTTP_401_UNAUTHORIZED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

# Admin ViewSets

class BlogAdminViewSet(ModelViewSet):
    queryset = Blog.objects
    serializer_class = BlogAdminSerializer
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

class CommentAdminViewSet(ModelViewSet):
    queryset = Comment.objects
    serializer_class = CommentAdminSerializer
    permission_classes = [IsAdminUser]