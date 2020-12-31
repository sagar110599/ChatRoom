"""chat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from .views import Register,Login,Check_Session,Create_room,Join_room,Delete_session

urlpatterns = [
    path('register', Register.as_view()),
    path('login',Login.as_view()),
    path('check_session',Check_Session.as_view()),
    path('create-room',Create_room.as_view()),
    path('join-room',Join_room.as_view()),
    path('delete_session',Delete_session.as_view())
]
