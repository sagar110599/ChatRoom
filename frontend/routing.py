from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/frontend/room/<room_name>', consumers.ChatRoomConsumer.as_asgi()),
]