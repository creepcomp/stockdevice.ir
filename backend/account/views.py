import random, requests, re, os
from django.contrib.auth import login, logout, authenticate
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST
from .models import User
from .serializers import UserSerializer, UserUpdateSerializer
from datetime import datetime

def send_sms(to, text):
    return requests.post("https://rest.payamak-panel.com/api/SendSMS/SendSMS", json={
        "username": os.environ["melipayamak_username"],
        "password": os.environ["melipayamak_password"],
        "from": "50004001966744",
        "to": to,
        "text": text
    })

class UserViewSet(ModelViewSet):
    queryset = User.objects
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data.get("password"))
        user.save()
    
    def perform_update(self, serializer):
        user.set_password(self.request.data.get("password"))
        user.save()

class AuthViewSet(ViewSet):
    temp_codes = {}

    @action(["GET"], False)
    def me(self, request):
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        else:
            return Response({"detail": "کاربر وارد نشده است."}, 400)

    @action(["POST"], False)
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username and password:
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return Response({"detail": "ورود با موفقیت انجام شد."})
            else:
                return Response({"detail": "نام کاربری (شماره همراه) یا رمز عبور اشتباه است."}, HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "عدم وجود پارامتر های مورد نیاز (نام کاربری، رمز عبور)"}, HTTP_400_BAD_REQUEST)
    
    @action(["GET"], False)
    def logout(self, request):
        logout(request)
        return Response({"message": "خروج با موفقیت انجام شد."})
    
    @action(["POST"], False)
    def register(self, request):
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        username = request.data.get("username")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")
        code = request.data.get("code")
        if first_name and last_name and username and code and password and confirm_password:
            if code == self.temp_codes[username]["code"]:
                user = authenticate(request, number=username)
                if not user:
                    if re.match("^[A-z].{8,}$", password):
                        if password == confirm_password:
                            user = User.objects.create_user(username, password)
                            login(request, user)
                            return Response({"detail": "ثبت نام با موفقیت انجام شد."})
                        else:
                            return Response({"confirm_password": "تکرار رمزعبور با رمز عبور مغایرت دارد."}, HTTP_400_BAD_REQUEST)
                    else:
                       return Response({"password": "رمز عبور می بایست حداقل 8 کاراکتر و از حروف انگلیسی باشد."}, HTTP_400_BAD_REQUEST) 
                else:
                    return Response({"username": "این نام کاربری (شماره همراه) قبلاً استفاده شده است."}, HTTP_400_BAD_REQUEST)
            else:
                return Response({"code": "کد وارد شده نامعتبر است."}, HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "عدم وجود پارامتر های مورد نیاز (لطفا فیلد های مورد نیاز را بررسی کنید)"}, HTTP_400_BAD_REQUEST)
    
    @action(["POST"], False)
    def sendCode(self, request):
        username = request.data.get("username")
        if username:
            if username in self.temp_codes:
                time = (datetime.now() - self.temp_codes[username]["at"]).total_seconds()
                if time < 5:
                    return Response({"message": f"لطفا {5 - time} ثانیه دیگر مجدد تلاش نمایید."}, HTTP_400_BAD_REQUEST)
            code = random.randint(10000, 99999)
            response = send_sms(username, f"استوک دیوایس\nکد موقت شما: {code}\nلغو۱۱")
            if response.ok:
                self.temp_codes[username] = {
                    "code": code,
                    "at": datetime.now()
                }
                return Response({"message": "کد به صورت پیامک به شماره شما ارسال شد."})
            else:
                return Response({"message": "خطایی در ارسال پیامک وجود دارد (لطفا با پشتیبانی تماس بگیرید)."}, HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "عدم وجود پارامتر های مورد نیاز (نام کاربری (شماره همراه))"}, HTTP_400_BAD_REQUEST)
    
    @action(["POST"], False)
    def changePassword(self, request):
        username = request.data.get("username")
        code = request.data.get("code")
        password = request.data.get("password")
        new_password = request.data.get("new_password")
        if username and code and password and new_password:
            if code == self.temp_codes[username]["code"]:
                user = User.objects.get(username=username)
                if user.check_password(password):
                    if re.match("^[A-z].{8,}$", new_password):
                        user.set_password(new_password)
                        user.save()
                        return Response({"message": "رمز عبور با موفقیت تغییر کرد."})
                    else:
                        return Response({"message": "رمز عبور جدید می بایست حداقل 8 کاراکتر و از حروف انگلیسی باشد."}, HTTP_400_BAD_REQUEST)
                else:
                    return Response({"message": "رمز قدیمی نادرست می باشد."}, HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "کد نامعتبر می باشد."}, HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "عدم وجود پارامتر های مورد نیاز (نام کاربری، کد یکبار مصرف، رمز قدیمی، رمز جدید)"}, HTTP_400_BAD_REQUEST)
    
    @action(["POST"], False)
    def updateProfile(self, request):
        if request.user.is_authenticated:
            serializer = UserUpdateSerializer(request.user, request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"detail": "اطلاعات حساب کاربری شما با موفقیت تغییر کرد."})
            else:
                return Response(serializer.errors, 400)
        else:
            return Response({"detail": "ابتدا وارد حساب کاربری خود شوید."}, 400)
