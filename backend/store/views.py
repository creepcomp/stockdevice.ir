import io, requests, os
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from PIL import Image, ImageDraw, ImageFont
from .models import Product, Category, Comment, Order, Item
from .serializers import ProductSerializer, ProductListSerializer, CategorySerializer, CommentSerializer, OrderSerializer, ItemSerializer
from .serializers import ProductAdminSerializer, CategoryAdminSerializer, CommentAdminSerializer, OrderAdminSerializer

class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.filter(show=True, available__gt=0)
    serializer_class = ProductSerializer
    permission_classes = []

    def get_serializer_class(self):
        if self.action == "LIST":
            return ProductListSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        kwargs = self.request.query_params.dict()
        if "category" in kwargs:
            queryset = Category.objects.get(id=kwargs["category"]).products
            kwargs.pop("category")
        return queryset.filter(**kwargs)

class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.filter(show=True)
    serializer_class = CategorySerializer
    permission_classes = []

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.filter(show=True)
    serializer_class = CommentSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = super().get_queryset()
        product = self.request.query_params.get("product")
        return queryset.filter(product=product)
    
    def perform_create(self, serializer):
        product = Product.objects.get(id=self.request.query_params.get('product'))
        serializer.save(user=self.request.user, product=product)
    
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

class OrderViewSet(ModelViewSet):
    queryset = Order.objects
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        items = Item.objects.filter(user=self.request.user, order=None)
        items.update(order=instance)
    
    def create(self, request, *args, **kwargs):
        items = Item.objects.filter(user=request.user, order=None)
        if items.exists():
            return super().create(request, *args, **kwargs)
        else:
            return Response({"detail": "سبد خرید شما خالی است."}, status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    @action(["POST"], True)
    def pay(self, request, pk=None):
        order = self.get_object()
        if request.user == order.user:
            if all([order.user.username, order.user.email, order.user.postalCode, order.user.address, order.user.phone]):
                response = requests.post("https://api.zarinpal.com/pg/v4/payment/request.json", {
                    "merchant_id": os.environ["zarinpal_merchant_id"],
                    "amount": (order.product.price - order.product.discount) * 10,
                    "description": f"پرداخت سفارش شماره {order.id}",
                    "callback_url": f"https://stockdevice.ir/store/order/{order.id}/",
                    "metadata": {
                        "mobile": order.user.username,
                        "email": order.user.email,
                        "order_id": order.id
                    }
                })
                return Response(response.json(), response.status_code)
            else:
                return Response({"detail": "اطلاعات حساب کاربری شما ناقص است."}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @action(["POST"], True)
    def verify(self, request):
        order = self.get_object()
        if request.user == order.user:
            authority = request.data.get("authority")
            response = requests.post("https://api.zarinpal.com/pg/v4/payment/verify.json", {
                "merchant_id": os.environ["zarinpal_merchant_id"],
                "amount": (order.product.price - order.product.discount) * 10,
                "authority": authority
            })
            data = response.json()
            if data["data"]["code"] == 100:
                order.status = 1
                order.save()
            return Response(data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class ItemViewSet(ModelViewSet):
    queryset = Item.objects
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user, order=None)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        if item.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class ProductAdminViewSet(ModelViewSet):
    queryset = Product.objects
    serializer_class = ProductAdminSerializer
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

class CategoryAdminViewSet(ModelViewSet):
    queryset = Category.objects
    serializer_class = CategoryAdminSerializer
    permission_classes = [IsAdminUser]

class CommentAdminViewSet(ModelViewSet):
    queryset = Comment.objects
    serializer_class = CommentAdminSerializer
    permission_classes = [IsAdminUser]

class OrderAdminViewSet(ModelViewSet):
    queryset = Order.objects
    serializer_class = OrderAdminSerializer
    permission_classes = [IsAdminUser]