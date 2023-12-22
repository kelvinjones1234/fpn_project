# serializers.py

from rest_framework import serializers
from .models import Transaction

from management_app.models import Levy, Department


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class RecieptSerializer(serializers.Serializer):
    reference = serializers.CharField()
    first_name = serializers.CharField()
    middle_name = serializers.CharField()
    last_name = serializers.CharField()
    department = serializers.CharField()
    levy = serializers.CharField()
    amount = serializers.CharField()
    date = serializers.DateTimeField()
    paid = serializers.CharField()
    reference = serializers.CharField()
    email = serializers.EmailField()

