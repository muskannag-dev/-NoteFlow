from django.urls import path
from .views import RegisterView, UserProfileView,LogoutView
from rest_framework_simplejwt.views import(
 TokenObtainPairView,
TokenRefreshView,
)


urlpatterns = [
    path('register/',RegisterView.as_view(), name = 'register'),
    path('login/',TokenObtainPairView.as_view(), name =  'login'),
    path('me/', UserProfileView.as_view(), name = 'user-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name = 'logout')
]