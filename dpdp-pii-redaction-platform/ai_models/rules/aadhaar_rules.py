import re

def validate_aadhaar(aadhaar_num: str) -> bool:
    """
    Verifies Aadhaar number using Verhoeff algorithm or basic length check.
    Aadhaar is a 12-digit unique identity number.
    """
    # Basic cleanup
    num = aadhaar_num.replace(" ", "").replace("-", "")
    if len(num) != 12 or not num.isdigit():
        return False
    
    # Aadhaar should not start with 0 or 1
    if num[0] in ['0', '1']:
        return False
        
    return True

def mask_aadhaar(aadhaar_num: str, partial: bool = True) -> str:
    num = aadhaar_num.replace(" ", "")
    if partial:
        return f"XXXX XXXX {num[-4:]}"
    return "XXXX XXXX XXXX"
