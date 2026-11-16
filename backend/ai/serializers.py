from rest_framework import serializers
from .models import NoteSummary

class SummarizeNoteSerializer(serializers.Serializer):

    note_id = serializers.IntegerField()


class NoteSummarySerializer(serializers.ModelSerializer):

    class Meta:
        model = NoteSummary
        fields = ['id', 'note', 'summary', 'created_at']
        read_only_fields = ['id', 'note', 'summary', 'created_at']