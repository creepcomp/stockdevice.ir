from rest_framework.serializers import ModelSerializer, CharField
from django.core.validators import RegexValidator

from .models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ["password"]

class UserUpdateSerializer(ModelSerializer):
    first_name = CharField(required=True)
    last_name = CharField(required=True)
    email = CharField(required=True)
    postalCode = CharField(required=True, validators=[
        RegexValidator(r"^\d{10,10}$", "کد پستی میبایست حداقل ۱۰ رقم و معتبر باشد.")
    ])
    phone = CharField(required=True, validators=[
        RegexValidator(r"^\d{11}$", "تلفن ثابت نامعتبر است (نمونه: 02166112233)")
    ])
    address = CharField(required=True)
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "postalCode", "address", "phone"]
        read_only_fields = ["username"]