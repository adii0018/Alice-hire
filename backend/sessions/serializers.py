from rest_framework import serializers
from .models import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('id', 'code', 'host', 'mode', 'config', 'created_at', 'status')
        read_only_fields = ('id', 'code', 'created_at')

class CreateSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('mode', 'config')
