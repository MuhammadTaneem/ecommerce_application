from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from core.models import Role
from core.Utiilties.roles import default_roles
from django.contrib.auth import get_user_model
User = get_user_model()

@receiver(post_save, sender=User)
def assign_default_role(sender, instance, created, **kwargs):
    if created:
        customer_role = next((role for role in default_roles if role['name'] == 'Customer'), None)
        default_role, _ = Role.objects.get_or_create(name=customer_role['name'],
                                                     permissions=customer_role['permissions'],
                                                     description=customer_role['description'],
                                                     is_active=customer_role['is_active'])
        instance.role = default_role
        instance.save()


@receiver(post_migrate)
def create_or_update_default_roles(sender, **kwargs):
    for role in default_roles:
        obj, created = Role.objects.get_or_create(name=role['name'])
        if created:
            obj.permissions = role['permissions']
            obj.description = role['description']
            obj.is_active = role['is_active']
            obj.save()
            print(f"{obj.name} is created.")
        else:
            # Update existing role attributes if they differ
            needs_update = False

            if obj.permissions != role['permissions']:
                obj.permissions = role['permissions']
                needs_update = True

            if obj.description != role['description']:
                obj.description = role['description']
                needs_update = True

            if obj.is_active != role['is_active']:
                obj.is_active = role['is_active']
                needs_update = True

            if needs_update:
                obj.save()
                print(f"{obj.name} is updated.")
            else:
                print(f"{obj.name} already exists and is up-to-date.")

    print("Default roles have been created or updated.")
