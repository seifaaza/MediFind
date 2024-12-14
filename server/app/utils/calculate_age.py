from datetime import datetime

def calculate_age(date_of_birth: str) -> int:
    """
    Calculate the user's age based on their date_of_birth.
    Assumes date_of_birth is in ISO 8601 format (e.g., 'YYYY-MM-DD').
    """
    birth_date = datetime.fromisoformat(date_of_birth)
    today = datetime.today()
    age = today.year - birth_date.year
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    return age
