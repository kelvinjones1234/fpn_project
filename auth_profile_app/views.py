from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import login, logout
from .serializers import SignUpSerializer, SignInSerializer, UserSerializer, AllUserSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404


class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]


    def perform_create(self, serializer):
        user = serializer.save()
        user.generate_verification_token()
        user.save()

        # Send verification email
        verification_url = f'http://localhost:8000/api/verify/{user.verification_token}/'
        send_mail(
            'Verify Your Email',
            f'Click the following link to verify your email: {verification_url}',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        return Response({'message': 'User registered successfully. Check your email for verification.'}, status=status.HTTP_201_CREATED)




class VerificationView(APIView):
    def get(self, request, token):
        user = get_object_or_404(User, verification_token=token)
        user.is_active = True
        user.verification_token = None
        user.save()
        return Response({'message': "You've successfully created an account"}, status=200)



class SignInView(APIView):
    serializer_class = SignInSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validate_user(request.data)
        login(request, user)

        return Response({serializer.data['email']}, status=status.HTTP_200_OK)


class SignOutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({'detail': 'Successfully signed out'}, status=status.HTTP_200_OK)
    

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]  # Use square brackets for the import

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AllUsersView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        user_data = User.objects.all()
        serializer = UserSerializer(user_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        


