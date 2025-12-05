from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    dni = models.CharField(max_length=20, unique=True)
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} - {self.email}"
