from django.urls import re_path
from .consumer import SignalingConsumer

websocket_urlpatterns = [
    re_path(r'ws/session/(?P<code>\w+)/$', SignalingConsumer.as_asgi()),
]
