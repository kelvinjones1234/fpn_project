# Generated by Django 4.2.7 on 2023-11-13 20:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('management_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='levy',
            options={'verbose_name_plural': 'Levies'},
        ),
        migrations.RemoveField(
            model_name='department',
            name='levy_name',
        ),
    ]
