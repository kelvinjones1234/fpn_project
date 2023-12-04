from django.shortcuts import render
from management_app.models import Department, Levy
from rest_framework import generics
from .serializers import DepartmentSerializer, LevySerializer

class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class LevyByDepartmentView(generics.ListAPIView):
    serializer_class = LevySerializer

    def get_queryset(self):
        department_id = self.kwargs['department_id']
        return Levy.objects.filter(department_id=department_id)