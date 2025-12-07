from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission


class Command(BaseCommand):
    help = "Crea grupos base y asigna permisos"

    def handle(self, *args, **kwargs):
        roles = ["Admin", "Teacher", "Student"]
        for name in roles:
            Group.objects.get_or_create(name=name)

        admin = Group.objects.get(name="Admin")
        teacher = Group.objects.get(name="Teacher")
        student = Group.objects.get(name="Student")

        # Admin: todos los permisos
        admin.permissions.set(Permission.objects.all())

        # Teacher: ver y cambiar estudiantes (ajusta a tu dominio y app_label)
        perms_teacher = Permission.objects.filter(codename__startswith="view_") | \
            Permission.objects.filter(codename__startswith="change_")
        teacher.permissions.set(perms_teacher.distinct())

        # Student: solo ver (limita según tu app_label si quieres)
        perms_student = Permission.objects.filter(codename__startswith="view_")
        student.permissions.set(perms_student)

        self.stdout.write(self.style.SUCCESS("Grupos y permisos configurados"))
