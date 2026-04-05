import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SignalingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_code = self.scope['url_route']['kwargs']['code']
        self.room_group_name = f'session_{self.session_code}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'peer_joined',
                'user_id': self.scope['user'].id if self.scope['user'].is_authenticated else None
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'peer_left',
                'user_id': self.scope['user'].id if self.scope['user'].is_authenticated else None
            }
        )
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': message_type,
                'data': data,
                'sender_channel': self.channel_name
            }
        )

    async def peer_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'peer_joined',
            'user_id': event['user_id']
        }))

    async def peer_left(self, event):
        await self.send(text_data=json.dumps({
            'type': 'peer_left',
            'user_id': event['user_id']
        }))

    async def offer(self, event):
        if event['sender_channel'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'offer',
                'offer': event['data'].get('offer')
            }))

    async def answer(self, event):
        if event['sender_channel'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'answer',
                'answer': event['data'].get('answer')
            }))

    async def ice(self, event):
        if event['sender_channel'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'ice',
                'candidate': event['data'].get('candidate')
            }))

    async def alert_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'alert_update',
            'alert': event['alert']
        }))
