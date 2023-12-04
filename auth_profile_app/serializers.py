from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password')

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class SignInSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate_user(self, validated_data):
        user = authenticate(email=validated_data['email'], password=validated_data['password'])
        if not user:
             raise ValidationError('user not found')
        return user
    
class UserSerializer(serializers.ModelSerializer):
     class Meta:
        model = User
        fields = ['email', 'id']

class AllUserSerializer(serializers.Serializer):
    class Meta:
        model = User
        field = ['email', 'id']