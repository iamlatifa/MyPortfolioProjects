# Define database tables in Python using Django ORM


from django.db import models

class ValidTransaction(models.Model):
    ValidTransaction_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)
    transaction_type = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    account_number = models.CharField(max_length=20)
    execution_date = models.DateField()
    timestamp = models.DateTimeField(auto_now_add=True)
    batch = models.ForeignKey('UploadBatch', on_delete=models.CASCADE, null=True)

    # When you display this object as text, show this instead of a useless default
    # It will show in admin as: Transaction 12 - VALID
    def __str__(self):
        return f"Transaction {self.ValidTransaction_id} - {self.status}"

class RejectedTransaction(models.Model):
    RejectedTransaction_id = models.AutoField(primary_key=True)
    batch = models.ForeignKey('UploadBatch', on_delete=models.CASCADE)
    error_message = models.TextField()
    row_data = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


    # It will show in admin as: Rejected Transaction in Batch BATCH_2025_01
    def __str__(self):
        return f"Rejected in Batch {self.batch_id} at {self.timestamp}"


class UploadBatch(models.Model):
    batch_id = models.CharField(max_length=50, primary_key=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_transactions = models.IntegerField()
    

    def __str__(self):
        return self.batch_id
