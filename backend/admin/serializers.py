from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField
from .models import Request

class RequestSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"

from account.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ["password"]

from store.models import Product, Category, Comment, Order, Item

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class CategorySerializer(ModelSerializer):
    parent = SerializerMethodField()

    def get_parent(self, instance):
        if instance.parent:
            return CategorySerializer(instance.parent).data
        return None
    
    class Meta:
        model = Category
        fields = "__all__"

class CommentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = "__all__"

class ItemSerializer(ModelSerializer):
    product = ProductSerializer(read_only=True)
    price = IntegerField(read_only=True)

    class Meta:
        model = Item
        fields = "__all__"

class OrderSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    items = ItemSerializer(read_only=True, many=True)
    price = IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

from blog.models import Blog

class BlogSerializer(ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Blog
        fields = "__all__"

from home.models import Banner

class BannerSerializer(ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"
