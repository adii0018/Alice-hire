from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Alert
from .serializers import AlertSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class CreateAlertView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AlertSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        alert = serializer.save()
        
        channel_layer = get_channel_layer()
        session_code = alert.session_code
        
        async_to_sync(channel_layer.group_send)(
            f"session_{session_code}",
            {
                "type": "alert_update",
                "alert": AlertSerializer(alert).data
            }
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ListAlertsView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AlertSerializer

    def get_queryset(self):
        code = self.kwargs.get('code')
        return Alert.objects.filter(session_code=code)
