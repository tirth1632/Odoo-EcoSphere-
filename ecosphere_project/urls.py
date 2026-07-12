"""
URL configuration for ecosphere_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.contrib.staticfiles.views import serve
from esg_app import views

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    
    # HTML template pages
    path("", views.index_view, name="index"),
    path("index.html", views.index_view),
    path("login.html", views.login_view, name="login"),
    path("dashboard.html", views.dashboard_view, name="dashboard"),
    path("profile.html", views.profile_view, name="profile"),
    path("challenges.html", views.challenges_view, name="challenges"),
    path("rewards.html", views.rewards_view, name="rewards"),
    path("settings.html", views.settings_view, name="settings"),
    
    # REST API endpoints
    path("api/state/", views.get_state, name="api_get_state"),
    path("api/state/save/", views.save_state, name="api_save_state"),
    path("api/reports/pdf/", views.generate_pdf_report, name="api_generate_pdf"),
    
    # Direct Root Static Files
    path("styles.css", serve, {"path": "styles.css"}),
    path("app.js", serve, {"path": "app.js"}),
    path("esg_hero_illustration.png", serve, {"path": "esg_hero_illustration.png"}),
]
