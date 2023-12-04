from django.contrib import admin
from .models import Transaction

class TransactionAdmin(admin.ModelAdmin):
    model = Transaction
    list_display = ('matriculation_number', 'first_name', 'middle_name', 'last_name', 'department', 'levy', 'amount', 'email', 'reference', 'paid')
    list_filter = ('department', 'levy', 'amount',)
    readonly_fields = ['matriculation_number', 'levy', 'date', 'amount']


    fieldsets = (
        ('Student Information', {'fields': ('matriculation_number', 'first_name', 'middle_name', 'last_name', 'department', 'email')}),
        ('Payment Information', {'fields': ('levy', 'amount', 'date', 'paid')}),
    )

admin.site.register(Transaction, TransactionAdmin)