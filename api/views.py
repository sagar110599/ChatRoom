from django.shortcuts import render
from django.http import HttpResponse
from .models import Room,User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
import datetime
from django.utils import timezone
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
        room=Room(members=user_data['strength'],password=user_data['passcode'],host=request.session['user_name'])
        room.save()
        code=room.get_room_code()
        print(room.get_room_created_at())
        room.expired=room.get_room_created_at()+datetime.timedelta(seconds=2*3600)
        room.save()
        return Response({'created-room':True,'room_name':code,'pass':user_data['passcode']}, status=status.HTTP_200_OK)

class Join_room(APIView):
    def post(self,request,format=None):
        user_data=request.data
        print(user_data)
        res=Room.objects.filter(code=user_data['code'],password=user_data['passcode'])
        
        if len(res)>0:
            room=Room.objects.get(code=user_data['code'],password=user_data['passcode'])
            if(timezone.now()>room.expired):
                return Response({'join-room':'Room has expired'}, status=status.HTTP_200_OK) 
            else:
                if room.members>0:
                    room.reduce_members()
                    request.session['room']=user_data['code']
                    return Response({'join-room':'success'}, status=status.HTTP_200_OK)
                else:
                    return Response({'join-room':'MAX-Capacity reached'}, status=status.HTTP_200_OK) 

                


        return Response({'join-room':'failure'}, status=status.HTTP_200_OK)    

class Delete_session(APIView):
    def get(self,request,format=None):
        del request.session['user_name']
        if 'room' in request.session:
            del request.session['room']
        return Response({'session':False}, status=status.HTTP_200_OK) 

class Room_Size(APIView):
    def post(self,request,format=None):
        user_data=request.data
        print(user_data)
        room=Room.objects.get(code=user_data['room'])
        if(room.host==request.session['user_name']):
            room.members=room.members+int(user_data['strength'])
            room.save()
            return Response({'response':True}, status=status.HTTP_200_OK) 
        else:
            return Response({'response':False}, status=status.HTTP_200_OK)     

class Check_Session_Room(APIView):
    def get(self,request,format=None):
        user_data=request.GET['code']
        host=False
        if "user_name" in request.session and 'room' in request.session:
            if(request.session['room']==user_data):
                r=Room.objects.get(code=user_data)
                if(timezone.now()>r.expired):
                    Response({'session':False}, status=status.HTTP_200_OK)
                else:
                    if(r.host==request.session['user_name']):
                        host=True
                    return Response({'session':True,'user_name':request.session['user_name'],'host':host}, status=status.HTTP_200_OK) 
            else:
                Response({'session':False}, status=status.HTTP_200_OK)

        return Response({'session':False}, status=status.HTTP_200_OK) 

