# Generated by Django 4.2.7 on 2023-12-16 13:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth_profile_app', '0003_alter_user_verification_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='verification_token',
        ),
    ]