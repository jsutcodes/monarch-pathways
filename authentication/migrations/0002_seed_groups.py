from django.db import migrations

def create_system_roles(apps, schema_editor):
    # Dynamically fetch the Group model safely within the migration context
    Group = apps.get_model('auth', 'Group')
    
    # Precise roles outlined in Monarch Pathways documentation
    roles = ['Admin', 'Lead Mentor', 'Mentor']
    
    for role_name in roles:
        Group.objects.get_or_create(name=role_name)

def remove_system_roles(apps, schema_editor):
    # Provides rollback capabilities to keep migrations reversible
    Group = apps.get_model('auth', 'Group')
    roles = ['Admin', 'Lead Mentor', 'Mentor']
    Group.objects.filter(name__in=roles).delete()

class Migration(migrations.Migration):

    dependencies = [
        # Points to the previous migration file in this app
        ('authentication', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(create_system_roles, reverse_code=remove_system_roles),
    ]
