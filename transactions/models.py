from django.db import models
from management_app.models import Department, Levy
from django.utils import timezone
import secrets

class Transaction(models.Model):
    matriculation_number = models.CharField(max_length=20)
    first_name = models.CharField(max_length=20)
    middle_name = models.CharField(max_length=20, blank=True, null=True)
    last_name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    levy = models.ForeignKey(Levy, on_delete=models.CASCADE)
    amount = models.CharField(max_length=7)
    date = models.DateTimeField(default=timezone.now)
    paid = models. BooleanField(default=False)
    reference = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return f'{self.first_name} {self.middle_name} {self.last_name}'

    



