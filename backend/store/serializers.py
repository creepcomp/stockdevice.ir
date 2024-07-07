from rest_framework.serializers import ModelSerializer, CharField, IntegerField, PrimaryKeyRelatedField
from .models import Product, Category, Brand, Comment, Order, Item
from account.serializers import UserSerializer

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class BrandSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"

class ProductSerializer(ModelSerializer):
    description = CharField(read_only=True)
    category = PrimaryKeyRelatedField(queryset=Category.objects.all())
    brand = PrimaryKeyRelatedField(queryset=Brand.objects.all())

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["category"] = CategorySerializer(instance.category).data
        representation["brand"] = BrandSerializer(instance.brand).data
        return representation

    class Meta:
        model = Product
        fields = "__all__"

class ProductListSerializer(ModelSerializer):
    description = CharField(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "price", "discount", "images", "available", "specification", "description"]

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

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
    items = ItemSerializer(many=True, read_only=True)
    price = IntegerField(read_only=True)
    class Meta:
        model = Order
        fields = "__all__"
