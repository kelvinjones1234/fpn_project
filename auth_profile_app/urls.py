# api/urls.py
from django.urls import path
from .views import SignUpView, UserView

from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('user/', UserView.as_view(), name='user'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
