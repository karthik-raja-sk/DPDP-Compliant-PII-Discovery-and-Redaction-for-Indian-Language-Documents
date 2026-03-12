from fastapi import HTTPException, status

class BaseAppException(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)

class EntityNotFoundException(BaseAppException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            detail=f"{entity_name} with id {entity_id} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )

class AuthException(BaseAppException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED
        )

class PIIProcessingException(BaseAppException):
    def __init__(self, detail: str):
        super().__init__(
            detail=f"PII Processing Error: {detail}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
