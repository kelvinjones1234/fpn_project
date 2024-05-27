from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from .models import User
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import login, logout
from .serializers import SignUpSerializer, MyTokenObtainPairSerializer, UserSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_str, force_bytes
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator

from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



@permission_classes([AllowAny])
class SignUpView(APIView):
    

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Your account have been activated successfully", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

        


