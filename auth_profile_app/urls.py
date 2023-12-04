# api/urls.py
from django.urls import path
from .views import SignUpView, SignInView, SignOutView, UserView, AllUsersView, VerificationView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('signout/', SignOutView.as_view(), name='signout'),
    path('user/', UserView.as_view(), name='user'),
    path('verify/<str:token>/', VerificationView.as_view(), name='verify'),
    path('alluser/', AllUsersView.as_view(), name='alluser'),
]
