from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

from .models import School


class SchoolAdmin(LeafletGeoAdmin):
    pass


admin.site.register(School, SchoolAdmin)
