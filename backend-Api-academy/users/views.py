from django.shortcuts import render

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({"error": "Usuario inactivo"}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    role = user.groups.first().name if user.groups.exists() else None
    roles = list(user.groups.values_list("name", flat=True))
    permissions = list(user.get_all_permissions())

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": role,
        "roles": roles,
        "permissions": permissions,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    role = request.user.groups.first().name if request.user.groups.exists() else None
    roles = list(request.user.groups.values_list("name", flat=True))
    permissions = list(request.user.get_all_permissions())
    return Response({
        "user": {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
        },
        "role": role,
        "roles": roles,
        "permissions": permissions
    })
