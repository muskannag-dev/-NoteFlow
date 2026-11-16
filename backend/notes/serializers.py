from rest_framework import serializers
from .models import Category,Note,Subject


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self,value):
        request = self.context.get('request')
        value = value.strip()

        if request:
            queryset = Category.objects.filter(
                user = request.user,
                name__iexact = value
            )

            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError(
                    "You already have a category with this name."
                )

        return value
    
        
class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'subject', 'category', 'is_pinned', 'created_at', 'updated_at']

        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
            value = value.strip()

            if len(value) < 3:
                raise serializers.ValidationError(
                    "Title must contain atleast 3 characters."
                )

            return value

    def validate_content(self, value):
            value = value.strip()

            if not value:
                raise serializers.ValidationError(
                    "Content cannot be empty."
                )

            return value

    def validate_category(self, value):

            request = self.context.get('request')

            if request and value and value.user != request.user:
                raise serializers.ValidationError(
                    "You cannot use another user's category."
                )

            return value

    def validate_subject(self, value):
            request = self.context.get('request')

            if request and value and value.user != request.user:
                raise serializers.ValidationError(
            "You cannot use another user's subject."
                )

            return value



class NotePinSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Note
        fields = ['is_pinned']


class SubjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subject
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        value = value.strip()

        request = self.context.get('request')

        if request:
            queryset = Subject.objects.filter(
                user=request.user,
                name__iexact=value
            )

            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError(
                    "You already have a subject with this name."
                )

        return value


        


