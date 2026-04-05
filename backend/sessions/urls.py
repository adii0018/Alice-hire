from django.urls import path
from .views import (
    CreateSessionView, ListSessionsView, GetSessionView,
    UpdateSessionView, DeleteSessionView
)

urlpatterns = [
    path('create/', CreateSessionView.as_view(), name='create-session'),
    path('', ListSessionsView.as_view(), name='list-sessions'),
    path('<str:code>/', GetSessionView.as_view(), name='get-session'),
    path('<str:code>/update/', UpdateSessionView.as_view(), name='update-session'),
    path('<str:code>/delete/', DeleteSessionView.as_view(), name='delete-session'),
]
