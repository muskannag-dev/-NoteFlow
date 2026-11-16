from django.shortcuts import render
from rest_framework import generics
from .serializers import RegisterSerializer, UserProfileSerializer,LogoutSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status




class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return  Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        serializeer = LogoutSerializer(data = request.data)

        serializeer.is_valid(raise_exception=True)
        serializeer.save()

        return Response(
            {"message": "Logout Successful"},
            status=status.HTTP_205_RESET_CONTENT
        )



