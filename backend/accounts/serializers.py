from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

        extra_kwargs = {
            'password': {'write_only':True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class LogoutSerializer(serializers.Serializer):

    refresh = serializers.CharField()

    def validate(self,attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        token = RefreshToken(self.token)
        token.blacklist()


