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


@api_view(['GET'])
def verify_email(request, uidb64, token):
    """
    View to verify user's email address using the verification token.
    """
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'detail': 'Email successfully verified.'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([AllowAny])
class SignUpView(APIView):
    """
    Custom registration view without using django-allauth.
    """
    def send_verification_email(self, request, user):
        # Implement the email sending logic here
        pass

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send email verification
            self.send_verification_email(request, user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.id))
            token = default_token_generator.make_token(user)
            activation_link = f'{request.build_absolute_uri("/")[:-1]}/api/verify-email/{uidb64}/{token}/'

            return Response({'verification': activation_link}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def send_verification_email(self, request, user):
    #     subject = 'Activate Your Account'
    #     uidb64 = urlsafe_base64_encode(bytes(user.id))
    #     token = default_token_generator.make_token(user)
    #     activation_link = f'{request.build_absolute_uri("/")[:-1]}/verify-email/{uidb64}/{token}/'
    #     message = render_to_string('email_verification.html', {'activation_link': activation_link})
    #     plain_message = strip_tags(message)

    #     send_mail(subject, plain_message, 'from@example.com', [user.email], html_message=message)
    #     return Response({'activation_link': activation_link})



    

        


