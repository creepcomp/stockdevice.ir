import uuid, io
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from PIL import Image, ImageDraw, ImageFont
from .models import Blog, Comment
from .serializers import BlogSerializer, BlogListSerializer, CommentSerializer
from .permissions import IsAdminUserOrReadOnly

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
    queryset = Comment.objects
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
