from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ('id', 'session_code', 'type', 'severity', 'timestamp', 'metadata')
        read_only_fields = ('id', 'timestamp')
