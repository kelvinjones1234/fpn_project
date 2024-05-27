from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework import generics
from .models import  Transaction
import requests
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from management_app.models import Department, Levy
from .serializers import TransactionSerializer, RecieptSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse, JsonResponse
from django.views import View


class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # Get the necessary data from the request
        user = request.user
        amount = request.data.get('amount')
        matriculation_number = request.data.get('matriculation_number')
        first_name = request.data.get('first_name')
        middle_name = request.data.get('middle_name')
        last_name = request.data.get('last_name')
        department = request.data.get('department')
        levy = request.data.get('levy')

        amount_in_kobo = int(amount) * 100
 
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json',
        }

        data = {
            'amount': amount_in_kobo,
            'currency': 'NGN',
            'email': user.email,
            'callback_url': f'http://localhost:5173/reciept/',

        }

        response = requests.post('https://api.paystack.co/transaction/initialize', json=data, headers=headers)
        response_data = response.json()
        department_obj = get_object_or_404(Department, department=department)
        levy_obj = get_object_or_404(Levy, levy=levy)
        
        # Save payment information in your database
        transaction = Transaction.objects.create(
            reference=response_data['data']['reference'],
            email=user.email,
            amount=amount,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            matriculation_number=matriculation_number,
            department=department_obj,
            levy=levy_obj
        )
        transaction.save()

        return Response(response_data, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    def get(self, request):
        reference = request.query_params.get('reference')
        trxref = request.query_params.get('trxref')

        # Validate that both reference and trxref are present
        if not reference or not trxref:
            return Response({'error': 'Missing reference or trxref parameters'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve payment information from your database based on the reference
        try:
            transaction = Transaction.objects.get(reference=reference)
        except Transaction.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        # Make a request to Paystack to verify the payment using trxref
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json',
        }

        verify_url = f'https://api.paystack.co/transaction/verify/{trxref}'
        verify_response = requests.get(verify_url, headers=headers)
        verify_data = verify_response.json()

        # Check if the 'data' key exists in the response
        if 'data' in verify_data:
            # Check if the payment was successful
            if verify_data['data']['status'] == 'success':
                # Update your database, mark the payment as successful, etc.
                transaction.paid = True
                transaction.save()
                serializer = RecieptSerializer(transaction)

                return Response(serializer.data)
            else:
                # Handle payment verification failure
                transaction.delete()
                return Response({'status': 'error', 'message': 'Payment verification failed'})
        else:
            # Handle the case where the 'data' key is not present in the response
            return Response({'status': 'error', 'message': 'Invalid response from Paystack'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




