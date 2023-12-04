from django.db import models
from django.utils import timezone

class Department(models.Model):
    department = models.CharField(max_length=200)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.department
    
class Levy(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    levy = models.CharField(max_length=6, verbose_name='Fee')
    amount = models.CharField(max_length=200)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.levy
    
    class Meta:
        verbose_name_plural = 'Levies'
