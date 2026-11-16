from django.urls import path
from .views import( CategoryListCreateView,CategoryDetailView,NoteListCreateView,
NoteDetailView,NotePinView,DashboardStatsView,RecentNotesView, CategoryStatsView,
SubjectListCreateView,SubjectDetailView)

urlpatterns = [
    path('categories/',CategoryListCreateView.as_view(), name = 'category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name = 'category-detail'),
    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
    path('notes/<int:pk>/pin/', NotePinView.as_view(), name = 'note-pin'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name = 'dashboard-stats'),
    path('notes/recent/',RecentNotesView.as_view(), name = 'recent-notes'),
    path('dashboard/category-stats/',CategoryStatsView.as_view(),name='category-stats'),
    path('subjects/', SubjectListCreateView.as_view(), name='subject-list-create'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),
]