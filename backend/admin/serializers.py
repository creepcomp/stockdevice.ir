from rest_framework.serializers import ModelSerializer, IntegerField, SerializerMethodField
from .models import Note, Request

class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"

class RequestSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"