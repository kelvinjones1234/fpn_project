# serializers.py

from rest_framework import serializers
from .models import Transaction

from management_app.models import Levy, Department


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


