from django.shortcuts import render

# Create your views here.

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category,Note, Subject
from .serializers import CategorySerializer,NoteSerializer,NotePinSerializer, SubjectSerializer
from django.db.models import Q
from .pagination import NotePagination
from rest_framework.filters import OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count

class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user= self.request.user)


class NoteListCreateView(generics.ListCreateAPIView):

    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NotePagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['title', 'created_at']
    ordering = ['-is_pinned','-created_at']

    def get_queryset(self):
        queryset = Note.objects.filter(user = self.request.user)

        pinned_query = self.request.query_params.get('is_pinned')

        if pinned_query == 'true':
            queryset = queryset.filter(is_pinned = True)

        elif pinned_query == 'false':
            queryset = queryset.filter(is_pinned = False)

        search_query = self.request.query_params.get('search')

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains = search_query) |
                Q(content__icontains = search_query)
            )
        return queryset


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)


class NotePinView(generics.UpdateAPIView):

    serializer_class = NotePinSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user = self.request.user)


class DashboardStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user

        total_notes = Note.objects.filter(
            user=user
        ).count()

        pinned_notes = Note.objects.filter(
            user=user,
            is_pinned=True
        ).count()

        unpinned_notes = Note.objects.filter(
            user=user,
            is_pinned = False
        ).count()

        total_categories = Category.objects.filter(
            user=user
        ).count()

        return Response({
            'total_notes': total_notes,
            'pinned_notes': pinned_notes,
            'unpinned_notes': unpinned_notes,
            'total_categories': total_categories
        })


class RecentNotesView(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(
            user = self.request.user
        ).order_by('-updated_at')[:5]


class CategoryStatsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(
            user = self.request.user
        ).annotate(
            note_count = Count('notes')
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        data = [
            {
                'id': category.id,
                'name': category.name,
                'note_count': category.note_count
            }
            for category in queryset
        ]

        return Response(data)


class SubjectListCreateView(generics.ListCreateAPIView):

    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(
            user=self.request.user
        )