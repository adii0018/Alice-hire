from django.db import models
import random
import string

def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class Session(models.Model):
    code = models.CharField(max_length=6, unique=True, default=generate_code)
    host = models.IntegerField()
    mode = models.CharField(max_length=20, choices=[('interview', 'Interview'), ('meeting', 'Meeting')])
    config = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='active')
    
    class Meta:
        db_table = 'sessions'
    
    def __str__(self):
        return f"Session {self.code}"
