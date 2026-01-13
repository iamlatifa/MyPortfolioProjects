from base_parser import BaseParser
import xml.etree.ElementTree as ET
import datetime
from typing import Any, Dict, List
from decimal import Decimal,InvalidOperation
class XMLParser(BaseParser):
    
    def validate_structure(self, root:ET.Element) -> bool:
        # Check if root element is correct
        if root.tag != 'Transactions':
            self.add_error(0, 'root', 'Root element must be <Transactions>')
            return False
        
        # Check if there are any transaction elements
        transactions = root.findall('Transaction')
        if not transactions:
            self.add_warning(0, 'No Transactions found in file')
        
        return True


    def parse(self) -> List[Dict[str, Any]]:
        transactions = []

        try:
            tree = ET.parse(self.file_path)
            root = tree.getroot()

        except ET.ParseError as e:
            self.add_error(0,"file",f"XML parse error {str(e)}")
            return []
        
        if not self.validate_structure():
            return []
        

        for line_number, transaction in enumerate(root.findall('Transaction'), start=1):
                # extract data from xml element
                transaction_data = self._extract_transaction(transaction, line_number)

                if transaction_data:
                    transactions.append(transaction_data)
                
        return transactions
        
    def _extract_transaction(self, transaction_elem: ET.Element, line_number: int) -> Dict[str, Any]:
        # extract individual transaction from XML element
        

        def get_text(tag: str, required: bool = True) -> str:
            # helper to safely get text from an XML element
            elem = transaction_elem.find(tag)
            if elem is None or elem.text is None:
                if required:
                    self.add_error(line_number, tag, f'Missing required field: {tag}')
                return ''
            return elem.text.strip()   
        
        # extract required fields
        transaction_id = get_text('TransactionID')
        account_number = get_text('AccountNumber')
        amount_str = get_text('Amount')
        transaction_date_str = get_text('TransactionDate')
        transaction_type = get_text('TransactionType')
        currency = get_text('Currency')
        status = get_text('Status')
        description = get_text('Description', required=False)

        # skip transaction if required fields are missing
        if not all([transaction_id, account_number, amount_str, transaction_date_str, transaction_type, currency, status]):
            return None
        

        # parse amount
        try:
            amount = Decimal(amount_str)
        except InvalidOperation:
            self.add_error(line_number, 'Amount', f'Invalid amount format: {amount_str}')
            return None
        
        # parse date 
        try:
            transaction_date = datetime.datetime.strptime(transaction_date_str, '%Y-%m-%d').date()
        except ValueError:
            self.add_error(line_number, 'TransactionDate', f'Invalid date format: {transaction_date_str}. Expected YYYY-MM-DD')
            return None
        
        # parse type
        try:
            transaction_type = transaction_type.upper()
            if transaction_type not in ['CREDIT', 'DEBIT']:
                raise ValueError()
        except ValueError:
            self.add_error(line_number, 'TransactionType', f'Invalid transaction type: {transaction_type}. Must be CREDIT or DEBIT')
            return None
        
        return {
            "transaction_id" :transaction_id,
            "account_number" :account_number,
            "amount" :amount,
            "excution_date":transaction_date,
            "transaction_type":transaction_type,
            "currency":currency,
            "status":status,
            "description":description
        }
        
