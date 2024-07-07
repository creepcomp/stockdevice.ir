import io, uuid, requests, os
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from PIL import Image, ImageDraw, ImageFont
from .models import Product, Category, Brand, Comment, Order, Item
from .serializers import ProductSerializer, ProductListSerializer
from .serializers import CategorySerializer, BrandSerializer
from .serializers import CommentSerializer
from .serializers import OrderSerializer, ItemSerializer
from .permissions import IsAdminUserOrReadOnly

class ProductViewSet(ModelViewSet):
    queryset = Product.objects
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_class(self):
        if self.action == "LIST":
            return ProductListSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        kwargs = self.request.query_params.dict()
        if self.request.user.is_staff:
            return queryset.filter(**kwargs)
        return queryset.filter(show=True, available__gt=0, **kwargs)

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

    @action(["POST"], False)
    def sendTelegram(self, request):
        product = self.get_object()

        images = {}
        for x in product.images:
            images[x] = open("media/" + x, 'rb')

        requests.post("https://api.telegram.org/bot6249661280:AAFOSbYigitSYDoBGS_VyVGZ1rT4UhFbtVo/sendMediaGroup", data={
            "chat_id": -1001892890794,
            "media": [
                {
                    "type": "photo",
                    "media": "attach://" + x
                }
                for x in product.images
            ],
            "caption": f"{product.name}\n\n{[f"{k}: {v}\n" for k, v in product.specification.items()]}\n\n{product.description}"
        }, files=images)

        return Response({"status": "success"})

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(show=True)

class BrandViewSet(ModelViewSet):
    queryset = Brand.objects
    serializer_class = BrandSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(show=True)

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        kwargs = self.request.query_params.dict()
        return queryset.filter(**kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderViewSet(ModelViewSet):
    queryset = Order.objects
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    @action(["POST"], False)
    def _create(self, request):
        items = Item.objects.filter(order__isnull=True)
        if items.exists():
            serializer = OrderSerializer(data=request.data)
            if serializer.is_valid():
                order = serializer.save()
                items.update(order=order)
                return Response({"detail": "سفارش شما با موفقیت ایجاد شد."})
        else:
            return Response({"detail": "سبد خرید شما خالی است."}, 400)
    
    @action(["GET"], True)
    def pay(self, request):
        order = self.get_object()
        user = order.user
        if all([user.username, user.email, user.postalCode, user.address, user.phone]):
            response = requests.post("https://api.zarinpal.com/pg/v4/payment/request.json", {
                "merchant_id": os.environ["zarinpal_merchant_id"],
                "amount": (order.product.price - order.product.discount) * 10,
                "description": f"پرداخت سفارش شماره {order.id}",
                "callback_url": f"https://stockdevice.ir/store/order/{order.id}/",
                "metadata": {
                    "mobile": user.username,
                    "email": user.email,
                    "order_id": order.id
                }
            })
            return Response(response.json(), response.status_code)
        else:
            return Response({"detail": "اطلاعات حساب کاربری شما ناقص است."}, 400)

    @action(["POST"], True)
    def verify(self, request):
        order = self.get_object()
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

class ItemViewSet(ModelViewSet):
    queryset = Item.objects
    serializer_class = ItemSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Item.objects.filter(user=self.request.user)
        else:
            return []
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
