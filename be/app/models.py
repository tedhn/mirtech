from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    zip_code: str
    country: str
    date_of_birth: str
    gender: str
    created_at: str
    last_login: Optional[str] = None 
    is_active: bool

class Address(BaseModel):
    address: str
    city: str
    zip_code: str
    country: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    address: Address
    date_of_birth: str  
    gender: str  
    created_at: str  
    last_login: Optional[str] = None 
    is_active: bool
    
class UserResponseById(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    address: Address
    date_of_birth: str  
    gender: str  
    created_at: str  
    last_login: Optional[str] = None 
    is_active: bool
    
class UserCreateRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    zip_code: str
    country: str
    date_of_birth: str
    gender: str
    is_active: bool = True

# Response Model
class UserCreateResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    address: Address
    date_of_birth: str
    gender: str
    created_at: str
    last_login: Optional[str]
    is_active: bool
    message: str
    
class UserUpdateRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    zip_code: str
    country: str
    date_of_birth: str
    gender: str
    is_active: bool
    
class UserUpdateResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    address: Address
    date_of_birth: str
    gender: str
    created_at: str
    last_login: Optional[str]
    is_active: bool
    message: str
    
class UserDeleteResponse(BaseModel):
    id: int 
    message: str