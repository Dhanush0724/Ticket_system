from django.urls import path
from .views import TicketListCreateView, TicketUpdateView

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:id>/', TicketUpdateView.as_view(), name='ticket-update'),
]
