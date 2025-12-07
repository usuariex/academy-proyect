from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Mostrar dni al editar
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('dni',)}),
    )

    # Mostrar dni al crear
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('dni',)}),
    )
