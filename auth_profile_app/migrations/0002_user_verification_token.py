# Generated by Django 4.2.7 on 2023-12-04 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_profile_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='verification_token',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]