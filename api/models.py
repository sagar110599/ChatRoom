from django.db import models
import string
import random


def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

def generate_unique_pass_code():
    length = 4

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=password).count() == 0:
            break

    return code


class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    password=models.CharField(max_length=50)
    members=models.IntegerField(default=1)
    host=models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    expired=models.DateTimeField(auto_now_add=True)
    def get_room_created_at(self):
        return self.created_at
    def get_room_code(self):
        return self.code
    def reduce_members(self):
        print(self.code,self.password,self.members)
        self.members=self.members-1
        self.save()    

class User(models.Model):
    username=models.CharField(max_length=50, unique=True)
    password=models.CharField(max_length=50)    
