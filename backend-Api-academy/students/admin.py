
from django.contrib import admin
from .models import Student, Gender, EnrollmentStatus, Province, Region, District, Address

admin.site.register(Student)
admin.site.register(Gender)
admin.site.register(EnrollmentStatus)
admin.site.register(Province)
admin.site.register(Region)
admin.site.register(District)
admin.site.register(Address)
