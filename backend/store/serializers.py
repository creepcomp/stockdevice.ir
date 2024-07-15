from rest_framework.serializers import ModelSerializer, CharField, IntegerField, PrimaryKeyRelatedField, SerializerMethodField
from .models import Product, Category, Comment, Order, Item
from account.serializers import UserSerializer
from account.models import User

class ProductSerializer(ModelSerializer):
    description = CharField(read_only=True)
    category = PrimaryKeyRelatedField(queryset=Category.objects.all())
    currency = CharField(default="IRT")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["category"] = CategorySerializer(instance.category).data
        return representation

    class Meta:
        model = Product
        fields = "__all__"

class ProductListSerializer(ModelSerializer):
    description = CharField(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "price", "discount", "images", "available", "specification", "description"]

class CategorySerializer(ModelSerializer):
    products = ProductListSerializer(read_only=True, many=True)

    class Meta:
        model = Category
        fields = "__all__"

class CommentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["product", "reply"]

class ItemSerializer(ModelSerializer):
    product = PrimaryKeyRelatedField(queryset=Product.objects.all())
    price = IntegerField(read_only=True)

    class Meta:
        model = Item
        fields = "__all__"
        read_only_fields = ["user"]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['product'] = ProductSerializer(instance.product).data
        return representation

class OrderSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    items = ItemSerializer(read_only=True, many=True)
    price = IntegerField(read_only=True)
    class Meta:
        model = Order
        fields = "__all__"

class ProductAdminSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class CategoryAdminSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class CommentAdminSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductAdminSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = "__all__"

class ItemAdminSerializer(ModelSerializer):
    product = ProductAdminSerializer(read_only=True)
    price = IntegerField(read_only=True)

    class Meta:
        model = Item
        fields = "__all__"

class OrderAdminSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    items = ItemAdminSerializer(read_only=True, many=True)
    price = IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"