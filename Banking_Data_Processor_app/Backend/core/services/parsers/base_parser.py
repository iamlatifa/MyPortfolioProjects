from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List

class BaseParser(ABC):
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.errors = []
        self.warnings = []


    """Parse the input data and return a list of dictionaries."""

    @abstractmethod
    def parse(self) -> List[Dict[str, Any]]:
        """
        Parse the file and return a list of transaction records.
        
        Returns:
            List of dictionaries, each representing a transaction:
            [
                {
                    'transaction_id': '12345',
                    'account_number': 'ACC001',
                    'amount': 1500.50,
                    'transaction_date': datetime(2024, 1, 15),
                    'transaction_type': 'CREDIT',
                    'description': 'Salary payment',
                    'currency': 'USD',
                    'status': 'COMPLETED'
                },
                ...
            ]
        """

    def validate_structure(self) -> bool:
        """
        Validate the structure of a single record.
        
        Args:
            record: A dictionary representing a transaction record.
        
        Returns:
            True if the record structure is valid, False otherwise.
        """

    def add_error(self, line_number :int, feild : str, message :str) :
        self.errors.append({
            "line" : line_number,
            "field" : feild,
            "message" : message,
            "timestamp" : datetime.now()
        })

    def has_errors(self) -> bool:
        return len(self.errors) > 0 
    

    def add_warning(self, line_number :int, feild : str, message :str) :
        self.warnings.append({
            "line" : line_number,
            "field" : feild,
            "message" : message,
            "timestamp" : datetime.now()
        })


    def clear_errors(self):
        """Clear all errors and warnings (useful for reusing parser)"""
        self.errors = []
        self.warnings = []