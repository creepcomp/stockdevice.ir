from django.db import models
from django.utils.html import strip_tags
from account.models import User
from markdown import markdown

class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)
    parent = models.ForeignKey("self", models.CASCADE, null=True)
    keywords = models.CharField(max_length=256, null=True)
    show = models.BooleanField(default=False)
    slug = models.SlugField(allow_unicode=True)

    class Meta:
        ordering = ["id"]

class Brand(models.Model):
    name = models.CharField(max_length=64, unique=True)
    keywords = models.CharField(max_length=256, null=True)
    show = models.BooleanField(default=False)
    slug = models.SlugField(allow_unicode=True)

    class Meta:
        ordering = ["id"]

class Product(models.Model):
    name = models.CharField(max_length=64, unique=True)
    category = models.ForeignKey(Category, models.CASCADE, null=True)
    brand = models.ForeignKey(Brand, models.CASCADE, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=0, null=True)
    discount = models.DecimalField(max_digits=10, decimal_places=0, null=True)
    available = models.PositiveSmallIntegerField(default=1)
    specification = models.JSONField(null=True)
    body = models.TextField(null=True)
    keywords = models.CharField(max_length=256, null=True)
    show = models.BooleanField(default=False)
    images = models.JSONField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(allow_unicode=True)

    @property
    def description(self):
        html = markdown(self.body)
        return strip_tags(html)[:128]

    def get_absolute_url(self):
        return "/store/product/%d/%s" % (self.id, self.slug)
    
    class Meta:
        ordering = ["id"]

class Comment(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    product = models.ForeignKey(Product, models.CASCADE)
    content = models.CharField(max_length=256)
    score = models.PositiveSmallIntegerField(null=True)

class Order(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    status = models.PositiveSmallIntegerField(default=0)

    def items(self):
        return Item.objects.filter(order=self)
    
    def price(self):
        return sum([x.price for x in self.items])

class Item(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    order = models.ForeignKey(Order, models.CASCADE, null=True)
    product = models.ForeignKey(Product, models.CASCADE)
    quantity = models.PositiveSmallIntegerField(default=1)

    def price(self):
        return (self.product.price - self.product.discount) * self.quantity
