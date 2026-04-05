from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Session
from .serializers import SessionSerializer, CreateSessionSerializer

class CreateSessionView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CreateSessionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        session = Session.objects.create(
            host=request.user.id,
            mode=serializer.validated_data['mode'],
            config=serializer.validated_data.get('config', {})
        )
        
        return Response(SessionSerializer(session).data, status=status.HTTP_201_CREATED)

class ListSessionsView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SessionSerializer

    def get_queryset(self):
        return Session.objects.filter(host=self.request.user.id)

class GetSessionView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SessionSerializer
    lookup_field = 'code'
    queryset = Session.objects.all()

class UpdateSessionView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SessionSerializer
    lookup_field = 'code'

    def get_queryset(self):
        return Session.objects.filter(host=self.request.user.id)

class DeleteSessionView(generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    lookup_field = 'code'

    def get_queryset(self):
        return Session.objects.filter(host=self.request.user.id)
