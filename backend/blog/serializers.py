from rest_framework.serializers import ModelSerializer, CharField
from account.serializers import UserSerializer
from .models import Blog, Comment

class BlogSerializer(ModelSerializer):
    author = UserSerializer(read_only=True)
    description = CharField(read_only=True)

    class Meta:
        model = Blog
        fields = "__all__"

class BlogListSerializer(ModelSerializer):
    description = CharField(read_only=True)

    class Meta:
        model = Blog
        fields = ["id", "title", "description", "slug", "image"]

class CommentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["blog", "reply"]