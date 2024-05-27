from django.urls import path
from .views import DepartmentListView, LevyByDepartmentView

urlpatterns = [
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('levies/<int:department_id>/', LevyByDepartmentView.as_view(), name='levy-list-by-department'),
]
