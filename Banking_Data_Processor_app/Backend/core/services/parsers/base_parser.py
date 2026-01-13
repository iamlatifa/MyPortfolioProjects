from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List

"""
    Base class for all transaction file parsers (CSV, XML, etc.).
    Responsible for:
    - Reading raw file data
    - Normalizing records
    - Collecting validation issues
"""
class BaseParser(ABC):
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.records = []
        self.errors = []
        self.warnings = []
    
    def run(self) ->List[dict [str, Any]] :
        """
        Main entry point for parsing.
        Returns normalized records (even if errors exist).
        """
        self.clear_errors()
        self.parse()
        return self.records


    """Parse the input data and return a list of dictionaries."""

    @abstractmethod
    def parse(self) -> None:
        raise NotImplementedError

    def add_record(self, record : Dict[str, Any]) ->None:
        self.records.append(record)
        

        

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


    def has_errors(self) -> bool:
        return len(self.errors) > 0

    def clear_errors(self):
        """Clear all errors and warnings (useful for reusing parser)"""
        self.records = []
        self.errors = []
        self.warnings = []

    