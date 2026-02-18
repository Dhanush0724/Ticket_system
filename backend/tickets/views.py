from rest_framework import generics
from django.db.models import Q
from .models import Ticket
from .serializers import TicketSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.db.models import Avg

class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = Ticket.objects.all()

        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        status = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category=category)

        if priority:
            queryset = queryset.filter(priority=priority)

        if status:
            queryset = queryset.filter(status=status)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return queryset


class TicketUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    lookup_field = 'id'


class TicketStatsView(APIView):

    def get(self, request):
        total_tickets = Ticket.objects.count()

        open_tickets = Ticket.objects.filter(status='open').count()

        # Average tickets per day
        daily_counts = (
            Ticket.objects
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .values('count')
        )

        avg_tickets_per_day = daily_counts.aggregate(
            avg=Avg('count')
        )['avg'] or 0

        # Priority breakdown
        priority_breakdown_qs = (
            Ticket.objects
            .values('priority')
            .annotate(count=Count('id'))
        )

        priority_breakdown = {
            item['priority']: item['count']
            for item in priority_breakdown_qs
        }

        # Category breakdown
        category_breakdown_qs = (
            Ticket.objects
            .values('category')
            .annotate(count=Count('id'))
        )

        category_breakdown = {
            item['category']: item['count']
            for item in category_breakdown_qs
        }

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_tickets_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown
        })