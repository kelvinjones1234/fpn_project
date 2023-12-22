from django.urls import path
from .views import TransactionListCreateView, InitiatePaymentView, VerifyPaymentView
from .import views

urlpatterns = [
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('initiate-payment/', InitiatePaymentView.as_view(), name='initiate_payment'), 
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify_payment'),

] 

