from django.shortcuts import render
from django.http import HttpResponse
from .models import Room,User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
# Create your views here.
class Register(APIView):
    def post(self, request, format=None):
        user_data=request.data
        if user_data['password']==user_data['confirm_password']:
            user=User(username=user_data['uname'],password=user_data['password'])
            user.save()
            return Response({'user_register':'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'user_register':'No Match'}, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView):
    def post(self,request,format=None):
        user_data=request.data
        res=User.objects.filter(username=user_data['uname'], password=user_data['password'])
        if len(res)>0:
            request.session['user_name']=user_data['uname']
            return Response({'user_login':'success'}, status=status.HTTP_200_OK)
        return Response({'user_login':'No Match'}, status=status.HTTP_400_BAD_REQUEST)    

class Check_Session(APIView):
    def get(self,request,format=None):
        if "user_name" in request.session:
            return Response({'session':True,'user_name':request.session['user_name']}, status=status.HTTP_200_OK) 
        return Response({'session':False}, status=status.HTTP_200_OK)     


class Create_room(APIView):
    def post(self,request,format=None):
        user_data=request.data
        room=Room(members=user_data['strength'],password=user_data['passcode'])
        code=room.get_room_code()
        room.save()
        return Response({'created-room':True,'room_name':code,'pass':user_data['passcode']}, status=status.HTTP_200_OK)

class Join_room(APIView):
    def post(self,request,format=None):
        user_data=request.data
        res=Room.objects.filter(code=user_data['code'],password=user_data['passcode'])

        if len(res)>0:
            room=Room.objects.get(code=user_data['code'],password=user_data['passcode'])
            if room.members>0:
                room.members=room.members-1
                room.save()
                return Response({'join-room':'success'}, status=status.HTTP_200_OK)
            else:
                return Response({'join-room':'MAX-Capacity reached'}, status=status.HTTP_200_OK) 

                


        return Response({'join-room':'failure'}, status=status.HTTP_200_OK)    

class Delete_session(APIView):
    def get(self,request,format=None):
        del request.session['user_name']
        return Response({'session':False}, status=status.HTTP_200_OK) 


