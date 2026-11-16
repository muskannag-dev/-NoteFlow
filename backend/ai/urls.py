from django.urls import path
from .views import (
    SummarizeNoteView,
    SummaryHistoryView,
    DeleteSummaryView
)

urlpatterns = [
    path(
        'summarize/',
        SummarizeNoteView.as_view(),
        name='summarize-note'
    ),

    path(
        'notes/<int:note_id>/summaries/',
        SummaryHistoryView.as_view(),
        name='summary-history'
    ),

    path(
        'summaries/<int:summary_id>/',
        DeleteSummaryView.as_view(),
        name='delete-summary'
    ),
]