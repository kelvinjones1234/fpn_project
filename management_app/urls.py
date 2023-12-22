# urls.py

from django.urls import path
from .views import DepartmentListView, LevyByDepartmentView
# from transactions.views import VerifyPaymentView

urlpatterns = [
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    # path('verify-payment/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('levies/<int:department_id>/', LevyByDepartmentView.as_view(), name='levy-list-by-department'),
]
