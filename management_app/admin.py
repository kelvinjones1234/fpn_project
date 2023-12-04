from django.contrib import admin

from .models import Department, Levy

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('department',)


class LevyAdmin(admin.ModelAdmin):
    list_display = ('department', 'levy', 'amount')


admin.site.register(Department, DepartmentAdmin)
admin.site.register(Levy, LevyAdmin)