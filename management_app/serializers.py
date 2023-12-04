from rest_framework import serializers
from .models import Levy, Department


class LevySerializer(serializers.ModelSerializer):
    class Meta:
        model = Levy
        fields = ['id', 'levy', 'amount']

class DepartmentSerializer(serializers.ModelSerializer):
    levies = LevySerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'department', 'levies']