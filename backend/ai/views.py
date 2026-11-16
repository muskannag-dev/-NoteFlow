
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from notes.models import Note
from .models import NoteSummary
from .serializers import SummarizeNoteSerializer, NoteSummarySerializer
from .services import summarize_note

import logging

logger = logging.getLogger(__name__)


class SummarizeNoteView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = SummarizeNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        note_id = serializer.validated_data['note_id']

        note = get_object_or_404(
            Note,
            id=note_id,
            user=request.user
        )

        if not note.content.strip():
            return Response(
                {
                    "error": "Cannot summarize an empty note."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            summary_number = note.summaries.count() + 1

            summary = summarize_note(
                note.content,
                summary_number
            )

            saved_summary = NoteSummary.objects.create(
                note=note,
                summary=summary
            )

        except Exception:
            logger.exception("Gemini summarization or summary saving failed")

            return Response(
                {
                    "error": "Unable to generate or save summary right now. Please try again later."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response(
            {
                "note_id": note.id,
                "title": note.title,
                "summary": summary,
                "summary_record": NoteSummarySerializer(saved_summary).data
            },
            status=status.HTTP_200_OK
        )

class SummaryHistoryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, note_id):

        note = get_object_or_404(
            Note,
            id=note_id,
            user=request.user
        )

        summaries = note.summaries.all()

        serializer = NoteSummarySerializer(
            summaries,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class DeleteSummaryView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, summary_id):

        summary = get_object_or_404(
            NoteSummary,
            id=summary_id,
            note__user=request.user
        )

        summary.delete()

        return Response(
            {"message": "Summary deleted successfully."},
            status=status.HTTP_200_OK
        )