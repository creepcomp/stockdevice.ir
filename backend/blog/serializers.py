from rest_framework.serializers import ModelSerializer, SlugField, CharField
from .models import Blog
from account.serializers import UserSerializer

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
