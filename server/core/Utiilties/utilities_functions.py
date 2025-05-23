from celery.exceptions import Ignore
from django.core.mail import EmailMessage
import datetime
import jwt
from django.template.loader import render_to_string
from rest_framework.response import Response
from rest_framework import status
from core.Utiilties.config import ConfData
import logging
from celery import shared_task
from core.Utiilties.enum import TokenType
from django.conf import settings

logger = logging.getLogger(__name__)

config_data = ConfData.get_data()


def email_sender(email, subject, body):
    try:
        email_message = EmailMessage(subject, body, to=[email])
        email_message.content_subtype = 'html'
        email_message.send()
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False


def token_generator(user_id, token_type):
    try:

        # token_life_time = get_token_life_time(token_type)
        token_life_time = datetime.timedelta(minutes=2)
        algorithm = config_data['algorithm']
        if token_type.access:
            token_life_time = config_data['access_token_life_time']
        elif token_type.active:
            token_life_time = config_data['active_token_life_time']
        elif token_type.reset:
            token_life_time = config_data['reset_token_life_time']
        payload = {
            'id': user_id,
            'exp': datetime.datetime.now(datetime.UTC) + token_life_time,
            "type": token_type.name,
            'iat': datetime.datetime.now(datetime.UTC)
        }
        # return jwt.encode(payload, settings.SECRET_KEY, algorithm=algorithm).decode('utf-8')
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=algorithm)
    except:
        return Response(data="Internal Server Error", status=status.HTTP_400_BAD_REQUEST)


@shared_task(name='activation_email_sender')
def activation_email_sender(email, user_id):
    if not config_data['is_active_required']:
        print("Activation email sending is disabled in the configuration.")
        Ignore("Activation email sending is disabled in the configuration.")
        return False

    try:
        token = token_generator(user_id=user_id, token_type=TokenType.active)
        active_user_url = config_data['urls']['active_user_url']
        context = {'activation_url': active_user_url + token, 'logo_url': config_data['logo_url']}
        template_path = 'emails/active_user.html'
        html_content = render_to_string(template_path, context)
        return email_sender(email=email, body=html_content, subject='User Activation Email', )
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return False


@shared_task(name='reset_password_email_sender')
def reset_password_email_sender(email, user_id):
    try:

        token = token_generator(user_id=user_id, token_type=TokenType.reset)
        reset_password_url = config_data['urls']['reset_password_url']
        logo_url = config_data['logo_url']
        context = {'reset_password_url': reset_password_url + token, 'logo_url': logo_url}
        template_path = 'emails/reset_password.html'
        html_content = render_to_string(template_path, context)
        return email_sender(email=email, body=html_content, subject='Reset Password')

    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return False
