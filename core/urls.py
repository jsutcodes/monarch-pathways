from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    # TODO: Connect authentication routing (e.g., path('api/v1/auth/', include('authentication.urls')))
    # TODO: Connect students routing (e.g., path('api/v1/', include('students.urls')))
    # TODO: Connect meetings routing (e.g., path('api/v1/', include('meetings.urls')))
]
