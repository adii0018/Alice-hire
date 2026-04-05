from django.db import models

class Alert(models.Model):
    session_code = models.CharField(max_length=6)
    type = models.CharField(max_length=50)
    severity = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'alerts'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"Alert {self.type} - {self.session_code}"
