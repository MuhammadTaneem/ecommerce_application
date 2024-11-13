from django.core.mail import EmailMessage


def email_sender(email, subject, body):
    try:
        email = EmailMessage(subject, body, to=[email])
        email.content_subtype = 'html'
        email.send()
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False
