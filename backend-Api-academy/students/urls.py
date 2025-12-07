from rest_framework import routers
from .views import StudentQueryViewSet, GenderViewSet, StudentViewSet, StudentProfileViewSet

app_name = 'students'

router = routers.DefaultRouter()
router.register(r'filter', StudentQueryViewSet, basename='students-query')
router.register(r'genders', GenderViewSet, basename='genders')
router.register(r'profiles', StudentProfileViewSet,
                basename='student-profiles')
router.register(r'', StudentViewSet, basename='students')

urlpatterns = router.urls
