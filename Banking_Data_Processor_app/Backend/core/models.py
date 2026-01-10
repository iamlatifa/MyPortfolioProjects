from django.db import models


class Batch(models.Model):
    batch_id = models.BigAutoField(primary_key=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_transactions = models.IntegerField()

    def __str__(self):
        return f"Batch {self.batch_id}"


class Transaction(models.Model):
    transaction_id = models.BigAutoField(primary_key=True)
    account_number = models.DecimalField(max_digits=20, decimal_places=0)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    transaction_type = models.CharField(max_length=50)
    execution_date = models.DateField()
    status = models.CharField(max_length=10)
    currency = models.CharField(max_length=3)

    batch = models.ForeignKey(
        Batch,
        on_delete=models.DO_NOTHING,
        related_name="transactions"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.transaction_id} - {self.status}"


class TransactionError(models.Model):
    id = models.BigAutoField(primary_key=True)
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.DO_NOTHING,
        related_name="errors"
    )
    error_message = models.TextField()
    error_code = models.CharField(max_length=50)
    error_type = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Error {self.error_code} on Transaction {self.transaction.transaction_id}"
